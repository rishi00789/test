# Context-Aware Template Processing Examples

This file demonstrates how the chat participants can extract parameters from conversation context and workspace files.

## Example 1: Natural Language Context

**User:** "My AIT is 12345 and I'm using repository myproject"

**User:** "@template /process"

**Expected Result:** The participant should extract:
- AIT: 12345
- Repository: myproject
- Ask for remaining parameters: SPK, Application Name, Project Name, Cluster URL, Service ID, Service Password

## Example 2: Key-Value Format Context

**User:** "ait: 12345, spk: abc123, repo: myproject"

**User:** "@template /process"

**Expected Result:** The participant should extract:
- AIT: 12345
- SPK: abc123
- Repository: myproject
- Ask for remaining parameters: Application Name, Project Name, Cluster URL, Service ID, Service Password

## Example 3: Mixed Format Context

**User:** "I'm working on application myapp with project myproject"

**User:** "@dynamic-template /collect"

**Expected Result:** The participant should:
- Show found parameters: Application Name: myapp, Project Name: myproject
- Pre-fill input dialogs with these values
- Ask for remaining parameters

## Example 4: Complex Context

**User:** "My cluster URL is https://cluster.example.com and service ID is user123"

**User:** "@template /process with ait: 12345, spk: abc123"

**Expected Result:** The participant should extract:
- AIT: 12345 (from command)
- SPK: abc123 (from command)
- Cluster URL: https://cluster.example.com (from context)
- Service ID: user123 (from context)
- Ask for remaining parameters: Repository, Application Name, Project Name, Service Password

## Example 5: Workspace File Context

**User:** "@template /process"

**Expected Result:** The participant should scan workspace files (markdown, config files) and extract any parameters found, then ask for remaining missing parameters.

## Example 6: No Context

**User:** "@template /process" (with no workspace files containing parameters)

**Expected Result:** The participant should ask for all required parameters since no context is available.

## Supported Context Patterns

The participants can understand:

1. **Natural Language:**
   - "my AIT is 123"
   - "using repository myproject"
   - "application name is myapp"

2. **Key-Value Pairs:**
   - "ait: 123"
   - "AIT = 123"
   - "ait 123"

3. **Mixed Formats:**
   - "ait: 123, spk: abc"
   - "my ait is 123 and spk is abc"

4. **Workspace Files:**
   - Scans markdown files (.md, .markdown)
   - Scans configuration files (.json, .yaml, .yml, .config)
   - Scans text files (.txt)
   - Extracts parameters from any of these file types

5. **Variations:**
   - "repo", "repository"
   - "app", "application"
   - "cluster", "clusterURL"
   - "service", "serviceID"
   - "password", "servicePassword" 