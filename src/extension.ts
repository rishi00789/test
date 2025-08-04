import * as vscode from 'vscode';
import axios from 'axios';

// Interface for template parameters
export interface ITemplateParameters {
    ait: string;
    spk: string;
    reponame: string;
    applicationname: string;
    projectname: string;
    clusterurl: string;
    serviceid: string;
    servicename: string;
}

// Helper function to extract parameters from text content
function extractParametersFromText(content: string): Partial<ITemplateParameters> {
    const params: Partial<ITemplateParameters> = {};
    
    // Define patterns for each parameter
    const patterns = {
        ait: /(?:ait|AIT)[:\s-]+([^\s\n,]+)/gi,
        spk: /(?:spk|SPK)[:\s-]+([^\s\n,]+)/gi,
        reponame: /(?:reponame|repo|repository)[:\s-]+([^\s\n,]+)/gi,
        applicationname: /(?:applicationname|application|app)[:\s-]+([^\s\n,]+)/gi,
        projectname: /(?:projectname|project)[:\s-]+([^\s\n,]+)/gi,
        clusterurl: /(?:clusterurl|cluster|clusterURL)[:\s-]+([^\s\n,]+)/gi,
        serviceid: /(?:serviceid|serviceID|service)[:\s-]+([^\s\n,]+)/gi,
        servicename: /(?:servicename|servicename|service)[:\s-]+([^\s\n,]+)/gi
    };

    // Extract parameters using regex patterns
    for (const [key, pattern] of Object.entries(patterns)) {
        const matches = content.match(pattern);
        if (matches && matches.length > 0) {
            // Take the first match and clean it
            let value = matches[0].replace(/^(ait|spk|reponame|applicationname|projectname|clusterurl|serviceid|servicename)[:\s-]+/i, '').trim();
            (params as any)[key] = value;
        }
    }

    return params;
}

// Helper function to clean parameter values
function cleanParameterValue(value: string): string {
    if (!value) return value;
    
    // Remove common prefixes if they exist
    const prefixes = {
        'ait-': 4,
        'spk-': 4,
        'reponame-': 9,
        'applicationname-': 17,
        'projectname-': 13,
        'clusterurl-': 11,
        'serviceid-': 10,
        'servicename-': 12
    };

    for (const [prefix, length] of Object.entries(prefixes)) {
        if (value.toLowerCase().startsWith(prefix)) {
            return value.substring(length);
        }
    }
    
    return value;
}

// Function to call MCP server with parameters and display results
async function callMCPServerWithParams(
    stream: vscode.ChatResponseStream, 
    params: Partial<ITemplateParameters>
): Promise<vscode.ChatResult> {
    
    // Ensure all required parameters are present
    const requiredParams: ITemplateParameters = {
        ait: params.ait || '',
        spk: params.spk || '',
        reponame: params.reponame || '',
        applicationname: params.applicationname || '',
        projectname: params.projectname || '',
        clusterurl: params.clusterurl || '',
        serviceid: params.serviceid || '',
        servicename: params.servicename || ''
    };

    // Check for missing required parameters
    const missingParams = Object.entries(requiredParams).filter(([key, value]) => !value);
    if (missingParams.length > 0) {
        stream.markdown(`## Missing Required Parameters\n\nThe following parameters are missing:\n${missingParams.map(([key]) => `- **${key}**`).join('\n')}\n\nPlease provide all required parameters.`);
        return { metadata: { command: 'process', status: 'missing_params' } };
    }

    try {
        stream.markdown('## Processing Template...\n\nCalling MCP server with parameters...');
        
        const mcpResponse = await callMCPServer(requiredParams);
        
        stream.markdown(`## Template Processing Complete ✅

**Parameters Used:**
- **AIT**: ${requiredParams.ait}
- **SPK**: ${requiredParams.spk}
- **Repository Name**: ${requiredParams.reponame}
- **Application Name**: ${requiredParams.applicationname}
- **Project Name**: ${requiredParams.projectname}
- **Cluster URL**: ${requiredParams.clusterurl}
- **Service ID**: ${requiredParams.serviceid}
- **Service Name**: ${requiredParams.servicename}

**MCP Server Response:**
\`\`\`json
${JSON.stringify(mcpResponse, null, 2)}
\`\`\`

**Summary:**
The template has been successfully processed with your parameters and the MCP server has been called.`);

        return { metadata: { command: 'process', status: 'success' } };

    } catch (error) {
        stream.markdown(`## Template Processing - MCP Server Error ❌

**Parameters Used:**
- **AIT**: ${requiredParams.ait}
- **SPK**: ${requiredParams.spk}
- **Repository Name**: ${requiredParams.reponame}
- **Application Name**: ${requiredParams.applicationname}
- **Project Name**: ${requiredParams.projectname}
- **Cluster URL**: ${requiredParams.clusterurl}
- **Service ID**: ${requiredParams.serviceid}
- **Service Name**: ${requiredParams.servicename}

**Error Details:**
${error instanceof Error ? error.message : 'Unknown error occurred'}

**Note:** Parameters were provided, but the MCP server call failed.`);

        return { metadata: { command: 'process', status: 'error' } };
    }
}

