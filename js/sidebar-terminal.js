// Sidebar Terminal Component for ABID HACKER
// Integrated terminal for course pages

class SidebarTerminal {
    constructor(containerId, prompt = 'root@kali:~# ') {
        this.container = document.getElementById(containerId);
        this.prompt = prompt;
        this.currentPath = '~';
        this.commandHistory = [];
        this.historyIndex = -1;
        this.isMinimized = false;
        
        this.init();
        this.setupCommands();
    }

    init() {
        this.container.innerHTML = `
            <div class="sidebar-terminal-header">
                <div class="d-flex justify-content-between align-items-center">
                    <h6 class="mb-0"><i class="fas fa-dragon text-warning me-2"></i>ABID HACKER Terminal</h6>
                    <div>
                        <button class="btn btn-sm btn-outline-light me-1" onclick="this.closest('.sidebar-terminal').querySelector('.sidebar-terminal-body').classList.toggle('d-none')">
                            <i class="fas fa-minus"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-light" onclick="this.clearTerminal()">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="sidebar-terminal-body">
                <div class="terminal-content" style="height: 300px; overflow-y: auto; background: #000; color: #00ff41; font-family: monospace; padding: 10px; font-size: 12px;">
                    <div class="terminal-line">ABID HACKER Terminal v2.0</div>
                    <div class="terminal-line">Type 'help' for available commands</div>
                    <div class="terminal-line"></div>
                </div>
                <div class="terminal-input-area">
                    <div class="input-group input-group-sm">
                        <span class="input-group-text bg-dark text-warning" style="font-family: monospace; font-size: 11px;">${this.prompt}</span>
                        <input type="text" class="form-control bg-dark text-success terminal-input" style="font-family: monospace; font-size: 11px; border-color: #333;" placeholder="Enter command...">
                    </div>
                </div>
            </div>
        `;

        const input = this.container.querySelector('.terminal-input');
        input.addEventListener('keydown', (e) => this.handleKeyDown(e, input));
        
        // Add clear terminal method to window for button access
        window.clearTerminal = () => {
            const content = this.container.querySelector('.terminal-content');
            content.innerHTML = `
                <div class="terminal-line">ABID HACKER Terminal v2.0</div>
                <div class="terminal-line">Type 'help' for available commands</div>
                <div class="terminal-line"></div>
            `;
        };
    }

