# Greeting Tool

A VS Code extension that provides a personalized greeting language model tool for VS Code Copilot. This extension enhances your VS Code experience by offering time-aware, personalized greetings with optional emojis.

## Features

### 👋 Personal Greeting Tool

Send personalized greetings with customizable names, time-aware messages, and optional emoji support.

**Capabilities:**
- Personalized greetings with customizable names (defaults to "Rishi")
- Time-aware greetings (Good morning/afternoon/evening)
- Optional emoji support with random selection
- Welcome message with helpful context about available tools

**Example Usage:**
```
#greet
#greet name: "Rishi" timeOfDay: true includeEmoji: true
#greet name: "Developer" includeEmoji: false
```

## Installation

1. Clone this repository
2. Install dependencies: `npm install`
3. Compile the extension: `npm run compile`
4. Press F5 in VS Code to run the extension in a new Extension Development Host window

## Usage with VS Code Copilot

### Agent Mode Integration

The greeting tool is automatically available in VS Code Copilot agent mode. The agent can invoke it when you say "hello", "hi", or similar greetings to provide a personalized welcome message.

### Manual Tool Reference

You can also manually reference the greeting tool in your chat prompts using the `#` syntax:

```
Say hello to me
#greet

Greet me with my name
#greet name: "Rishi"

Give me a simple greeting without emoji
#greet includeEmoji: false
```

## Tool Configuration

### Greeting Tool Parameters

- `name` (string, optional): The name to greet. Defaults to "Rishi" if not specified
- `timeOfDay` (boolean, default: true): Whether to include time-of-day specific greetings (Good morning/afternoon/evening)
- `includeEmoji` (boolean, default: true): Whether to include emojis in the greeting

## Development

### Project Structure

```
src/
├── extension.ts          # Main extension file with greeting tool implementation
package.json              # Extension manifest with tool definition
README.md                 # This documentation
```

### Building and Testing

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch for changes
npm run watch

# Run tests
npm test

# Package extension
npm run package
```

## How It Works

The greeting tool:

1. **Time Detection**: Automatically detects the current time of day
2. **Personalization**: Uses the provided name or defaults to "Rishi"
3. **Emoji Selection**: Randomly selects from a curated set of friendly emojis
4. **Welcome Context**: Provides helpful information about available tools

## Example Output

When you say "hello" in VS Code Copilot, the tool might respond with:

```
## Good morning, Rishi! 👋

**Welcome to your VS Code workspace!** 

I'm here to help you with your coding tasks. Feel free to ask me anything about your code, files, or development workflow.

How can I assist you today?
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## References

- [VS Code Language Model Tools API Documentation](https://code.visualstudio.com/api/extension-guides/ai/tools)
- [VS Code Extension API](https://code.visualstudio.com/api)
- [VS Code Copilot Agent Mode](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode) 