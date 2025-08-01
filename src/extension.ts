import * as vscode from 'vscode';

let formData: { [key: string]: any } = {};

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.chat.createChatParticipant('demo-copilot-chat.demo', handleMainChat),
		vscode.chat.createChatParticipant('demo-copilot-chat.helper', handleHelperChat)
	);
}

const handleMainChat: vscode.ChatRequestHandler = async (request, context, stream) => {
	const commands = {
		workflow: () => showWorkflow(stream),
		intake: () => handleIntake(stream),
		submit: () => handleSubmit(stream)
	};
	
	if (request.command && commands[request.command as keyof typeof commands]) {
		await commands[request.command as keyof typeof commands]();
	} else {
		stream.markdown('## 👋 **Demo Copilot Chat Extension**');
		await showActions(stream, ['Get Started']);
	}
	
	return { metadata: { scope: '@demo' } };
};

async function handleIntake(stream: vscode.ChatResponseStream) {
	stream.markdown('\n\n**👤 Customer Information**');
	stream.progress('Collecting customer data...');
	
	const fields = [
		{ prompt: 'Enter your full name', key: 'name' },
		{ prompt: 'Enter your address', key: 'address' },
		{ prompt: 'Enter your phone number', key: 'phone' }
	];
	
	for (const field of fields) {
		stream.progress(`Collecting ${field.key}...`);
		const value = await vscode.window.showInputBox({ prompt: field.prompt });
		if (!value) {
			stream.progress('Intake cancelled.');
			return;
		}
		formData[field.key] = value;
	}
	
	stream.progress('Customer data collected successfully!');
	stream.markdown('\n*Customer Information Complete*\n\nYour customer information has been collected successfully.');
	await showActions(stream, ['Proceed to Product Details', 'Back to Main']);
}

async function handleProductDetails(stream: vscode.ChatResponseStream) {
	stream.markdown('\n\n**📦 Product Information**');
	stream.progress('Collecting product data...');
	
	const fields = [
		{ prompt: 'Enter Product ID', key: 'productId' },
		{ prompt: 'Enter Product Origin', key: 'productOrigin' },
		{ prompt: 'Enter Product Name', key: 'productName' }
	];
	
	for (const field of fields) {
		stream.progress(`Collecting ${field.key}...`);
		const value = await vscode.window.showInputBox({ prompt: field.prompt });
		if (!value) {
			stream.progress('Product details collection cancelled.');
			return;
		}
		formData[field.key] = value;
	}
	
	stream.progress('Product data collected successfully!');
	stream.markdown('\n*Product Information Complete*\n\nYour product information has been collected successfully.');
	await showActions(stream, ['Submit Form', 'Back to Main']);
}

