from fastmcp import FastMCP
from pydantic import BaseModel

# Initialize FastMCP
mcp = FastMCP("hello-mcp-server")

# Define input model for the hello tool
class HelloInput(BaseModel):
    name: str = "World"

# Define input model for the template tool
class TemplateInput(BaseModel):
    ait: str
    spk: str
    repo: str
    application_name: str
    project_name: str
    cluster_url: str
    service_id: str
    service_password: str

# Define the hello tool using @mcp.tool() decorator
@mcp.tool()
async def hello(input: HelloInput) -> str:
    """
    Say hello to someone.
    This tool takes a name and returns a greeting message.
    """
    return f"Hello, {input.name}! 👋"

# Define the template tool using @mcp.tool() decorator
@mcp.tool()
async def process_template(input: TemplateInput) -> str:
    """
    Process template with AIT, SPK, and repository parameters.
    This tool processes template requests and returns the parameters in a formatted response.
    """
    result = f"""
## MCP Template Processing Complete

**Input Parameters:**
- **AIT**: {input.ait}
- **SPK**: {input.spk}
- **Repository**: {input.repo}
- **Application Name**: {input.application_name}
- **Project Name**: {input.project_name}
- **Cluster URL**: {input.cluster_url}
- **Service ID**: {input.service_id}
- **Service Password**: ***

**Response:**
Here are the parameters you provided:
- AIT: {input.ait}
- SPK: {input.spk}
- Repository: {input.repo}
- Application Name: {input.application_name}
- Project Name: {input.project_name}
- Cluster URL: {input.cluster_url}
- Service ID: {input.service_id}
- Service Password: ***

The MCP template tool has successfully processed your request.
    """
    
    return result.strip()

if __name__ == "__main__":
    import asyncio
    print("🚀 Starting Hello MCP Server")
    print("📍 Endpoint: http://localhost:5001/mcp")
    print("📋 Available tools:")
    print("   - hello: Say hello to someone")
    print("\n🔧 Starting server...")
    
    # Run the server using streamable HTTP transport
    asyncio.run(mcp.run_http_async(
        host="0.0.0.0",
        port=5001,
        transport="streamable-http",
        path="/mcp"
    )) 