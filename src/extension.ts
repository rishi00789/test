import * as vscode from 'vscode';

// Interface for greeting tool parameters
export interface IGreetingToolParameters {
    name?: string;
    timeOfDay?: boolean;
    includeEmoji?: boolean;
}



// Greeting Tool
class GreetingTool implements vscode.LanguageModelTool<IGreetingToolParameters> {
    async prepareInvocation(
        options: vscode.LanguageModelToolInvocationPrepareOptions<IGreetingToolParameters>,
        _token: vscode.CancellationToken
    ) {
        const params = options.input;
        const name = params.name || 'Rishi';
        const timeOfDay = params.timeOfDay ? 'with time of day' : '';
        const emoji = params.includeEmoji ? 'with emoji' : '';
        
        const confirmationMessages = {
            title: 'Send Greeting',
            message: new vscode.MarkdownString(
                `Send a greeting to **${name}**?\n\n` +
                `This will create a personalized greeting ${timeOfDay} ${emoji}.`
            ),
        };

        return {
            invocationMessage: `Sending greeting to ${name}`,
            confirmationMessages,
        };
    }

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<IGreetingToolParameters>,
        _token: vscode.CancellationToken
    ): Promise<vscode.LanguageModelToolResult> {
        const params = options.input;
        const name = params.name || 'Rishi';
        const includeTimeOfDay = params.timeOfDay ?? true;
        const includeEmoji = params.includeEmoji ?? true;

        // Get current time for time-based greeting
        const now = new Date();
        const hour = now.getHours();
        let timeGreeting = '';
        
        if (includeTimeOfDay) {
            if (hour < 12) {
                timeGreeting = 'Good morning';
            } else if (hour < 17) {
                timeGreeting = 'Good afternoon';
            } else {
                timeGreeting = 'Good evening';
            }
        }

        // Create the greeting message
        let greeting = '';
        if (timeGreeting) {
            greeting = `${timeGreeting}, ${name}!`;
        } else {
            greeting = `Hello, ${name}!`;
        }

        // Add emoji if requested
        if (includeEmoji) {
            const emojis = ['👋', '😊', '🌟', '🎉', '✨'];
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            greeting += ` ${randomEmoji}`;
        }

        // Add some additional context
        const additionalInfo = `
        
**Welcome to your VS Code workspace!** 

I'm here to help you with your coding tasks. Feel free to ask me anything about your code, files, or development workflow.

How can I assist you today?`;

        return new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart(
                `## ${greeting}${additionalInfo}`
            )
        ]);
    }
}

export function activate(context: vscode.ExtensionContext) {
    // Register the greeting tool
    context.subscriptions.push(
        vscode.lm.registerTool('workspace-analyzer_greeting', new GreetingTool())
    );

    console.log('Greeting Language Model Tool activated');
}

export function deactivate() {
    console.log('Workspace Analyzer Language Model Tools deactivated');
} 