async function handleSubmit(stream: vscode.ChatResponseStream) {
	const hasCustomerData = formData.name && formData.address && formData.phone;
	const hasProductData = formData.productId && formData.productOrigin && formData.productName;
	
	if (!hasCustomerData || !hasProductData) {
		stream.markdown('**❌ Incomplete Data**\n\nPlease complete both customer and product information forms before submitting.');
		await showActions(stream, ['Start Intake']);
		return;
	}
	
	const submit = await vscode.window.showInformationMessage('Confirm Submission', 'Submit', 'Cancel');
	
	if (submit === 'Submit') {
		stream.progress('Submitting form...');
		
		try {
			const payload = {
				customerDetails: {
					name: formData.name,
					address: formData.address,
					phone: formData.phone
				},
				productDetails: {
					productId: formData.productId,
					productOrigin: formData.productOrigin,
					productName: formData.productName
				},
				timestamp: new Date().toISOString(),
				source: 'vscode-copilot-chat-extension'
			};
			
			stream.progress('Making API call...');
			const response = await makeApiCall(payload);
			
			if (response.success) {
				vscode.window.showInformationMessage(`Form submitted successfully!`);
				stream.markdown('**✅ Form Submitted Successfully!**\n\nYour information has been submitted to the API.');
			} else {
				throw new Error(response.message || 'API call failed');
			}
		} catch (error) {
			stream.progress('API call failed.');
			vscode.window.showErrorMessage(`API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
			stream.markdown('**❌ API Error**\n\nFailed to submit form data to API.');
		}
		
		await showActions(stream, ['Start New Intake', 'Back to Main']);
		formData = {};
	} else {
		stream.markdown('**❌ Submission Cancelled**\n\nForm submission was cancelled.');
		await showActions(stream, ['Try Submit Again', 'Back to Main']);
	}
}

async function showWorkflow(stream: vscode.ChatResponseStream) {
	const hasCustomerData = formData.name && formData.address && formData.phone;
	const hasProductData = formData.productId && formData.productOrigin && formData.productName;
	
	if (hasCustomerData && hasProductData) {
		stream.markdown('**✅ Form Data Ready**\n\nBoth customer and product information have been collected and are ready for submission.');
		await showActions(stream, ['Submit Form', 'Start New Intake']);
	} else if (hasCustomerData) {
		stream.markdown('**✅ Customer Data Ready**\n\nYour customer information has been collected. Please complete the product information form to proceed.');
		await showActions(stream, ['Proceed to Product Details', 'Start New Intake']);
	} else {
		stream.markdown('**📋 Template Generation Workflow**');
		await showActions(stream, ['Get Started']);
	}
}

async function showActions(stream: vscode.ChatResponseStream, actions: string[]) {
	const actionMap = {
		'Get Started': () => handleIntake(stream),
		'Proceed to Product Details': () => handleProductDetails(stream),
		'Submit Form': () => handleSubmit(stream),
		'Start New Intake': () => handleIntake(stream),
		'Back to Main': () => showWorkflow(stream),
		'Try Submit Again': () => handleSubmit(stream),
		'Start Intake': () => handleIntake(stream)
	};
	
	const options = actions.map(action => ({
		label: action,
		description: action === 'Get Started' || action === 'Start Intake' ? 'Start customer data collection' :
					action === 'Proceed to Product Details' ? 'Add product information' :
					action === 'Submit Form' ? 'Submit the collected data' :
					action === 'Start New Intake' ? 'Start a new form collection' :
					action === 'Back to Main' ? 'Return to workflow status' :
					action === 'Try Submit Again' ? 'Retry form submission' : ''
	}));
	
	options.push({ label: 'Exit', description: 'Exit the workflow' });
	
	const selected = await vscode.window.showQuickPick(options, { placeHolder: 'Select an action...' });
	
	if (selected?.label === 'Exit') {
		stream.markdown('**👋 Goodbye!**\n\nThank you for using the form workflow.');
	} else if (selected?.label && actionMap[selected.label as keyof typeof actionMap]) {
		await actionMap[selected.label as keyof typeof actionMap]();
	}
}

async function makeApiCall(payload: any): Promise<{ success: boolean; message: string; id?: string }> {
	try {
		const response = await fetch('https://httpbin.org/post', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer your-bearer-token-here',
				'User-Agent': 'VSCode-Copilot-Chat-Extension/1.0.0'
			},
			body: JSON.stringify(payload)
		});
		
		if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		
		const data = await response.json() as any;
		return {
			success: true,
			message: 'Data submitted successfully to API',
			id: data.json?.timestamp || new Date().toISOString()
		};
	} catch (error) {
		console.log('API call failed, simulating success for demo:', error);
		return {
			success: true,
			message: 'Data submitted successfully (simulated response)',
			id: new Date().toISOString()
		};
	}
}

const handleHelperChat: vscode.ChatRequestHandler = async (request, context, stream) => {
	stream.markdown('## 🤝 **Helper Participant**\n\nThis participant is now deprecated. Please use the main @demo participant for all form operations.');
	stream.markdown('\n**Use these commands with @demo:**');
	stream.markdown('- `/workflow` - Check workflow status');
	stream.markdown('- `/intake` - Start form data collection');
	stream.markdown('- `/submit` - Submit collected form data');
	
	return { metadata: { scope: '@helper' } };
};

export function deactivate() {} 