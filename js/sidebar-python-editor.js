// Sidebar Python Editor Component for ABID HACKER
// Integrated Python editor for Python course pages

class SidebarPythonEditor {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentFile = 'main.py';
        this.files = {
            'main.py': '# ABID HACKER Python Editor\n# Write your Python code here\n\n# Example: Variables and operations\nname = "ABID HACKER"\nage = 25\nscore = 95.5\n\nprint("Welcome to", name)\nprint("Age:", age)\nprint("Score:", score)\n\n# Try changing the values and running the code!'
        };
        
        this.init();
    }

    init() {
        this.container.innerHTML = `
            <div class="sidebar-python-editor">
                <div class="editor-header bg-warning text-dark p-2">
                    <div class="d-flex justify-content-between align-items-center">
                        <h6 class="mb-0"><i class="fab fa-python me-2"></i>ABID HACKER Python Editor</h6>
                        <div>
                            <button class="btn btn-sm btn-dark me-1" onclick="this.closest('.sidebar-python-editor').querySelector('.editor-body').classList.toggle('d-none')">
                                <i class="fas fa-minus"></i>
                            </button>
                            <button class="btn btn-sm btn-success" onclick="sidebarPythonEditor.runCode()">
                                <i class="fas fa-play"></i> Run
                            </button>
                        </div>
                    </div>
                </div>
                <div class="editor-body">
                    <div class="editor-toolbar bg-dark p-2">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <select class="form-select form-select-sm bg-dark text-light" style="width: auto;" onchange="sidebarPythonEditor.switchFile(this.value)">
                                    <option value="main.py">main.py</option>
                                </select>
                            </div>
                            <div>
                                <button class="btn btn-sm btn-outline-light me-1" onclick="sidebarPythonEditor.newFile()">
                                    <i class="fas fa-plus"></i> New
                                </button>
                                <button class="btn btn-sm btn-outline-light" onclick="sidebarPythonEditor.clearOutput()">
                                    <i class="fas fa-trash"></i> Clear
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="editor-content">
                        <div class="code-editor-area">
                            <textarea class="form-control bg-dark text-light python-code-input" 
                                      style="font-family: 'Courier New', monospace; font-size: 12px; height: 200px; border: none; resize: none;"
                                      placeholder="Write your Python code here...">${this.files[this.currentFile]}</textarea>
                        </div>
                        <div class="output-area bg-black text-success p-2" style="height: 150px; overflow-y: auto; font-family: monospace; font-size: 11px; border-top: 1px solid #333;">
                            <div class="output-header text-warning">Python Output Console:</div>
                            <div class="output-content"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Make editor globally accessible
        window.sidebarPythonEditor = this;
    }

    runCode() {
        const code = this.container.querySelector('.python-code-input').value;
        const outputContent = this.container.querySelector('.output-content');
        
        // Save current file
        this.files[this.currentFile] = code;
        
        // Clear previous output
        outputContent.innerHTML = '';
        
        this.addOutput('>>> Running ' + this.currentFile);
        this.addOutput('');
        
        // Simulate Python execution
        setTimeout(() => {
            this.executePythonCode(code);
        }, 300);
    }

    executePythonCode(code) {
        try {
            const lines = code.split('\n');
            let variables = {};
            let indentLevel = 0;
            let inLoop = false;
            let loopBody = [];
            let loopVar = '';
            let loopRange = 0;
            
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const trimmedLine = line.trim();
                const currentIndent = line.length - line.trimLeft().length;
                
                if (trimmedLine === '' || trimmedLine.startsWith('#')) continue;
                
                // Handle end of loop
                if (inLoop && currentIndent <= indentLevel) {
                    // Execute loop
                    for (let j = 0; j < loopRange; j++) {
                        variables[loopVar] = j;
                        for (const loopLine of loopBody) {
                            this.executeStatement(loopLine.trim(), variables);
                        }
                    }
                    inLoop = false;
                    loopBody = [];
                    indentLevel = 0;
                }
                
                // Handle loop body
                if (inLoop && currentIndent > indentLevel) {
                    loopBody.push(trimmedLine);
                    continue;
                }
                
                // Handle for loops
                if (trimmedLine.startsWith('for ')) {
                    const forMatch = trimmedLine.match(/for (\w+) in range\((\d+)\):/);
                    if (forMatch) {
                        inLoop = true;
                        loopVar = forMatch[1];
                        loopRange = parseInt(forMatch[2]);
                        indentLevel = currentIndent;
                        loopBody = [];
                        continue;
                    }
                }
                
                // Execute regular statements
                if (!inLoop) {
                    this.executeStatement(trimmedLine, variables);
                }
            }
            
            // Execute remaining loop if file ends
            if (inLoop) {
                for (let j = 0; j < loopRange; j++) {
                    variables[loopVar] = j;
                    for (const loopLine of loopBody) {
                        this.executeStatement(loopLine.trim(), variables);
                    }
                }
            }
            
            this.addOutput('');
            this.addOutput('>>> Execution completed successfully', 'text-success');
            
        } catch (error) {
            this.addOutput('Error: ' + error.message, 'text-danger');
        }
    }

    executeStatement(statement, variables) {
        // Handle import statements
        if (statement.startsWith('import ') || statement.startsWith('from ')) {
            this.addOutput(`Imported: ${statement}`, 'text-info');
            return;
        }
        
        // Handle print statements
        if (statement.includes('print(')) {
            const printMatch = statement.match(/print\((.*)\)/);
            if (printMatch) {
                let content = printMatch[1];
                this.addOutput(this.evaluateExpression(content, variables));
            }
            return;
        }
        
        // Handle variable assignments
        if (statement.includes('=') && !statement.includes('==') && !statement.includes('!=') && !statement.includes('<=') && !statement.includes('>=')) {
            const equalIndex = statement.indexOf('=');
            const varName = statement.substring(0, equalIndex).trim();
            const varValue = statement.substring(equalIndex + 1).trim();
            
            variables[varName] = this.evaluateExpression(varValue, variables, true);
            return;
        }
        
        // Handle if statements (basic)
        if (statement.startsWith('if ')) {
            const condition = statement.substring(3, statement.length - 1).trim();
            const result = this.evaluateCondition(condition, variables);
            if (result) {
                this.addOutput(`Condition '${condition}' is True`, 'text-info');
            } else {
                this.addOutput(`Condition '${condition}' is False`, 'text-info');
            }
            return;
        }
    }

    evaluateExpression(expr, variables, isAssignment = false) {
        expr = expr.trim();
        
        // Handle string literals
        if (expr.match(/^['"`].*['"`]$/)) {
            return expr.slice(1, -1);
        }
        
        // Handle f-strings
        if (expr.startsWith('f"') || expr.startsWith("f'")) {
            let fstring = expr.slice(2, -1);
            fstring = fstring.replace(/{([^}]+)}/g, (match, varExpr) => {
                return this.evaluateExpression(varExpr.trim(), variables);
            });
            return fstring;
        }
        
        // Handle numbers
        if (!isNaN(expr) && expr !== '') {
            return parseFloat(expr);
        }
        
        // Handle boolean values
        if (expr === 'True') return true;
        if (expr === 'False') return false;
        if (expr === 'None') return null;
        
        // Handle lists
        if (expr.startsWith('[') && expr.endsWith(']')) {
            try {
                const listContent = expr.slice(1, -1);
                if (listContent.trim() === '') return [];
                
                const items = this.parseList(listContent, variables);
                return items;
            } catch (e) {
                return expr;
            }
        }
        
        // Handle dictionaries
        if (expr.startsWith('{') && expr.endsWith('}')) {
            try {
                const dictContent = expr.slice(1, -1);
                if (dictContent.trim() === '') return {};
                
                const dict = {};
                const pairs = dictContent.split(',');
                for (const pair of pairs) {
                    const [key, value] = pair.split(':').map(s => s.trim());
                    dict[this.evaluateExpression(key, variables)] = this.evaluateExpression(value, variables);
                }
                return dict;
            } catch (e) {
                return expr;
            }
        }
        
        // Handle arithmetic operations
        if (expr.includes('+') || expr.includes('-') || expr.includes('*') || expr.includes('/')) {
            return this.evaluateArithmetic(expr, variables);
        }
        
        // Handle multiple arguments (for print statements)
        if (expr.includes(',') && !expr.startsWith('[') && !expr.startsWith('{')) {
            const args = this.parseArguments(expr, variables);
            return args.join(' ');
        }
        
        // Handle variables
        if (variables.hasOwnProperty(expr)) {
            const value = variables[expr];
            if (isAssignment) return value;
            
            if (Array.isArray(value)) {
                return `[${value.join(', ')}]`;
            } else if (typeof value === 'object' && value !== null) {
                return JSON.stringify(value);
            } else if (typeof value === 'string') {
                return value;
            } else {
                return String(value);
            }
        }
        
        // Handle method calls (basic)
        if (expr.includes('.')) {
            const [obj, method] = expr.split('.');
            if (variables.hasOwnProperty(obj)) {
                const objValue = variables[obj];
                if (method === 'upper()' && typeof objValue === 'string') {
                    return objValue.toUpperCase();
                } else if (method === 'lower()' && typeof objValue === 'string') {
                    return objValue.toLowerCase();
                } else if (method.startsWith('append(') && Array.isArray(objValue)) {
                    const appendValue = method.slice(7, -1);
                    objValue.push(this.evaluateExpression(appendValue, variables));
                    return `[${objValue.join(', ')}]`;
                }
            }
        }
        
        return expr;
    }

    parseList(content, variables) {
        const items = [];
        let current = '';
        let depth = 0;
        let inString = false;
        let stringChar = '';
        
        for (let i = 0; i < content.length; i++) {
            const char = content[i];
            
            if (!inString && (char === '"' || char === "'")) {
                inString = true;
                stringChar = char;
                current += char;
            } else if (inString && char === stringChar) {
                inString = false;
                current += char;
            } else if (!inString && (char === '[' || char === '{')) {
                depth++;
                current += char;
            } else if (!inString && (char === ']' || char === '}')) {
                depth--;
                current += char;
            } else if (!inString && char === ',' && depth === 0) {
                items.push(this.evaluateExpression(current.trim(), variables));
                current = '';
            } else {
                current += char;
            }
        }
        
        if (current.trim()) {
            items.push(this.evaluateExpression(current.trim(), variables));
        }
        
        return items;
    }

    parseArguments(expr, variables) {
        const args = [];
        let current = '';
        let depth = 0;
        let inString = false;
        let stringChar = '';
        
        for (let i = 0; i < expr.length; i++) {
            const char = expr[i];
            
            if (!inString && (char === '"' || char === "'")) {
                inString = true;
                stringChar = char;
                current += char;
            } else if (inString && char === stringChar) {
                inString = false;
                current += char;
            } else if (!inString && char === '(') {
                depth++;
                current += char;
            } else if (!inString && char === ')') {
                depth--;
                current += char;
            } else if (!inString && char === ',' && depth === 0) {
                args.push(this.evaluateExpression(current.trim(), variables));
                current = '';
            } else {
                current += char;
            }
        }
        
        if (current.trim()) {
            args.push(this.evaluateExpression(current.trim(), variables));
        }
        
        return args;
    }

    evaluateArithmetic(expr, variables) {
        try {
            // Replace variables with their values
            let evalExpr = expr;
            for (const [varName, varValue] of Object.entries(variables)) {
                if (typeof varValue === 'number') {
                    evalExpr = evalExpr.replace(new RegExp(`\\b${varName}\\b`, 'g'), varValue);
                }
            }
            
            // Basic arithmetic evaluation (simplified)
            if (/^[\d\s+\-*/().]+$/.test(evalExpr)) {
                return eval(evalExpr);
            }
            
            return expr;
        } catch (e) {
            return expr;
        }
    }

    evaluateCondition(condition, variables) {
        try {
            let evalCondition = condition;
            for (const [varName, varValue] of Object.entries(variables)) {
                evalCondition = evalCondition.replace(new RegExp(`\\b${varName}\\b`, 'g'), 
                    typeof varValue === 'string' ? `"${varValue}"` : varValue);
            }
            
            // Basic condition evaluation
            if (evalCondition.includes('==')) {
                const [left, right] = evalCondition.split('==').map(s => s.trim());
                return this.evaluateExpression(left, variables) == this.evaluateExpression(right, variables);
            } else if (evalCondition.includes('!=')) {
                const [left, right] = evalCondition.split('!=').map(s => s.trim());
                return this.evaluateExpression(left, variables) != this.evaluateExpression(right, variables);
            } else if (evalCondition.includes('>=')) {
                const [left, right] = evalCondition.split('>=').map(s => s.trim());
                return parseFloat(this.evaluateExpression(left, variables)) >= parseFloat(this.evaluateExpression(right, variables));
            } else if (evalCondition.includes('<=')) {
                const [left, right] = evalCondition.split('<=').map(s => s.trim());
                return parseFloat(this.evaluateExpression(left, variables)) <= parseFloat(this.evaluateExpression(right, variables));
            } else if (evalCondition.includes('>')) {
                const [left, right] = evalCondition.split('>').map(s => s.trim());
                return parseFloat(this.evaluateExpression(left, variables)) > parseFloat(this.evaluateExpression(right, variables));
            } else if (evalCondition.includes('<')) {
                const [left, right] = evalCondition.split('<').map(s => s.trim());
                return parseFloat(this.evaluateExpression(left, variables)) < parseFloat(this.evaluateExpression(right, variables));
            }
            
            return false;
        } catch (e) {
            return false;
        }
    }

    addOutput(text, className = '') {
        const outputContent = this.container.querySelector('.output-content');
        const line = document.createElement('div');
        line.className = className;
        line.textContent = text;
        outputContent.appendChild(line);
        outputContent.scrollTop = outputContent.scrollHeight;
    }

    newFile() {
        const fileName = prompt('Enter new file name:', 'script.py');
        if (fileName && !this.files[fileName]) {
            this.files[fileName] = '# New Python file\nprint("Hello from ' + fileName + '")\n';
            
            // Add to select dropdown
            const select = this.container.querySelector('select');
            const option = document.createElement('option');
            option.value = fileName;
            option.textContent = fileName;
            select.appendChild(option);
            
            // Switch to new file
            this.switchFile(fileName);
        }
    }

    switchFile(fileName) {
        // Save current file
        this.files[this.currentFile] = this.container.querySelector('.python-code-input').value;
        
        // Switch to new file
        this.currentFile = fileName;
        this.container.querySelector('.python-code-input').value = this.files[fileName];
    }

    clearOutput() {
        this.container.querySelector('.output-content').innerHTML = '';
    }
}

// Auto-initialize sidebar Python editor if container exists
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('sidebar-python-editor')) {
        new SidebarPythonEditor('sidebar-python-editor');
    }
});
