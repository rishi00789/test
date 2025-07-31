# Demo Copilot Chat Extension

A VS Code extension that demonstrates how to create a custom chat participant for VS Code Copilot Chat with form-based workflows.

## Features

- **@demo Chat Participant**: A custom chat participant that can be invoked with `@demo` in VS Code Copilot Chat
- **@demo-hello Chat Participant**: A dedicated hello participant for quick greetings
- **Hello World Command**: A command that can be invoked from the chat participant
- **Interactive Responses**: Rich markdown responses with buttons and suggested questions
- **Form-based Workflows**: Intake forms with submit functionality and toast notifications

## Installation

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run compile` to compile the TypeScript code
4. Press `F5` in VS Code to launch the extension in debug mode

## Usage

### Chat Participants

1. Open VS Code Copilot Chat
2. Type `@demo` or `@demo-hello` followed by your message
3. The chat participant will respond with interactive content

### Slash Commands

Use these commands with `@demo`:

- **`/hello`** - Get a friendly greeting with buttons and suggestions
- **`/help`** - Show all available commands and features
- **`/info`** - Get detailed information about the extension
- **`/workflow`** - Start a form-based intake workflow

### Examples

- `@demo hello` - Gets a greeting response with buttons and suggested questions
- `@demo /workflow` - Starts an intake form workflow
- `@demo /help` - Shows all available commands
- `@demo-hello` - Gets a dedicated hello response

### Form Workflow

The `/workflow` command creates an interactive form with:

1. **Form Display**: Shows sample form fields (Name, Address, Phone)
2. **Submit Button**: Click to submit the form data
3. **Toast Notification**: Shows a confirmation message at the bottom
4. **Response Generation**: Provides a "Workflow completed" response

### Command Palette

1. Open the Command Palette (`Cmd+Shift+P` on macOS, `Ctrl+Shift+P` on Windows/Linux)
2. Type "Hello World" and select the command
3. You should see a notification message

## Chat Participant Features

Based on the [VS Code Chat Participant API](https://code.visualstudio.com/api/extension-guides/ai/chat), this extension demonstrates:

1. **Chat Participant Registration**: Properly registers chat participants with IDs `demo-copilot-chat.demo` and `demo-copilot-chat.demo-hello`
2. **Request Handling**: Processes user prompts and provides appropriate responses
3. **Rich Responses**: Uses markdown formatting, buttons, and suggested questions
4. **Command Integration**: Includes buttons that can invoke VS Code commands
5. **Form Workflows**: Demonstrates form-based interactions with submit functionality

### Configuration

The chat participants are configured in `package.json` with:

**Main Participant (@demo):**
- **ID**: `demo-copilot-chat.demo`
- **Name**: `demo` (used for @-mentions)
- **Full Name**: `Demo Copilot Chat`
- **Description**: `Ask me anything about this demo extension`
- **Slash Commands**: `/hello`, `/help`, `/info`, `/workflow`

**Hello Participant (@demo-hello):**
- **ID**: `demo-copilot-chat.demo-hello`
- **Name**: `demo-hello` (used for @-mentions)
- **Full Name**: `Demo Hello`
- **Description**: `Get a friendly hello message`

## Development

- **TypeScript**: The extension is written in TypeScript
- **VS Code API**: Uses the VS Code Extension API and Chat Participant API
- **Node.js**: Requires Node.js 20+ (see `.nvmrc`)

## Troubleshooting

### Deprecation Warnings

If you see deprecation warnings about `punycode` or `Buffer()`, this is due to Node.js version compatibility. The extension requires Node.js 20+ to avoid these warnings.

### Chat Participant Not Visible

Make sure you're using VS Code 1.85+ which supports the Chat Participant API. The `@demo` and `@demo-hello` participants should appear in the chat input when you type `@`.

### Form Functionality

The form workflow uses sample data for demonstration. In a production environment, you would integrate with actual input fields and data processing.

## API Reference

This extension implements the [VS Code Chat Participant API](https://code.visualstudio.com/api/extension-guides/ai/chat) which includes:

- `vscode.chat.createChatParticipant()` - Creates chat participants
- `vscode.ChatRequestHandler` - Handles chat requests
- `vscode.ChatResponseStream` - Streams responses with markdown, buttons, etc.
- `vscode.commands.registerCommand()` - Registers commands for button interactions

## License

MIT License - see LICENSE file for details. 