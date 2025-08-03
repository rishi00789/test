# MCP Server Integration Guide

This guide explains how to use the Python MCP (Model Context Protocol) server with our VS Code extension to extend the capabilities of VS Code Copilot.

## 🎯 Overview

We've created a Python MCP server that provides simple greeting tools and integrated it with our VS Code extension. This allows VS Code Copilot to call external MCP server tools through our extension.

## 📁 Project Structure

```
vscode-copilot-chat-extension/
├── src/
│   ├── extension.ts                    # Main extension with MCP integration
│   ├── hello_mcp_server.py            # Python MCP server
│   ├── requirements.txt               # Python dependencies
│   ├── setup_mcp_server.sh           # Setup script
│   └── mcp_venv/                     # Python virtual environment
├── package.json                       # Extension manifest
└── README.md                         # Main documentation
```

## 🚀 Quick Start

### 1. Setup the Python MCP Server

```bash
# Navigate to the src directory
cd src

# Create and activate virtual environment
python3 -m venv mcp_venv
source mcp_venv/bin/activate

# Install MCP dependencies
pip install -r requirements.txt
```

### 2. Test the MCP Server

```bash
# Activate the virtual environment
source mcp_venv/bin/activate

# Run the MCP server
python hello_mcp_server.py
```

The server will start and listen for MCP protocol messages via STDIO.

### 3. Use with VS Code Extension

1. **Press F5** in VS Code to run the extension in a new Extension Development Host window
2. **Open Copilot Chat** in the new window
3. **Use the MCP tool** with the `#mcp` syntax:

```
#mcp toolName: "say_hello" toolArguments: {"name": "Your Name"}
```

## 🔧 Available MCP Tools

Our Python MCP server provides three tools:

### 1. `say_hello`
Greets a person with a custom message.

**Parameters:**
- `name` (string, optional): Name to greet (default: "World")

**Example:**
```
#mcp toolName: "say_hello" toolArguments: {"name": "Alice"}
```

**Response:**
```
Hello, Alice! 👋 Welcome to the MCP server!
```

### 2. `get_greeting_info`
Returns information about the MCP server and available tools.

**Parameters:** None

**Example:**
```
#mcp toolName: "get_greeting_info"
```

**Response:**
```
Hello MCP Server Information:
- Server Name: hello-server
- Version: 1.0.0
- Available Tools: say_hello, get_greeting_info, echo_message
- Description: A simple MCP server that provides greeting functionality
```

### 3. `echo_message`
Echoes back a message with formatting.

**Parameters:**
- `message` (string, required): Message to echo back

**Example:**
```
#mcp toolName: "echo_message" toolArguments: {"message": "Hello from VS Code!"}
```

**Response:**
```
📢 Echo: Hello from VS Code!

Server received your message and is echoing it back!
```

## 🔌 How the Integration Works

### 1. VS Code Extension MCP Tool

Our extension includes an MCP tool (`#mcp`) that can:

- **Connect to MCP servers** by running commands
- **Call MCP tools** with parameters
- **Return results** formatted for VS Code Copilot
- **Manage server lifecycle** automatically

### 2. MCP Protocol Communication

The integration uses the MCP protocol to communicate between:

1. **VS Code Extension** → **MCP Server** (via STDIO)
2. **MCP Server** → **VS Code Extension** (JSON-RPC messages)
3. **VS Code Extension** → **VS Code Copilot** (formatted responses)

### 3. Tool Registration

The MCP tool is registered in `package.json`:

```json
{
  "name": "workspace-analyzer_mcpTool",
  "toolReferenceName": "mcp",
  "displayName": "MCP Server Tool",
  "modelDescription": "Call tools from external MCP servers...",
  "inputSchema": {
    "type": "object",
    "properties": {
      "serverCommand": {
        "type": "string",
        "description": "The command to start the MCP server"
      },
      "toolName": {
        "type": "string",
        "description": "The name of the MCP tool to call"
      },
      "toolArguments": {
        "type": "object",
        "description": "Arguments to pass to the MCP tool"
      }
    },
    "required": ["toolName"]
  }
}
```

## 🛠️ Advanced Usage

### Custom MCP Server Integration

You can integrate your own MCP servers by:

1. **Creating a Python MCP server** following the [MCP documentation](https://modelcontextprotocol.io/quickstart/server)
2. **Using the `#mcp` tool** with your server command:

```
#mcp serverCommand: "python3 /path/to/your/server.py" toolName: "your_tool" toolArguments: {"param": "value"}
```

### Server Management

The extension automatically:
- **Starts servers** when needed
- **Manages connections** to multiple servers
- **Cleans up** server processes when done
- **Handles errors** gracefully

### Error Handling

Common error scenarios and solutions:

1. **Server not found**: Check the server command path
2. **Tool not found**: Verify the tool name exists in your MCP server
3. **Connection timeout**: Ensure the server starts properly
4. **Invalid arguments**: Check the tool's parameter schema

## 🔍 Debugging

### MCP Server Debugging

1. **Run the server manually** to see logs:
   ```bash
   source mcp_venv/bin/activate
   python hello_mcp_server.py
   ```

2. **Check server output** for error messages

3. **Verify tool definitions** in your server code

### VS Code Extension Debugging

1. **Open Developer Tools** in the Extension Development Host
2. **Check the console** for extension logs
3. **Use breakpoints** in the extension code

### Common Issues

1. **Python path issues**: Ensure the virtual environment is activated
2. **Permission issues**: Make sure the server script is executable
3. **Port conflicts**: The MCP server uses STDIO, so no port conflicts
4. **Dependency issues**: Verify all MCP dependencies are installed

## 📚 References

- [MCP Server Development Guide](https://modelcontextprotocol.io/quickstart/server)
- [VS Code Language Model Tools API](https://code.visualstudio.com/api/extension-guides/ai/tools)
- [MCP Protocol Specification](https://modelcontextprotocol.io/specification)

## 🎉 Example Workflow

Here's a complete example of using the MCP integration:

1. **Start VS Code Extension** (F5)
2. **Open Copilot Chat**
3. **Ask for a greeting**:
   ```
   Can you greet me using the MCP server?
   ```
4. **Copilot will use the MCP tool**:
   ```
   #mcp toolName: "say_hello" toolArguments: {"name": "User"}
   ```
5. **Get the response**:
   ```
   Hello, User! 👋 Welcome to the MCP server!
   ```

This demonstrates how VS Code Copilot can seamlessly integrate with external MCP servers through our extension! 