// Function to call MCP server
async function callMCPServer(params: ITemplateParameters): Promise<any> {
    try {
        const mcpPayload = {
            "method": "tools/call",
            "params": {
                "name": "process_template",
                "arguments": {
                    "input": {
                        "ait": params.ait,
                        "spk": params.spk,
                        "reponame": params.reponame,
                        "applicationname": params.applicationname,
                        "projectname": params.projectname,
                        "clusterurl": params.clusterurl,
                        "serviceid": params.serviceid,
                        "servicename": params.servicename
                    }
                },
                "_meta": {
                    "progressToken": 1
                }
            },
            "jsonrpc": "2.0",
            "id": 1
        };

        const mcpHeaders = {
            'Content-Type': 'application/json, text/event-stream',
            'Accept': 'application/json, text/event-stream',
            'mcp-session-id': '947e4b4b8d7ea058596a9992e809eb7f346a0a8ed3ca9d04fec2fd28a76dc77d'
        };

        console.log('Calling MCP server with payload:', JSON.stringify(mcpPayload, null, 2));

        const response = await axios.post(
            'http://0.0.0.0:5001/mcp',
            mcpPayload,
            {
                headers: mcpHeaders,
                timeout: 10000
            }
        );

        console.log('MCP server response:', response.data);
        return response.data;

    } catch (error) {
        console.error('Error calling MCP server:', error);
        throw error;
    }
}

