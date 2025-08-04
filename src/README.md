# Chat Context Debug Extension

This VS Code extension provides a chat participant for debugging and displaying chat context information provided by Copilot.

## Chat Participant

### @template
The Template Processor chat participant helps you debug and understand the chat context that Copilot provides.

**Usage:**
```
@template /process
```

**What it does:**
- Displays complete chat context information
- Shows request details and parameters
- Lists all available context properties
- Displays conversation history
- Shows workspace and file context information
- Helps understand what context Copilot provides

## Features

- **Context Debugging**: Displays all available context information from Copilot
- **Request Analysis**: Shows request command, prompt, and other details
- **History Display**: Lists conversation history and messages
- **Property Inspection**: Shows all available context properties and their values
- **Workspace Context**: Displays workspace and file context information

## Installation

1. Install the extension from the VS Code marketplace
2. The chat participant will be available in the VS Code Chat view
3. Use `@template /process` to invoke the participant and see context information

## Development

To build and run this extension:

```bash
npm install
npm run compile
npm run watch
```

Press F5 in VS Code to launch the extension in a new Extension Development Host window.

## Usage Examples

**Basic Context Debug:**
```
@template /process
```

This will display all the context information that Copilot provides, including:
- Request details
- Context properties
- Conversation history
- Workspace information
- File context
- And more...

The extension is designed to help you understand what context information is available when building chat participants. 