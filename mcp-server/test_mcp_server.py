#!/usr/bin/env python3
"""
Test script for the MCP Template Server
"""

import requests
import json
import time

# Server configuration
BASE_URL = "http://localhost:5000/mcp"

def test_server_health():
    """Test if the server is running"""
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"✅ Server health check: {response.status_code}")
        return True
    except requests.exceptions.ConnectionError:
        print("❌ Server is not running. Please start the server first.")
        return False

def test_process_template():
    """Test the process_template tool"""
    print("\n🧪 Testing process_template tool...")
    
    payload = {
        "ait": "ait-123",
        "spk": "spk-asd",
        "repo": "reponame-polo",
        "application_name": "applicationName-myapp",
        "project_name": "projectName-myproject",
        "cluster_url": "clusterURL-https://cluster.com",
        "service_id": "serviceID-user123",
        "service_password": "servicePassword-pass123"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/tools/process_template",
            headers={"Content-Type": "application/json"},
            json=payload
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ process_template test passed!")
            print(f"Response: {result}")
        else:
            print(f"❌ process_template test failed: {response.status_code}")
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"❌ process_template test error: {e}")

def test_dynamic_template_processor():
    """Test the dynamic_template_processor tool"""
    print("\n🧪 Testing dynamic_template_processor tool...")
    
    payload = {
        "use_defaults": True
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/tools/dynamic_template_processor",
            headers={"Content-Type": "application/json"},
            json=payload
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ dynamic_template_processor test passed!")
            print(f"Response: {result}")
        else:
            print(f"❌ dynamic_template_processor test failed: {response.status_code}")
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"❌ dynamic_template_processor test error: {e}")

def test_tools_list():
    """Test getting the list of available tools"""
    print("\n🧪 Testing tools list...")
    
    try:
        response = requests.get(f"{BASE_URL}/tools")
        
        if response.status_code == 200:
            tools = response.json()
            print("✅ Tools list test passed!")
            print(f"Available tools: {tools}")
        else:
            print(f"❌ Tools list test failed: {response.status_code}")
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Tools list test error: {e}")

def main():
    """Run all tests"""
    print("🚀 Starting MCP Server Tests")
    print("=" * 50)
    
    # Check if server is running
    if not test_server_health():
        return
    
    # Test tools list
    test_tools_list()
    
    # Test individual tools
    test_process_template()
    test_dynamic_template_processor()
    
    print("\n" + "=" * 50)
    print("🏁 Tests completed!")

if __name__ == "__main__":
    main() 