// Template Chat Participant Handler
const templateHandler: vscode.ChatRequestHandler = async (
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    _token: vscode.CancellationToken
): Promise<vscode.ChatResult> => {
    

    
    // Print incoming context to console for debugging
    console.log('Full Request:', JSON.stringify(request, null, 2));
    console.log('Full Context:', JSON.stringify(context, null, 2));

    // Extract file contents and parameters from multiple sources
    let fileContents = '';
    let extractedParams: Partial<ITemplateParameters> = {};
    let contextFound = false;
    
    // Method 1: Check current request for references
    if (request.references && request.references.length > 0) {
        console.log('Found references in current request');
        contextFound = true;
        for (const reference of request.references) {
            const refValue = reference.value as any;
            if (refValue && refValue.uri && refValue.uri.fsPath) {
                try {
                    const filePath = refValue.uri.fsPath;
                    console.log('Found file reference in current request:', filePath);
                    
                    // Read the file contents
                    const document = await vscode.workspace.openTextDocument(filePath);
                    const content = document.getText();
                    
                    fileContents += `### File: ${filePath}\n`;
                    fileContents += `**Content:**\n\`\`\`\n${content}\n\`\`\`\n\n`;
                    
                    console.log('File contents:', content);
                    
                    // Extract parameters from file content
                    const fileParams = extractParametersFromText(content);
                    extractedParams = { ...extractedParams, ...fileParams };
                    
                } catch (error) {
                    console.error('Error reading file:', error);
                    fileContents += `### File: ${refValue.uri.fsPath}\n`;
                    fileContents += `**Error reading file:** ${error}\n\n`;
                }
            }
        }
    }
    
    // Method 2: Check context history for references
    if (!contextFound && context.history && context.history.length > 0) {
        console.log('Checking context history for references');
        for (const message of context.history) {
            if ('prompt' in message && message.references && message.references.length > 0) {
                contextFound = true;
                for (const reference of message.references) {
                    const refValue = reference.value as any;
                    if (refValue && refValue.uri && refValue.uri.fsPath) {
                        try {
                            const filePath = refValue.uri.fsPath;
                            console.log('Found file reference in history:', filePath);
                            
                            // Read the file contents
                            const document = await vscode.workspace.openTextDocument(filePath);
                            const content = document.getText();
                            
                            fileContents += `### File: ${filePath}\n`;
                            fileContents += `**Content:**\n\`\`\`\n${content}\n\`\`\`\n\n`;
                            
                            console.log('File contents:', content);
                            
                            // Extract parameters from file content
                            const fileParams = extractParametersFromText(content);
                            extractedParams = { ...extractedParams, ...fileParams };
                            
                        } catch (error) {
                            console.error('Error reading file:', error);
                            fileContents += `### File: ${refValue.uri.fsPath}\n`;
                            fileContents += `**Error reading file:** ${error}\n\n`;
                        }
                    }
                }
            }
        }
    }
    
    // Method 3: Check for active editor content
    if (!contextFound) {
        console.log('Checking active editor for context');
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            const document = activeEditor.document;
            const content = document.getText();
            
            // Only process if it looks like a markdown or config file
            if (document.fileName.endsWith('.md') || 
                document.fileName.endsWith('.txt') || 
                document.fileName.endsWith('.json') ||
                document.fileName.endsWith('.yaml') ||
                document.fileName.endsWith('.yml')) {
                
                contextFound = true;
                fileContents += `### Active Editor: ${document.fileName}\n`;
                fileContents += `**Content:**\n\`\`\`\n${content}\n\`\`\`\n\n`;
                
                console.log('Active editor contents:', content);
                
                // Extract parameters from file content
                const fileParams = extractParametersFromText(content);
                extractedParams = { ...extractedParams, ...fileParams };
            }
        }
    }
    
    // Method 4: Check workspace for common config files
    if (!contextFound) {
        console.log('Checking workspace for common config files');
        try {
            const workspaceFiles = await vscode.workspace.findFiles(
                '**/*.{md,txt,json,yaml,yml}',
                '**/node_modules/**'
            );
            
            // Look for files that might contain our parameters
            for (const file of workspaceFiles.slice(0, 5)) { // Limit to first 5 files
                try {
                    const document = await vscode.workspace.openTextDocument(file);
                    const content = document.getText();
                    
                    // Check if content contains any of our parameter keywords
                    const hasParams = /(ait|spk|reponame|applicationname|projectname|clusterurl|serviceid|servicename)/i.test(content);
                    
                    if (hasParams) {
                        contextFound = true;
                        fileContents += `### Workspace File: ${file.fsPath}\n`;
                        fileContents += `**Content:**\n\`\`\`\n${content}\n\`\`\`\n\n`;
                        
                        console.log('Workspace file contents:', content);
                        
                        // Extract parameters from file content
                        const fileParams = extractParametersFromText(content);
                        extractedParams = { ...extractedParams, ...fileParams };
                        break; // Use the first file that contains parameters
                    }
                } catch (error) {
                    console.error('Error reading workspace file:', error);
                }
            }
        } catch (error) {
            console.error('Error searching workspace files:', error);
        }
    }

    // Clean the extracted parameters
    const cleanedParams: Partial<ITemplateParameters> = {};
    for (const [key, value] of Object.entries(extractedParams)) {
        if (value) {
            (cleanedParams as any)[key] = cleanParameterValue(value);
        }
    }

    // Display context information
    stream.markdown('## Template Parameter Extraction\n\n');
    
    if (contextFound) {
        stream.markdown('✅ **Context found and processed successfully!**\n\n');
    } else {
        stream.markdown('⚠️ **No context found in this request.**\n\n');
        stream.markdown('**Tips for better context detection:**\n');
        stream.markdown('- Make sure your markdown file is open in the editor\n');
        stream.markdown('- Try attaching the file to your chat message\n');
        stream.markdown('- Or run the command again after the file is loaded\n\n');
    }

    // Add file contents if found
    if (fileContents) {
        stream.markdown('## File Contents Found\n\n');
        stream.markdown(fileContents);
    } else {
        stream.markdown('## No File Contents Found\n\n');
        stream.markdown('No files with parameter information were detected in the current context.\n\n');
    }

    // Display extracted parameters
    stream.markdown('## Extracted Parameters\n\n');
    
    const allParams = ['ait', 'spk', 'reponame', 'applicationname', 'projectname', 'clusterurl', 'serviceid', 'servicename'];
    
    if (Object.keys(cleanedParams).length > 0) {
        stream.markdown('**Parameters found in file contents:**\n\n');
        for (const param of allParams) {
            const value = (cleanedParams as any)[param];
            if (value) {
                stream.markdown(`- **${param.toUpperCase()}**: ${value}\n`);
            } else {
                stream.markdown(`- **${param.toUpperCase()}**: Not found\n`);
            }
        }
        
        stream.markdown('\n**Do you want to use these default values or edit them?**\n\n');
        
        // Show notification with buttons
        const choice = await vscode.window.showInformationMessage(
            'Parameters found in file contents. Do you want to use these default values or edit them?',
            'Use Defaults',
            'Edit Parameters'
        );
        
        if (choice === 'Use Defaults') {
            stream.markdown('**Using default values...**\n');
            return await callMCPServerWithParams(stream, cleanedParams);
        } else if (choice === 'Edit Parameters') {
            stream.markdown('**Opening input dialogs for editing...**\n');
            return await collectParametersFromUser(stream, cleanedParams);
        } else {
            // User cancelled
            stream.markdown('**Process cancelled by user.**\n');
            return { metadata: { command: 'process', status: 'cancelled' } };
        }
        
    } else {
        stream.markdown('**No parameters found in file contents.**\n\n');
        stream.markdown('Proceeding to input dialogs for all parameters...\n');
        
        // Proceed directly to input dialogs
        return await collectParametersFromUser(stream, {});
    }
};

