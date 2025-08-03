#!/usr/bin/env python3

"""
Working HTTP-based Hello MCP Server
This demonstrates the correct way to run HTTP transport with FastMCP
"""

from typing import Any
from mcp.server.fastmcp import FastMCP
import uvicorn

# Initialize FastMCP server
mcp = FastMCP("hello-server-http")

@mcp.tool()
async def say_hello(name: str = "World") -> str:
    """Say hello to someone.
    
    Args:
        name: The name of the person to greet (default: World)
    """
    return f"Hello, {name}! 👋 Welcome to the HTTP MCP server!"

@mcp.tool()
async def get_server_info() -> str:
    """Get information about the HTTP server."""
    return """
HTTP MCP Server Information:
- Server Name: hello-server-http
- Transport: HTTP
- Host: localhost
- Port: 8000
- URL: http://localhost:8000
- Available Tools: say_hello, get_server_info
"""

@mcp.tool()
async def echo_message(message: str) -> str:
    """Echo back a message with formatting.
    
    Args:
        message: The message to echo back
    """
    return f"📢 Echo: {message}\n\nHTTP server received your message!"

if __name__ == "__main__":
    print("🚀 Starting HTTP MCP Server...")
    print("📍 Server will be available at: http://localhost:8000")
    print("🔧 Use Ctrl+C to stop the server")
    print("📋 Available tools: say_hello, get_server_info, echo_message")
    print("-" * 50)
    
    # Run the server using the correct HTTP app
    uvicorn.run(
        mcp.streamable_http_app,
        host="localhost",
        port=8000,
        log_level="info"
    ) 