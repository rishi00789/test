#!/usr/bin/env python3
"""
Test script for the Hello MCP Server
"""

import requests
import json

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

def test_hello_tool():
    """Test the hello tool"""
    print("\n🧪 Testing hello tool...")
    
    payload = {
        "name": "Rishi"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/tools/hello",
            headers={"Content-Type": "application/json"},
            json=payload
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Hello tool test passed!")
            print(f"Response: {result}")
        else:
            print(f"❌ Hello tool test failed: {response.status_code}")
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Hello tool test error: {e}")

def test_hello_default():
    """Test the hello tool with default name"""
    print("\n🧪 Testing hello tool with default name...")
    
    payload = {}
    
    try:
        response = requests.post(
            f"{BASE_URL}/tools/hello",
            headers={"Content-Type": "application/json"},
            json=payload
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Hello tool default test passed!")
            print(f"Response: {result}")
        else:
            print(f"❌ Hello tool default test failed: {response.status_code}")
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Hello tool default test error: {e}")

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
    print("🚀 Starting Hello MCP Server Tests")
    print("=" * 50)
    
    # Check if server is running
    if not test_server_health():
        return
    
    # Test tools list
    test_tools_list()
    
    # Test hello tool
    test_hello_tool()
    test_hello_default()
    
    print("\n" + "=" * 50)
    print("🏁 Tests completed!")

if __name__ == "__main__":
    main() 