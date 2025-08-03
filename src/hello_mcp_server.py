#!/usr/bin/env python3

"""
Simple Hello MCP Server for VS Code Extension
This demonstrates how to create an MCP server that can be called by our VS Code extension
"""

from typing import Any
from mcp.server.fastmcp import FastMCP

# Initialize FastMCP server
mcp = FastMCP("hello-server")

@mcp.tool()
async def say_hello(name: str = "World") -> str:
    """Say hello to someone.
    
    Args:
        name: The name of the person to greet (default: World)
    """
    return f"Hello, {name}! 👋 Welcome to the MCP server!"

@mcp.tool()
async def get_greeting_info() -> str:
    """Get information about available greetings and the server."""
    return """
Hello MCP Server Information:
- Server Name: hello-server
- Version: 1.0.0
- Available Tools: say_hello, get_greeting_info
- Description: A simple MCP server that provides greeting functionality
"""

@mcp.tool()
async def echo_message(message: str) -> str:
    """Echo back a message with some formatting.
    
    Args:
        message: The message to echo back
    """
    return f"📢 Echo: {message}\n\nServer received your message and is echoing it back!"

if __name__ == "__main__":
    # Initialize and run the server
    mcp.run(transport='stdio') 