// Function to collect parameters from user input dialogs
async function collectParametersFromUser(
    stream: vscode.ChatResponseStream, 
    defaultParams: Partial<ITemplateParameters>
): Promise<vscode.ChatResult> {
    
    const params: ITemplateParameters = {
        ait: '',
        spk: '',
        reponame: '',
        applicationname: '',
        projectname: '',
        clusterurl: '',
        serviceid: '',
        servicename: ''
    };

    // Collect parameters through input dialogs
    const aitInput = await vscode.window.showInputBox({
        prompt: 'Enter AIT parameter',
        placeHolder: 'Enter AIT value...',
        value: defaultParams.ait || '',
        validateInput: (value) => {
            if (!value || value.trim() === '') {
                return 'AIT parameter is required';
            }
            return null;
        }
    });

    if (!aitInput) {
        stream.markdown('❌ **AIT parameter is required. Process cancelled.**');
        return { metadata: { command: 'process', status: 'cancelled' } };
    }
    params.ait = aitInput;

    const spkInput = await vscode.window.showInputBox({
        prompt: 'Enter SPK parameter',
        placeHolder: 'Enter SPK value...',
        value: defaultParams.spk || '',
        validateInput: (value) => {
            if (!value || value.trim() === '') {
                return 'SPK parameter is required';
            }
            return null;
        }
    });

    if (!spkInput) {
        stream.markdown('❌ **SPK parameter is required. Process cancelled.**');
        return { metadata: { command: 'process', status: 'cancelled' } };
    }
    params.spk = spkInput;

    const reponameInput = await vscode.window.showInputBox({
        prompt: 'Enter Repository Name',
        placeHolder: 'Enter repository name...',
        value: defaultParams.reponame || '',
        validateInput: (value) => {
            if (!value || value.trim() === '') {
                return 'Repository name is required';
            }
            return null;
        }
    });

    if (!reponameInput) {
        stream.markdown('❌ **Repository name is required. Process cancelled.**');
        return { metadata: { command: 'process', status: 'cancelled' } };
    }
    params.reponame = reponameInput;

    const applicationnameInput = await vscode.window.showInputBox({
        prompt: 'Enter Application Name',
        placeHolder: 'Enter application name...',
        value: defaultParams.applicationname || '',
        validateInput: (value) => {
            if (!value || value.trim() === '') {
                return 'Application name is required';
            }
            return null;
        }
    });

    if (!applicationnameInput) {
        stream.markdown('❌ **Application name is required. Process cancelled.**');
        return { metadata: { command: 'process', status: 'cancelled' } };
    }
    params.applicationname = applicationnameInput;

    const projectnameInput = await vscode.window.showInputBox({
        prompt: 'Enter Project Name',
        placeHolder: 'Enter project name...',
        value: defaultParams.projectname || '',
        validateInput: (value) => {
            if (!value || value.trim() === '') {
                return 'Project name is required';
            }
            return null;
        }
    });

    if (!projectnameInput) {
        stream.markdown('❌ **Project name is required. Process cancelled.**');
        return { metadata: { command: 'process', status: 'cancelled' } };
    }
    params.projectname = projectnameInput;

    const clusterurlInput = await vscode.window.showInputBox({
        prompt: 'Enter Cluster URL',
        placeHolder: 'Enter cluster URL...',
        value: defaultParams.clusterurl || '',
        validateInput: (value) => {
            if (!value || value.trim() === '') {
                return 'Cluster URL is required';
            }
            return null;
        }
    });

    if (!clusterurlInput) {
        stream.markdown('❌ **Cluster URL is required. Process cancelled.**');
        return { metadata: { command: 'process', status: 'cancelled' } };
    }
    params.clusterurl = clusterurlInput;

    const serviceidInput = await vscode.window.showInputBox({
        prompt: 'Enter Service ID',
        placeHolder: 'Enter service ID...',
        value: defaultParams.serviceid || '',
        validateInput: (value) => {
            if (!value || value.trim() === '') {
                return 'Service ID is required';
            }
            return null;
        }
    });

    if (!serviceidInput) {
        stream.markdown('❌ **Service ID is required. Process cancelled.**');
        return { metadata: { command: 'process', status: 'cancelled' } };
    }
    params.serviceid = serviceidInput;

    const servicenameInput = await vscode.window.showInputBox({
        prompt: 'Enter Service Name',
        placeHolder: 'Enter service name...',
        value: defaultParams.servicename || '',
        validateInput: (value) => {
            if (!value || value.trim() === '') {
                return 'Service name is required';
            }
            return null;
        }
    });

    if (!servicenameInput) {
        stream.markdown('❌ **Service name is required. Process cancelled.**');
        return { metadata: { command: 'process', status: 'cancelled' } };
    }
    params.servicename = servicenameInput;

    // Call MCP server with collected parameters
    try {
        stream.markdown('## Processing Template...\n\nCalling MCP server with collected parameters...');
        
        const mcpResponse = await callMCPServer(params);
        
        stream.markdown(`## Template Processing Complete ✅

**Parameters Used:**
- **AIT**: ${params.ait}
- **SPK**: ${params.spk}
- **Repository Name**: ${params.reponame}
- **Application Name**: ${params.applicationname}
- **Project Name**: ${params.projectname}
- **Cluster URL**: ${params.clusterurl}
- **Service ID**: ${params.serviceid}
- **Service Name**: ${params.servicename}

**MCP Server Response:**
\`\`\`json
${JSON.stringify(mcpResponse, null, 2)}
\`\`\`

**Summary:**
The template has been successfully processed with your parameters and the MCP server has been called.`);

        return { metadata: { command: 'process', status: 'success' } };

    } catch (error) {
        stream.markdown(`## Template Processing - MCP Server Error ❌

**Parameters Collected:**
- **AIT**: ${params.ait}
- **SPK**: ${params.spk}
- **Repository Name**: ${params.reponame}
- **Application Name**: ${params.applicationname}
- **Project Name**: ${params.projectname}
- **Cluster URL**: ${params.clusterurl}
- **Service ID**: ${params.serviceid}
- **Service Name**: ${params.servicename}

**Error Details:**
${error instanceof Error ? error.message : 'Unknown error occurred'}

**Note:** Parameters were collected successfully, but the MCP server call failed.`);

        return { metadata: { command: 'process', status: 'error' } };
    }
}

export function activate(_context: vscode.ExtensionContext) {
    // Register the Template Chat Participant
    vscode.chat.createChatParticipant('workspace-analyzer.template', templateHandler);
    
    console.log('Template Chat Participant activated');
    console.log('Template participant registered: @template');
}

export function deactivate() {
    console.log('Template Chat Participant deactivated');
} 