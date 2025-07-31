import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Extension should be present', () => {
		assert.ok(vscode.extensions.getExtension('demo-copilot-chat-extension'));
	});

	test('Should activate', async () => {
		const ext = vscode.extensions.getExtension('demo-copilot-chat-extension');
		await ext?.activate();
		assert.ok(ext?.isActive);
	});

	test('Should register hello world command', async () => {
		const commands = await vscode.commands.getCommands();
		assert.ok(commands.includes('demo-copilot-chat.hello'));
	});
}); 