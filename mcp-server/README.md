# Hello MCP Server

A simple Model Context Protocol (MCP) server built with FastMCP that provides a hello tool via HTTP streaming.

## Features

- **FastMCP Integration**: Built using the FastMCP framework
- **Streamable HTTP**: Endpoint available at `http://localhost:5000/mcp`
- **Simple Hello Tool**: Just says hello to someone
- **Pydantic Models**: Type-safe input validation

## Installation

1. Install dependencies:
```bash
python3.10 -m pip install -r requirements.txt
```

## Running the Server

Start the MCP server:
```bash
python3.10 mcp_server.py
```

The server will start on `http://localhost:5000/mcp`

## Available Tools

### hello
Says hello to someone.

**Input Parameters:**
- `name` (optional): Name to greet (defaults to "World")

**Features:**
- Simple greeting functionality
- Optional name parameter
- Returns a friendly greeting message

## API Usage

### HTTP Endpoint
The MCP server is available at: `http://localhost:5000/mcp`

### Example Requests

#### Say Hello
```bash
curl -X POST http://localhost:5000/mcp/tools/hello \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rishi"
  }'
```

#### Say Hello with Default Name
```bash
curl -X POST http://localhost:5000/mcp/tools/hello \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Testing

Run the test script to verify the server functionality:
```bash
python3.10 test_hello.py
```

## Development

The server uses:
- **FastMCP**: For MCP protocol implementation
- **Pydantic**: For data validation and serialization
- **Python 3.10+**: Required for FastMCP support 