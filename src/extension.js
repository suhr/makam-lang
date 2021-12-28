"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
var vscode_1 = __importDefault(require("vscode"));
var terminal;
function activate(context) {
    var cmds = [
        ['language-makam.createTerminal', createTerminal],
        ['language-makam.loadScript', loadScript],
        ['language-makam.executeSelection', executeSelection],
        ['language-makam.executeLine', executeLine],
        ['language-makam.executeLineAdvance', executeLineAdvance]
    ];
    for (var _i = 0, cmds_1 = cmds; _i < cmds_1.length; _i++) {
        var _a = cmds_1[_i], n = _a[0], f = _a[1];
        vscode_1.default.commands.registerTextEditorCommand(n, f);
    }
}
exports.activate = activate;
function deactivate(_) {
    if (terminal != null) {
        terminal.dispose();
    }
}
exports.deactivate = deactivate;
function createTerminal() {
    if (terminal == null || terminal.exitStatus != undefined) {
        var config = vscode_1.default.workspace.getConfiguration('makam');
        terminal = vscode_1.default.window.createTerminal("Makam REPL", config.executablePath);
        terminal.show();
    }
}
function loadScript(t, e) {
    createTerminal();
    terminal.sendText("%usenew \"" + t.document.fileName + "\".");
}
function executeSelection(t, e) {
    createTerminal();
    var line = t.document.getText(t.selection).trim();
    terminal.sendText(line, true);
}
function executeLine(t, e) {
    createTerminal();
    var line = t.document.lineAt(t.selection.active.line).text;
    terminal.sendText(line, !line.endsWith('\n'));
}
function executeLineAdvance(t, e) {
    executeLine(t, e);
    vscode_1.default.commands.executeCommand('cursorMove', { to: "down", by: "wrappedLine" });
}
