class CodeEditorTerminal {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentLanguage = 'python';
        this.files = {};
        this.currentFile = 'main.py';
        this.commandHistory = [];
        this.historyIndex = -1;
        this.init();
    }

    init() {
        this.container.innerHTML = '';
        this.createEditor();
        this.createInputLine();
        this.addLine('Code Editor Terminal v1.0');
        this.addLine('Type "help" for available commands');
        this.addLine('Languages supported: python, javascript, bash, c, cpp, java, go, rust');
        this.addLine('');
    }

    createEditor() {
        const editorContainer = document.createElement('div');
        editorContainer.className = 'code-editor-container mb-3';
        editorContainer.style.cssText = `
            background: #1e1e1e;
            border: 1px solid #00ff00;
            border-radius: 5px;
            padding: 10px;
            font-family: 'Courier New', monospace;
            color: #00ff00;
            height: 300px;
            overflow-y: auto;
            display: none;
        `;

        const editorHeader = document.createElement('div');
        editorHeader.className = 'editor-header d-flex justify-content-between align-items-center mb-2';
        editorHeader.innerHTML = `
            <span class="file-name">${this.currentFile}</span>
            <div>
                <button class="btn btn-sm btn-success me-1" onclick="codeEditor.runCode()">
                    <i class="fas fa-play"></i> Run
                </button>
                <button class="btn btn-sm btn-secondary me-1" onclick="codeEditor.saveFile()">
                    <i class="fas fa-save"></i> Save
                </button>
                <button class="btn btn-sm btn-danger" onclick="codeEditor.closeEditor()">
                    <i class="fas fa-times"></i> Close
                </button>
            </div>
        `;

        const lineNumbers = document.createElement('div');
        lineNumbers.className = 'line-numbers';
        lineNumbers.style.cssText = `
            float: left;
            width: 40px;
            color: #666;
            text-align: right;
            padding-right: 10px;
            border-right: 1px solid #333;
            margin-right: 10px;
        `;

        const codeArea = document.createElement('textarea');
        codeArea.className = 'code-area';
        codeArea.style.cssText = `
            width: calc(100% - 60px);
            height: 250px;
            background: transparent;
            border: none;
            color: #00ff00;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            resize: none;
            outline: none;
            float: left;
        `;
        codeArea.placeholder = 'Write your code here...';

        const editorContent = document.createElement('div');
        editorContent.className = 'editor-content';
        editorContent.style.overflow = 'hidden';
        editorContent.appendChild(lineNumbers);
        editorContent.appendChild(codeArea);

        editorContainer.appendChild(editorHeader);
        editorContainer.appendChild(editorContent);
        this.container.appendChild(editorContainer);

        this.editorContainer = editorContainer;
        this.codeArea = codeArea;
        this.lineNumbers = lineNumbers;

        // Update line numbers on input
        codeArea.addEventListener('input', () => this.updateLineNumbers());
        codeArea.addEventListener('scroll', () => this.syncScroll());
        
        this.updateLineNumbers();
    }

    updateLineNumbers() {
        const lines = this.codeArea.value.split('\n').length;
        let lineNumbersHtml = '';
        for (let i = 1; i <= lines; i++) {
            lineNumbersHtml += i + '\n';
        }
        this.lineNumbers.textContent = lineNumbersHtml;
    }

    syncScroll() {
        this.lineNumbers.scrollTop = this.codeArea.scrollTop;
    }

    addLine(text, className = '') {
        const line = document.createElement('div');
        line.className = `terminal-line ${className}`;
        line.textContent = text;
        this.container.appendChild(line);
        this.container.scrollTop = this.container.scrollHeight;
    }

    createInputLine() {
        const inputContainer = document.createElement('div');
        inputContainer.className = 'input-container d-flex align-items-center';
        
        const prompt = document.createElement('span');
        prompt.className = 'terminal-prompt';
        prompt.textContent = 'code-editor:~$ ';
        prompt.style.color = '#00ff00';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'terminal-input flex-grow-1';
        input.style.cssText = `
            background: transparent;
            border: none;
            color: #00ff00;
            font-family: 'Courier New', monospace;
            outline: none;
            margin-left: 5px;
        `;
        
        inputContainer.appendChild(prompt);
        inputContainer.appendChild(input);
        this.container.appendChild(inputContainer);
        
        input.focus();
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = input.value.trim();
                if (command) {
                    this.executeCommand(command);
                    this.commandHistory.push(command);
                    this.historyIndex = this.commandHistory.length;
                }
                input.value = '';
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    input.value = this.commandHistory[this.historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (this.historyIndex < this.commandHistory.length - 1) {
                    this.historyIndex++;
                    input.value = this.commandHistory[this.historyIndex];
                } else {
                    this.historyIndex = this.commandHistory.length;
                    input.value = '';
                }
            }
        });
        
        this.currentInput = input;
    }

    executeCommand(command) {
        this.addLine(`code-editor:~$ ${command}`);
        
        const parts = command.split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        switch (cmd) {
            case 'help':
                this.showHelp();
                break;
            case 'edit':
            case 'nano':
            case 'vim':
                this.openEditor(args[0]);
                break;
            case 'new':
                this.createNewFile(args[0]);
                break;
            case 'ls':
            case 'list':
                this.listFiles();
                break;
            case 'cat':
                this.showFile(args[0]);
                break;
            case 'rm':
            case 'delete':
                this.deleteFile(args[0]);
                break;
            case 'lang':
            case 'language':
                this.setLanguage(args[0]);
                break;
            case 'run':
                this.runCurrentFile();
                break;
            case 'clear':
                this.clearTerminal();
                break;
            case 'pwd':
                this.addLine('/home/coder/workspace');
                break;
            default:
                this.addLine(`Command not found: ${cmd}`);
                this.addLine('Type "help" for available commands');
        }
        
        this.createInputLine();
    }

    showHelp() {
        this.addLine('Available commands:');
        this.addLine('  edit <file>     - Open file in editor');
        this.addLine('  new <file>      - Create new file');
        this.addLine('  run             - Run current file');
        this.addLine('  ls              - List files');
        this.addLine('  cat <file>      - Display file contents');
        this.addLine('  rm <file>       - Delete file');
        this.addLine('  lang <language> - Set programming language');
        this.addLine('  clear           - Clear terminal');
        this.addLine('');
        this.addLine('Supported languages:');
        this.addLine('  python, javascript, bash, c, cpp, java, go, rust');
    }

    openEditor(filename) {
        if (!filename) {
            filename = this.currentFile;
        }
        
        this.currentFile = filename;
        this.editorContainer.style.display = 'block';
        this.editorContainer.querySelector('.file-name').textContent = filename;
        
        if (this.files[filename]) {
            this.codeArea.value = this.files[filename];
        } else {
            this.codeArea.value = this.getTemplate(filename);
        }
        
        this.updateLineNumbers();
        this.codeArea.focus();
        this.addLine(`Opened ${filename} in editor`);
    }

    createNewFile(filename) {
        if (!filename) {
            this.addLine('Usage: new <filename>');
            return;
        }
        
        this.files[filename] = '';
        this.addLine(`Created new file: ${filename}`);
        this.openEditor(filename);
    }

    listFiles() {
        const fileList = Object.keys(this.files);
        if (fileList.length === 0) {
            this.addLine('No files created yet');
        } else {
            this.addLine('Files:');
            fileList.forEach(file => {
                this.addLine(`  ${file}`);
            });
        }
    }

    showFile(filename) {
        if (!filename) {
            this.addLine('Usage: cat <filename>');
            return;
        }
        
        if (this.files[filename]) {
            this.addLine(`--- ${filename} ---`);
            const lines = this.files[filename].split('\n');
            lines.forEach(line => this.addLine(line));
            this.addLine(`--- End of ${filename} ---`);
        } else {
            this.addLine(`File not found: ${filename}`);
        }
    }

    deleteFile(filename) {
        if (!filename) {
            this.addLine('Usage: rm <filename>');
            return;
        }
        
        if (this.files[filename]) {
            delete this.files[filename];
            this.addLine(`Deleted file: ${filename}`);
        } else {
            this.addLine(`File not found: ${filename}`);
        }
    }

    setLanguage(language) {
        if (!language) {
            this.addLine(`Current language: ${this.currentLanguage}`);
            return;
        }
        
        const supportedLanguages = ['python', 'javascript', 'bash', 'c', 'cpp', 'java', 'go', 'rust'];
        if (supportedLanguages.includes(language.toLowerCase())) {
            this.currentLanguage = language.toLowerCase();
            this.addLine(`Language set to: ${this.currentLanguage}`);
        } else {
            this.addLine(`Unsupported language: ${language}`);
            this.addLine(`Supported: ${supportedLanguages.join(', ')}`);
        }
    }

    getTemplate(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        
        switch (ext) {
            case 'py':
                return '#!/usr/bin/env python3\n\ndef main():\n    print("Hello, World!")\n\nif __name__ == "__main__":\n    main()';
            case 'js':
                return 'console.log("Hello, World!");';
            case 'sh':
                return '#!/bin/bash\necho "Hello, World!"';
            case 'c':
                return '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}';
            case 'cpp':
                return '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}';
            case 'java':
                return 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}';
            case 'go':
                return 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}';
            case 'rs':
                return 'fn main() {\n    println!("Hello, World!");\n}';
            default:
                return '';
        }
    }

    saveFile() {
        this.files[this.currentFile] = this.codeArea.value;
        this.addLine(`Saved ${this.currentFile}`);
    }

    closeEditor() {
        this.editorContainer.style.display = 'none';
        this.addLine(`Closed editor`);
    }

    runCode() {
        this.saveFile();
        this.runCurrentFile();
    }

    runCurrentFile() {
        if (!this.files[this.currentFile]) {
            this.addLine('No file to run. Create a file first.');
            return;
        }

        const code = this.files[this.currentFile];
        const ext = this.currentFile.split('.').pop().toLowerCase();
        
        this.addLine(`Running ${this.currentFile}...`);
        this.addLine('--- Output ---');
        
        // Simulate code execution based on file type
        setTimeout(() => {
            this.simulateCodeExecution(code, ext);
        }, 500);
    }

    simulateCodeExecution(code, ext) {
        try {
            switch (ext) {
                case 'py':
                    this.simulatePythonExecution(code);
                    break;
                case 'js':
                    this.simulateJavaScriptExecution(code);
                    break;
                case 'sh':
                    this.simulateBashExecution(code);
                    break;
                case 'c':
                case 'cpp':
                    this.simulateCExecution(code);
                    break;
                case 'java':
                    this.simulateJavaExecution(code);
                    break;
                case 'go':
                    this.simulateGoExecution(code);
                    break;
                case 'rs':
                    this.simulateRustExecution(code);
                    break;
                default:
                    this.addLine('Execution not supported for this file type');
            }
        } catch (error) {
            this.addLine(`Error: ${error.message}`);
        }
        
        this.addLine('--- End Output ---');
        this.addLine(`Process finished with exit code 0`);
    }

    simulatePythonExecution(code) {
        // Simple Python simulation
        if (code.includes('print(')) {
            const matches = code.match(/print\(['"`]([^'"`]*)['"`]\)/g);
            if (matches) {
                matches.forEach(match => {
                    const text = match.match(/print\(['"`]([^'"`]*)['"`]\)/)[1];
                    this.addLine(text);
                });
            }
        } else {
            this.addLine('Hello, World!');
        }
    }

    simulateJavaScriptExecution(code) {
        // Simple JavaScript simulation
        if (code.includes('console.log(')) {
            const matches = code.match(/console\.log\(['"`]([^'"`]*)['"`]\)/g);
            if (matches) {
                matches.forEach(match => {
                    const text = match.match(/console\.log\(['"`]([^'"`]*)['"`]\)/)[1];
                    this.addLine(text);
                });
            }
        } else {
            this.addLine('Hello, World!');
        }
    }

    simulateBashExecution(code) {
        if (code.includes('echo ')) {
            const matches = code.match(/echo ['"`]([^'"`]*)['"`]/g);
            if (matches) {
                matches.forEach(match => {
                    const text = match.match(/echo ['"`]([^'"`]*)['"`]/)[1];
                    this.addLine(text);
                });
            }
        } else {
            this.addLine('Hello, World!');
        }
    }

    simulateCExecution(code) {
        if (code.includes('printf(')) {
            const matches = code.match(/printf\(['"`]([^'"`]*)['"`]\)/g);
            if (matches) {
                matches.forEach(match => {
                    const text = match.match(/printf\(['"`]([^'"`]*)['"`]\)/)[1];
                    this.addLine(text.replace('\\n', ''));
                });
            }
        } else {
            this.addLine('Hello, World!');
        }
    }

    simulateJavaExecution(code) {
        if (code.includes('System.out.println(')) {
            const matches = code.match(/System\.out\.println\(['"`]([^'"`]*)['"`]\)/g);
            if (matches) {
                matches.forEach(match => {
                    const text = match.match(/System\.out\.println\(['"`]([^'"`]*)['"`]\)/)[1];
                    this.addLine(text);
                });
            }
        } else {
            this.addLine('Hello, World!');
        }
    }

    simulateGoExecution(code) {
        if (code.includes('fmt.Println(')) {
            const matches = code.match(/fmt\.Println\(['"`]([^'"`]*)['"`]\)/g);
            if (matches) {
                matches.forEach(match => {
                    const text = match.match(/fmt\.Println\(['"`]([^'"`]*)['"`]\)/)[1];
                    this.addLine(text);
                });
            }
        } else {
            this.addLine('Hello, World!');
        }
    }

    simulateRustExecution(code) {
        if (code.includes('println!(')) {
            const matches = code.match(/println!\(['"`]([^'"`]*)['"`]\)/g);
            if (matches) {
                matches.forEach(match => {
                    const text = match.match(/println!\(['"`]([^'"`]*)['"`]\)/)[1];
                    this.addLine(text);
                });
            }
        } else {
            this.addLine('Hello, World!');
        }
    }

    clearTerminal() {
        this.container.innerHTML = '';
        this.createEditor();
        this.addLine('Terminal cleared');
    }
}

// Global variable for code editor instance
let codeEditor;

// Function to open code editor modal
function openCodeEditorModal() {
    const modal = new bootstrap.Modal(document.getElementById('codeEditorModal'));
    modal.show();
    
    // Initialize code editor when modal is shown
    document.getElementById('codeEditorModal').addEventListener('shown.bs.modal', function () {
        if (!codeEditor) {
            codeEditor = new CodeEditorTerminal('codeEditorTerminal');
        }
    });
}
