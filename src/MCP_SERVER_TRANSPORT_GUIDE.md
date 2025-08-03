# MCP Server Transport Modes and Host/Port Information

This guide explains the different transport modes for MCP servers and how to determine host and port information.

## 🚀 Transport Modes

MCP servers can run in three different transport modes:

### 1. STDIO Mode (Default)
- **No host/port** needed
- **Process-to-process** communication
- **Direct pipe** communication
- **Most common** for local development

### 2. HTTP Mode
- **Uses host and port**
- **Network-based** communication
- **RESTful API** interface
- **Good for** remote access

### 3. WebSocket Mode
- **Uses host and port**
- **Real-time** bidirectional communication
- **Event-driven** architecture
- **Advanced** use cases

## 📋 Current Server Configuration

### Our STDIO Server (`hello_mcp_server.py`)

```python
if __name__ == "__main__":
    mcp.run(transport='stdio')  # No host/port needed
```

**Information:**
- **Transport**: STDIO
- **Host**: N/A (process-to-process)
- **Port**: N/A (no network)
- **Connection**: Direct pipe communication

### HTTP Server Example (`hello_mcp_server_http_working.py`)

```python
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        mcp.streamable_http_app,
        host="localhost",
        port=8000,
        log_level="info"
    )
```

**Information:**
- **Transport**: HTTP
- **Host**: `localhost`
- **Port**: `8000`
- **URL**: `http://localhost:8000`

## 🔍 How to Determine Host/Port

### For STDIO Servers
```bash
# No host/port - runs as a process
python hello_mcp_server.py
```

### For HTTP Servers
```bash
# Check the server startup output
python hello_mcp_server_http_working.py
# Output: "Server will be available at: http://localhost:8000"
```

### Using MCP Inspector
```bash
# The inspector shows connection details
mcp dev hello_mcp_server.py
# Output shows proxy server and inspector URLs
```

## 🛠️ Testing Different Transport Modes

### Test STDIO Server
```bash
# Start the server
source mcp_venv/bin/activate
python hello_mcp_server.py

# Use with VS Code extension
#mcp serverCommand: "python3 hello_mcp_server.py" toolName: "say_hello"
```

### Test HTTP Server
```bash
# Start the HTTP server
source mcp_venv/bin/activate
python hello_mcp_server_simple_http.py

# Server will be available at http://localhost:8000
# You can test with curl:
curl -X POST http://localhost:8000/tools/call \
  -H "Content-Type: application/json" \
  -d '{"name": "say_hello", "arguments": {"name": "Test"}}'
```

## 🔧 VS Code Extension Integration

### STDIO Mode (Recommended)
```json
{
  "serverCommand": "python3 hello_mcp_server.py",
  "toolName": "say_hello",
  "toolArguments": {"name": "User"}
}
```

### HTTP Mode (Advanced)
```json
{
  "serverCommand": "python3 hello_mcp_server_http.py",
  "serverPort": 8000,
  "toolName": "say_hello",
  "toolArguments": {"name": "User"}
}
```

## 📊 Comparison Table

| Transport | Host/Port | Use Case | Complexity |
|-----------|-----------|----------|------------|
| STDIO | No | Local development | Simple |
| HTTP | Yes | Remote access | Medium |
| WebSocket | Yes | Real-time | Advanced |

## 🎯 Recommendations

### For Development
- **Use STDIO mode** - simpler, no network configuration
- **No host/port** management needed
- **Direct process communication**

### For Production
- **Use HTTP mode** - better for remote access
- **Configure host/port** explicitly
- **Network-based communication**

### For VS Code Extensions
- **STDIO mode** is recommended
- **Automatic process management**
- **No network dependencies**

## 🔍 Debugging Connection Issues

### STDIO Issues
```bash
# Check if server starts
python hello_mcp_server.py

# Check Python environment
source mcp_venv/bin/activate
python --version
```

### HTTP Issues
```bash
# Check if port is available
lsof -i :8000

# Test server directly
curl http://localhost:8000/health

# Check server logs
python hello_mcp_server_http.py
```

## 📚 References

- [MCP Transport Documentation](https://modelcontextprotocol.io/specification)
- [FastMCP Server Guide](https://modelcontextprotocol.io/quickstart/server)
- [VS Code Extension Integration](https://code.visualstudio.com/api/extension-guides/ai/tools) 