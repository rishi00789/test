// Simple test script to verify extension functionality
const fs = require('fs');
const path = require('path');

console.log('Testing Demo Copilot Chat Extension...');

// Check if extension.js exists
const extensionPath = path.join(__dirname, 'out', 'extension.js');
if (fs.existsSync(extensionPath)) {
    console.log('✅ Extension compiled successfully');
    
    // Read and check the extension content
    const extensionContent = fs.readFileSync(extensionPath, 'utf8');
    if (extensionContent.includes('demo-copilot-chat.hello')) {
        console.log('✅ Hello command registered');
    } else {
        console.log('❌ Hello command not found in extension');
    }
    
    if (extensionContent.includes('Hello World from Demo Copilot Chat Extension')) {
        console.log('✅ Hello World message found');
    } else {
        console.log('❌ Hello World message not found');
    }
} else {
    console.log('❌ Extension not compiled');
}

// Check package.json
const packagePath = path.join(__dirname, 'package.json');
if (fs.existsSync(packagePath)) {
    const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    if (packageContent.contributes && packageContent.contributes.copilotChat) {
        console.log('✅ Copilot Chat scope configuration found');
        
        const scopes = packageContent.contributes.copilotChat.scopes;
        const helloScope = scopes.find(scope => scope.name === '@demo/hello');
        
        if (helloScope) {
            console.log('✅ @demo/hello scope configured');
        } else {
            console.log('❌ @demo/hello scope not found');
        }
    } else {
        console.log('❌ Copilot Chat configuration missing');
    }
    
    if (packageContent.contributes && packageContent.contributes.commands) {
        const helloCommand = packageContent.contributes.commands.find(cmd => cmd.command === 'demo-copilot-chat.hello');
        if (helloCommand) {
            console.log('✅ Hello command configured in package.json');
        } else {
            console.log('❌ Hello command not configured in package.json');
        }
    }
} else {
    console.log('❌ package.json not found');
}

console.log('\nExtension test completed!');
console.log('\nTo test the extension in VS Code:');
console.log('1. Open this folder in VS Code');
console.log('2. Press F5 to start debugging');
console.log('3. In the Extension Development Host, open Command Palette (Cmd+Shift+P)');
console.log('4. Type "Hello World" and run the command');
console.log('5. You should see a notification with "Hello World from Demo Copilot Chat Extension!"'); 