#!/bin/bash

# Setup script for the Hello MCP Server
echo "Setting up Hello MCP Server..."

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed. Please install Python 3.10 or higher."
    exit 1
fi

# Check Python version
python_version=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
required_version="3.10"

if [ "$(printf '%s\n' "$required_version" "$python_version" | sort -V | head -n1)" != "$required_version" ]; then
    echo "Error: Python $python_version is installed, but Python $required_version or higher is required."
    exit 1
fi

echo "Python version: $python_version ✓"

# Install pip if not available
if ! command -v pip3 &> /dev/null; then
    echo "Installing pip3..."
    python3 -m ensurepip --upgrade
fi

# Install MCP dependencies
echo "Installing MCP dependencies..."
pip3 install -r requirements.txt

# Make the server executable
chmod +x hello_mcp_server.py

echo "Setup complete! You can now run the MCP server with:"
echo "python3 hello_mcp_server.py"
echo ""
echo "Or test it with the VS Code extension using:"
echo "#mcp toolName: \"say_hello\" toolArguments: {\"name\": \"Your Name\"}" 