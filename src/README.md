# MCP Template Server

A Model Context Protocol (MCP) server built with FastMCP that provides template processing tools via HTTP streaming.

## Features

- **FastMCP Integration**: Built using the FastMCP framework
- **Streamable HTTP**: Endpoint available at `http://localhost:5000/mcp`
- **Template Tools**: Two main tools for template processing
- **Pydantic Models**: Type-safe input validation

## Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Server

Start the MCP server:
```bash
python mcp_server.py
```

The server will start on `http://localhost:5000/mcp`

## Available Tools

### 1. process_template
Processes template requests with AIT, SPK, and repository parameters.

**Input Parameters:**
- `ait` (required): AIT parameter
- `spk` (required): SPK parameter  
- `repo` (required): Repository name
- `application_name` (optional): Application name
- `project_name` (optional): Project name
- `cluster_url` (optional): Cluster URL
- `service_id` (optional): Service ID
- `service_password` (optional): Service password

**Features:**
- Automatically cleans parameter prefixes (e.g., `ait-123` → `123`)
- Returns formatted response with all parameters
- Handles optional parameters gracefully

### 2. dynamic_template_processor
Simulates dynamic template processing with parameter collection.

**Input Parameters:**
- `use_defaults` (optional): Use default values for demonstration

**Features:**
- Simulates input dialog collection
- Can use default or collected parameters
- Returns formatted response

## API Usage

### HTTP Endpoint
The MCP server is available at: `http://localhost:5000/mcp`

### Example Requests

#### Process Template
```bash
curl -X POST http://localhost:5000/mcp/tools/process_template \
  -H "Content-Type: application/json" \
  -d '{
    "ait": "ait-123",
    "spk": "spk-asd", 
    "repo": "reponame-polo",
    "application_name": "applicationName-myapp",
    "project_name": "projectName-myproject",
    "cluster_url": "clusterURL-https://cluster.com",
    "service_id": "serviceID-user123",
    "service_password": "servicePassword-pass123"
  }'
```

#### Dynamic Template Processor
```bash
curl -X POST http://localhost:5000/mcp/tools/dynamic_template_processor \
  -H "Content-Type: application/json" \
  -d '{
    "use_defaults": true
  }'
```

## Integration with VS Code Extension

This MCP server can be integrated with your VS Code extension to provide additional template processing capabilities via HTTP streaming.

## Development

The server uses:
- **FastMCP**: For MCP protocol implementation
- **Pydantic**: For data validation and serialization
- **Uvicorn**: ASGI server for HTTP streaming
- **Python 3.8+**: Required for async/await support 