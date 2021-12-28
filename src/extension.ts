import vscode from 'vscode';

type Cmd = (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, ...args: any[]) => void

let terminal: vscode.Terminal;

export function activate(context: vscode.ExtensionContext) {
    const cmds: [string, Cmd][] = [
        ['language-makam.createTerminal', createTerminal],
        ['language-makam.loadScript', loadScript],
        ['language-makam.executeSelection', executeSelection],
        ['language-makam.executeLine', executeLine],
        ['language-makam.executeLineAdvance', executeLineAdvance]
    ];
    for(const [n, f] of cmds) { vscode.commands.registerTextEditorCommand(n, f) }
}

export function deactivate(_: vscode.ExtensionContext) {
    if(terminal != null) { terminal.dispose() }
}

function createTerminal() {
    if (terminal == null || terminal.exitStatus != undefined) {
        const config = vscode.workspace.getConfiguration('makam');

        terminal = vscode.window.createTerminal("Makam REPL", config.executablePath);
        terminal.show();
    }
}
function loadScript(t: vscode.TextEditor, e: vscode.TextEditorEdit) {
    createTerminal()

    terminal.sendText(`%usenew "${t.document.fileName}".`)
}
function executeSelection(t: vscode.TextEditor, e: vscode.TextEditorEdit) {
    createTerminal()

    let line = t.document.getText(t.selection).trim();
    terminal.sendText(line, true);
}
function executeLine(t: vscode.TextEditor, e: vscode.TextEditorEdit) {
    createTerminal()

    let line = t.document.lineAt(t.selection.active.line).text
    terminal.sendText(line, !line.endsWith('\n'))
}
function executeLineAdvance(t: vscode.TextEditor, e: vscode.TextEditorEdit) {
    executeLine(t, e)
    vscode.commands.executeCommand('cursorMove', { to: "down", by: "wrappedLine"})
}