    setupCommands() {
        this.commands = {
            help: {
                description: 'Show available commands',
                execute: () => {
                    this.addLine('Available Commands:');
                    this.addLine('==================');
                    this.addLine('nmap [target]     - Network scanning');
                    this.addLine('nikto -h [host]   - Web vulnerability scanner');
                    this.addLine('hydra [options]   - Password attack tool');
                    this.addLine('sqlmap -u [url]   - SQL injection testing');
                    this.addLine('aircrack-ng [cap] - WiFi password cracking');
                    this.addLine('metasploit        - Exploitation framework');
                    this.addLine('john [hashfile]   - Password hash cracking');
                    this.addLine('wireshark [pcap]  - Network packet analysis');
                    this.addLine('volatility [dump] - Memory forensics');
                    this.addLine('clear             - Clear terminal');
                    this.addLine('');
                    this.addLine('💡 Tip: These are simulated commands for learning');
                }
            },
            clear: {
                description: 'Clear terminal',
                execute: () => {
                    window.clearTerminal();
                }
            },
            nmap: {
                description: 'Network scanning tool',
                execute: (args) => {
                    if (args.length === 0) {
                        this.addLine('Usage: nmap [target]');
                        this.addLine('Example: nmap 192.168.1.1');
                        return;
                    }
                    this.addLine(`Starting Nmap scan on ${args[0]}...`);
                    this.addLine('Host is up (0.0010s latency).');
                    this.addLine('PORT     STATE SERVICE');
                    this.addLine('22/tcp   open  ssh');
                    this.addLine('80/tcp   open  http');
                    this.addLine('443/tcp  open  https');
                    this.addLine('Nmap done: 1 IP address scanned');
                }
            },
            nikto: {
                description: 'Web vulnerability scanner',
                execute: (args) => {
                    if (args.length < 2 || args[0] !== '-h') {
                        this.addLine('Usage: nikto -h [hostname]');
                        return;
                    }
                    this.addLine(`- Nikto v2.1.6`);
                    this.addLine(`+ Target IP: ${args[1]}`);
                    this.addLine(`+ Target Hostname: ${args[1]}`);
                    this.addLine(`+ Start Time: ${new Date().toLocaleString()}`);
                    this.addLine('+ Server: Apache/2.4.41');
                    this.addLine('+ Retrieved x-powered-by header: PHP/7.4.3');
                    this.addLine('+ The anti-clickjacking X-Frame-Options header is not present.');
                    this.addLine('+ Scan completed.');
                }
            },
            hydra: {
                description: 'Password attack tool',
                execute: (args) => {
                    this.addLine('Hydra v9.1 starting...');
                    this.addLine('[22][ssh] host: 192.168.1.1   login: admin   password: admin123');
                    this.addLine('1 of 1 target successfully completed, 1 valid password found');
                }
            },
            sqlmap: {
                description: 'SQL injection testing tool',
                execute: (args) => {
                    this.addLine('sqlmap/1.6.12 starting...');
                    this.addLine('[INFO] testing connection to the target URL');
                    this.addLine('[INFO] checking if the target is protected by WAF/IPS');
                    this.addLine('[INFO] testing if GET parameter \'id\' is dynamic');
                    this.addLine('[INFO] GET parameter \'id\' appears to be injectable');
                    this.addLine('[INFO] testing for SQL injection on GET parameter \'id\'');
                    this.addLine('GET parameter \'id\' is vulnerable to SQL injection');
                }
            },
            metasploit: {
                description: 'Exploitation framework',
                execute: () => {
                    this.addLine('       =[ metasploit v6.3.4-dev                          ]');
                    this.addLine('+ -- --=[ 2294 exploits - 1201 auxiliary - 409 post       ]');
                    this.addLine('+ -- --=[ 951 payloads - 45 encoders - 11 nops            ]');
                    this.addLine('+ -- --=[ 9 evasion                                       ]');
                    this.addLine('');
                    this.addLine('msf6 > use exploit/multi/handler');
                    this.addLine('msf6 exploit(multi/handler) > set payload windows/meterpreter/reverse_tcp');
                    this.addLine('msf6 exploit(multi/handler) > exploit');
                }
            }
        };
    }

    handleKeyDown(e, input) {
        if (e.key === 'Enter') {
            const command = input.value.trim();
            if (command) {
                this.addLine(`${this.prompt}${command}`);
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
    }

    executeCommand(commandLine) {
        const parts = commandLine.split(' ');
        const command = parts[0];
        const args = parts.slice(1);

        if (this.commands[command]) {
            this.commands[command].execute(args);
        } else {
            this.addLine(`${command}: command not found`);
            this.addLine('Type "help" for available commands');
        }
    }

    addLine(text) {
        const content = this.container.querySelector('.terminal-content');
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.textContent = text;
        content.appendChild(line);
        content.scrollTop = content.scrollHeight;
    }
}

// Auto-initialize sidebar terminal if container exists
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('sidebar-terminal')) {
        // Wait for VirtualTerminal to be available
        const initSidebarTerminal = () => {
            if (typeof VirtualTerminal !== 'undefined') {
                new VirtualTerminal('sidebar-terminal', 'root@kali:~# ');
                console.log('Sidebar terminal initialized with VirtualTerminal');
            } else {
                // Fallback to SidebarTerminal if VirtualTerminal not available
                setTimeout(initSidebarTerminal, 100);
            }
        };
        initSidebarTerminal();
    }
});
