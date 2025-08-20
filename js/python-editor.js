class PythonEditor {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentFile = 'main.py';
        this.files = {
            'main.py': '# Welcome to Python Editor\nprint("Hello, World!")\n\n# Write your Python code here\n'
        };
        this.output = [];
        this.isRunning = false;
        this.init();
    }

    init() {
        this.container.innerHTML = '';
        this.createEditor();
        this.addOutputLine('Python Editor v1.0 - Ready');
        this.addOutputLine('Click "Run Code" to execute your Python script');
        this.addOutputLine('');
    }

    createEditor() {
        const editorHTML = `
            <div class="python-editor-container" style="height: 100%; display: flex; flex-direction: column;">
                <!-- Toolbar -->
                <div class="editor-toolbar bg-dark p-2 border-bottom border-success">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <i class="fab fa-python text-warning me-2" style="font-size: 1.2em;"></i>
                            <span class="text-success fw-bold">Python Editor</span>
                            <span class="text-muted ms-2" id="currentFileName">${this.currentFile}</span>
                        </div>
                        <div class="btn-group">
                            <button class="btn btn-success btn-sm" onclick="pythonEditor.runCode()">
                                <i class="fas fa-play"></i> Run Code
                            </button>
                            <button class="btn btn-outline-success btn-sm" onclick="pythonEditor.newFile()">
                                <i class="fas fa-file"></i> New
                            </button>
                            <button class="btn btn-outline-success btn-sm" onclick="pythonEditor.saveFile()">
                                <i class="fas fa-save"></i> Save
                            </button>
                            <button class="btn btn-outline-warning btn-sm" onclick="pythonEditor.clearOutput()">
                                <i class="fas fa-trash"></i> Clear Output
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Main Editor Area -->
                <div class="editor-main" style="flex: 1; display: flex; height: calc(100% - 60px);">
                    <!-- Code Editor Panel -->
                    <div class="code-panel" style="flex: 1; display: flex; flex-direction: column; border-right: 1px solid #00ff00;">
                        <div class="editor-header bg-dark p-2 border-bottom border-success">
                            <small class="text-success">
                                <i class="fas fa-code"></i> Code Editor
                            </small>
                        </div>
                        <div class="code-editor-area" style="flex: 1; position: relative; background: #1e1e1e;">
                            <div class="line-numbers" style="
                                position: absolute;
                                left: 0;
                                top: 0;
                                width: 50px;
                                height: 100%;
                                background: #2d2d2d;
                                color: #666;
                                font-family: 'Courier New', monospace;
                                font-size: 14px;
                                line-height: 1.5;
                                padding: 10px 5px;
                                text-align: right;
                                border-right: 1px solid #444;
                                overflow: hidden;
                            " id="lineNumbers">1</div>
                            <textarea 
                                id="codeTextarea" 
                                class="code-textarea"
                                style="
                                    position: absolute;
                                    left: 51px;
                                    top: 0;
                                    right: 0;
                                    bottom: 0;
                                    background: transparent;
                                    border: none;
                                    color: #00ff00;
                                    font-family: 'Courier New', monospace;
                                    font-size: 14px;
                                    line-height: 1.5;
                                    padding: 10px;
                                    resize: none;
                                    outline: none;
                                    tab-size: 4;
                                    white-space: pre;
                                    overflow-wrap: normal;
                                    overflow-x: auto;
                                "
                                placeholder="# Write your Python code here...
print('Hello, World!')

# Example: Variables and functions
name = 'Python Programmer'
age = 25

def greet(name, age):
    return f'Hello {name}, you are {age} years old!'

result = greet(name, age)
print(result)

# Example: Lists and loops
numbers = [1, 2, 3, 4, 5]
for num in numbers:
    print(f'Number: {num}')

# Example: Dictionary
person = {
    'name': 'Alice',
    'age': 30,
    'city': 'New York'
}

for key, value in person.items():
    print(f'{key}: {value}')
">${this.files[this.currentFile]}</textarea>
                        </div>
                    </div>

                    <!-- Output Panel -->
                    <div class="output-panel" style="flex: 1; display: flex; flex-direction: column;">
                        <div class="output-header bg-dark p-2 border-bottom border-success">
                            <small class="text-success">
                                <i class="fas fa-terminal"></i> Output Console
                            </small>
                        </div>
                        <div class="output-console" id="outputConsole" style="
                            flex: 1;
                            background: #000;
                            color: #00ff00;
                            font-family: 'Courier New', monospace;
                            font-size: 14px;
                            padding: 10px;
                            overflow-y: auto;
                            white-space: pre-wrap;
                        "></div>
                    </div>
                </div>

                <!-- Status Bar -->
                <div class="status-bar bg-dark p-2 border-top border-success">
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">
                            <span id="statusText">Ready</span>
                        </small>
                        <small class="text-muted">
                            Lines: <span id="lineCount">1</span> | 
                            Characters: <span id="charCount">0</span> |
                            Python 3.x
                        </small>
                    </div>
                </div>
            </div>
        `;

        this.container.innerHTML = editorHTML;
        this.setupEventListeners();
        this.updateLineNumbers();
        this.updateStats();
    }

    setupEventListeners() {
        const textarea = document.getElementById('codeTextarea');
        const lineNumbers = document.getElementById('lineNumbers');

        // Update line numbers and stats on input
        textarea.addEventListener('input', () => {
            this.updateLineNumbers();
            this.updateStats();
            this.saveCurrentFile();
        });

        // Sync scroll between textarea and line numbers
        textarea.addEventListener('scroll', () => {
            lineNumbers.scrollTop = textarea.scrollTop;
        });

        // Handle tab key for proper indentation
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const value = textarea.value;
                
                textarea.value = value.substring(0, start) + '    ' + value.substring(end);
                textarea.selectionStart = textarea.selectionEnd = start + 4;
                
                this.updateLineNumbers();
                this.updateStats();
            }
        });

        // Auto-save on focus loss
        textarea.addEventListener('blur', () => {
            this.saveCurrentFile();
        });
    }

    updateLineNumbers() {
        const textarea = document.getElementById('codeTextarea');
        const lineNumbers = document.getElementById('lineNumbers');
        const lines = textarea.value.split('\n').length;
        
        let lineNumbersText = '';
        for (let i = 1; i <= lines; i++) {
            lineNumbersText += i + '\n';
        }
        
        lineNumbers.textContent = lineNumbersText;
    }

    updateStats() {
        const textarea = document.getElementById('codeTextarea');
        const lines = textarea.value.split('\n').length;
        const chars = textarea.value.length;
        
        document.getElementById('lineCount').textContent = lines;
        document.getElementById('charCount').textContent = chars;
    }

    saveCurrentFile() {
        const textarea = document.getElementById('codeTextarea');
        this.files[this.currentFile] = textarea.value;
    }

    newFile() {
        const fileName = prompt('Enter new file name:', 'script.py');
        if (fileName && fileName.trim()) {
            const cleanName = fileName.trim();
            if (!cleanName.endsWith('.py')) {
                cleanName += '.py';
            }
            
            this.files[cleanName] = '# New Python file\nprint("Hello from ' + cleanName + '")\n\n';
            this.currentFile = cleanName;
            
            document.getElementById('currentFileName').textContent = this.currentFile;
            document.getElementById('codeTextarea').value = this.files[this.currentFile];
            
            this.updateLineNumbers();
            this.updateStats();
            this.setStatus('Created new file: ' + this.currentFile);
        }
    }

    saveFile() {
        this.saveCurrentFile();
        this.setStatus('File saved: ' + this.currentFile);
        this.addOutputLine('File saved: ' + this.currentFile);
    }

    clearOutput() {
        document.getElementById('outputConsole').innerHTML = '';
        this.output = [];
        this.setStatus('Output cleared');
    }

    setStatus(message) {
        document.getElementById('statusText').textContent = message;
        setTimeout(() => {
            document.getElementById('statusText').textContent = 'Ready';
        }, 3000);
    }

    addOutputLine(text, className = '') {
        const console = document.getElementById('outputConsole');
        const line = document.createElement('div');
        line.className = className;
        line.textContent = text;
        console.appendChild(line);
        console.scrollTop = console.scrollHeight;
        this.output.push(text);
    }

    runCode() {
        if (this.isRunning) {
            this.addOutputLine('Code is already running...', 'text-warning');
            return;
        }

        this.saveCurrentFile();
        const code = this.files[this.currentFile];
        
        if (!code.trim()) {
            this.addOutputLine('No code to run. Please write some Python code first.', 'text-warning');
            return;
        }

        this.isRunning = true;
        this.setStatus('Running code...');
        
        this.addOutputLine('=== Running ' + this.currentFile + ' ===', 'text-info');
        this.addOutputLine('');

        // Simulate Python execution
        setTimeout(() => {
            this.executePythonCode(code);
        }, 500);
    }

    executePythonCode(code) {
        try {
            const lines = code.split('\n');
            let variables = {};
            let functions = {};
            let output = [];
            
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                
                if (line === '' || line.startsWith('#')) continue;
                
                // Handle import statements
                if (line.startsWith('import ') || line.startsWith('from ')) {
                    this.addOutputLine(`Imported: ${line}`, 'text-success');
                    continue;
                }
                
                // Handle print statements with advanced features
                if (line.includes('print(')) {
                    const printMatch = line.match(/print\((.*)\)/);
                    if (printMatch) {
                        let content = printMatch[1];
                        
                        // Handle multiple arguments
                        if (content.includes(',')) {
                            const args = content.split(',').map(arg => arg.trim());
                            let result = [];
                            
                            for (const arg of args) {
                                if (arg.match(/^['"`].*['"`]$/)) {
                                    result.push(arg.slice(1, -1));
                                } else if (variables[arg] !== undefined) {
                                    result.push(variables[arg]);
                                } else if (!isNaN(arg)) {
                                    result.push(arg);
                                } else {
                                    result.push(arg);
                                }
                            }
                            this.addOutputLine(result.join(' '));
                        }
                        // Handle f-strings with expressions
                        else if (content.startsWith('f"') || content.startsWith("f'")) {
                            let fstring = content.slice(2, -1);
                            // Replace variables in curly braces
                            fstring = fstring.replace(/{([^}]+)}/g, (match, expr) => {
                                if (variables[expr] !== undefined) {
                                    return variables[expr];
                                }
                                // Handle simple expressions like {x + 1}
                                if (expr.includes('+')) {
                                    const [left, right] = expr.split('+').map(s => s.trim());
                                    const leftVal = variables[left] !== undefined ? variables[left] : (isNaN(left) ? left : parseFloat(left));
                                    const rightVal = variables[right] !== undefined ? variables[right] : (isNaN(right) ? right : parseFloat(right));
                                    return leftVal + rightVal;
                                }
                                return expr;
                            });
                            this.addOutputLine(fstring);
                        }
                        // Handle string literals
                        else if (content.match(/^['"`].*['"`]$/)) {
                            content = content.slice(1, -1);
                            this.addOutputLine(content);
                        }
                        // Handle variables
                        else if (variables[content] !== undefined) {
                            this.addOutputLine(variables[content]);
                        }
                        // Handle expressions
                        else if (content.includes('+') || content.includes('-') || content.includes('*') || content.includes('/')) {
                            try {
                                // Simple expression evaluation
                                let expr = content;
                                for (const [varName, varValue] of Object.entries(variables)) {
                                    expr = expr.replace(new RegExp(`\\b${varName}\\b`, 'g'), varValue);
                                }
                                const result = eval(expr);
                                this.addOutputLine(result);
                            } catch (e) {
                                this.addOutputLine(content);
                            }
                        }
                        else {
                            this.addOutputLine(content);
                        }
                    }
                }
                
                // Handle variable assignments with expressions
                else if (line.includes('=') && !line.includes('==') && !line.includes('!=') && !line.includes('<=') && !line.includes('>=')) {
                    const [varName, varValue] = line.split('=').map(s => s.trim());
                    
                    if (varValue.match(/^['"`].*['"`]$/)) {
                        variables[varName] = varValue.slice(1, -1);
                    } else if (!isNaN(varValue)) {
                        variables[varName] = parseFloat(varValue);
                    } else if (varValue.startsWith('[') && varValue.endsWith(']')) {
                        // Handle lists
                        try {
                            const listContent = varValue.slice(1, -1);
                            const items = listContent.split(',').map(item => {
                                item = item.trim();
                                if (item.match(/^['"`].*['"`]$/)) {
                                    return item.slice(1, -1);
                                } else if (!isNaN(item)) {
                                    return parseFloat(item);
                                }
                                return item;
                            });
                            variables[varName] = items;
                        } catch (e) {
                            variables[varName] = varValue;
                        }
                    } else if (varValue.includes('+') || varValue.includes('-') || varValue.includes('*') || varValue.includes('/')) {
                        // Handle expressions
                        try {
                            let expr = varValue;
                            for (const [vName, vValue] of Object.entries(variables)) {
                                expr = expr.replace(new RegExp(`\\b${vName}\\b`, 'g'), vValue);
                            }
                            variables[varName] = eval(expr);
                        } catch (e) {
                            variables[varName] = varValue;
                        }
                    } else if (variables[varValue] !== undefined) {
                        variables[varName] = variables[varValue];
                    } else {
                        variables[varName] = varValue;
                    }
                }
                
                // Handle for loops with lists and ranges
                else if (line.startsWith('for ')) {
                    const forRangeMatch = line.match(/for (\w+) in range\((\d+)(?:,\s*(\d+))?\):/);
                    const forListMatch = line.match(/for (\w+) in (\w+):/);
                    
                    if (forRangeMatch) {
                        const [, varName, start, end] = forRangeMatch;
                        const startNum = end ? parseInt(start) : 0;
                        const endNum = end ? parseInt(end) : parseInt(start);
                        
                        for (let j = startNum; j < endNum; j++) {
                            variables[varName] = j;
                            // Execute indented block
                            let k = i + 1;
                            while (k < lines.length && (lines[k].startsWith('    ') || lines[k].trim() === '')) {
                                if (lines[k].trim() !== '') {
                                    this.executeLineInContext(lines[k].trim(), variables, functions);
                                }
                                k++;
                            }
                        }
                        // Skip processed lines
                        while (i + 1 < lines.length && (lines[i + 1].startsWith('    ') || lines[i + 1].trim() === '')) {
                            i++;
                        }
                    } else if (forListMatch) {
                        const [, varName, listName] = forListMatch;
                        if (variables[listName] && Array.isArray(variables[listName])) {
                            for (const item of variables[listName]) {
                                variables[varName] = item;
                                // Execute indented block
                                let k = i + 1;
                                while (k < lines.length && (lines[k].startsWith('    ') || lines[k].trim() === '')) {
                                    if (lines[k].trim() !== '') {
                                        this.executeLineInContext(lines[k].trim(), variables, functions);
                                    }
                                    k++;
                                }
                            }
                            // Skip processed lines
                            while (i + 1 < lines.length && (lines[i + 1].startsWith('    ') || lines[i + 1].trim() === '')) {
                                i++;
                            }
                        }
                    }
                }
                // Handle function definitions (basic)
                else if (line.startsWith('def ')) {
                    const funcMatch = line.match(/def (\w+)\((.*)\):/);
                    if (funcMatch) {
                        const funcName = funcMatch[1];
                        const params = funcMatch[2].split(',').map(p => p.trim());
                        
                        // Store function (simplified)
                        functions[funcName] = { params, line: i };
                    }
                }
            }

            this.addOutputLine('');
            this.addOutputLine('=== Execution completed ===', 'text-success');
            
        } catch (error) {
            this.addOutputLine('Error: ' + error.message, 'text-danger');
            this.addOutputLine('=== Execution failed ===', 'text-danger');
        }

        this.isRunning = false;
        this.setStatus('Code execution completed');
    }
}

// Global variable for Python editor instance
let pythonEditor;

// Function to open Python editor modal
function openPythonEditorModal() {
    const modal = new bootstrap.Modal(document.getElementById('pythonEditorModal'));
    modal.show();
    
    // Initialize Python editor when modal is shown
    document.getElementById('pythonEditorModal').addEventListener('shown.bs.modal', function () {
        if (!pythonEditor) {
            pythonEditor = new PythonEditor('pythonEditorContainer');
        }
    });
}
