// Virtual Terminal Implementation for ABID HACKER
// Interactive terminal simulator for hands-on learning

// Debug logging
console.log('Loading virtual-terminal.js...');

// Immediately declare VirtualTerminal globally
window.VirtualTerminal = class VirtualTerminal {
    constructor(containerId, prompt = 'root@kali:~# ') {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Terminal container not found:', containerId);
            return;
        }
        this.prompt = prompt;
        this.currentPath = '~';
        this.commandHistory = [];
        this.historyIndex = -1;
        this.currentInput = '';
        this.fileSystem = this.createFileSystem();
        this.environment = {
            USER: prompt.split('@')[0],
            HOME: '/home/' + prompt.split('@')[0],
            PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
            SHELL: '/bin/bash',
            TERM: 'xterm-256color'
        };
        
        this.loadCommandHistory();
        this.init();
        this.setupCommands();
    }

    createFileSystem() {
        return {
            '/': {
                type: 'directory',
                contents: {
                    'home': {
                        type: 'directory',
                        contents: {
                            'root': {
                                type: 'directory',
                                contents: {
                                    'Documents': { type: 'directory', contents: {} },
                                    'Downloads': { type: 'directory', contents: {} },
                                    'Desktop': { type: 'directory', contents: {} },
                                    'tools': {
                                        type: 'directory',
                                        contents: {
                                            'nmap': { type: 'file', content: 'Nmap executable' },
                                            'nikto': { type: 'file', content: 'Nikto web scanner' },
                                            'metasploit': { type: 'directory', contents: {} }
                                        }
                                    },
                                    'evidence': {
                                        type: 'directory',
                                        contents: {
                                            'memory.dump': { type: 'file', content: 'Memory dump file for analysis' },
                                            'network.pcap': { type: 'file', content: 'Network packet capture' },
                                            'suspicious.exe': { type: 'file', content: 'Suspicious executable file' },
                                            'logs.txt': { type: 'file', content: 'System logs\n2024-01-15 10:30:00 - Suspicious login attempt\n2024-01-15 10:31:15 - Failed authentication\n2024-01-15 10:32:30 - Multiple failed logins detected' }
                                        }
                                    },
                                    'scripts': {
                                        type: 'directory',
                                        contents: {
                                            'scan.py': { type: 'file', content: '#!/usr/bin/env python3\n# Network scanning script\nimport nmap\nprint("Scanning network...")' },
                                            'exploit.sh': { type: 'file', content: '#!/bin/bash\n# Exploitation script\necho "Running exploit..."' }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    'etc': {
                        type: 'directory',
                        contents: {
                            'passwd': { type: 'file', content: 'root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nbin:x:2:2:bin:/bin:/usr/sbin/nologin' },
                            'shadow': { type: 'file', content: 'root:$6$salt$hash:18000:0:99999:7:::' },
                            'hosts': { type: 'file', content: '127.0.0.1\tlocalhost\n192.168.1.1\trouter.local\n192.168.1.100\ttarget.local' }
                        }
                    },
                    'var': {
                        type: 'directory',
                        contents: {
                            'log': {
                                type: 'directory',
                                contents: {
                                    'auth.log': { type: 'file', content: 'Jan 15 10:30:00 kali sshd[1234]: Failed password for root from 192.168.1.50' },
                                    'syslog': { type: 'file', content: 'Jan 15 10:30:00 kali kernel: [12345.678] USB disconnect' }
                                }
                            }
                        }
                    },
                    'tmp': { type: 'directory', contents: {} },
                    'usr': {
                        type: 'directory',
                        contents: {
                            'bin': { type: 'directory', contents: {} },
                            'share': {
                                type: 'directory',
                                contents: {
                                    'wordlists': {
                                        type: 'directory',
                                        contents: {
                                            'rockyou.txt': { type: 'file', content: 'password\n123456\npassword123\nadmin\nroot' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
    }

    init() {
        this.container.innerHTML = '';
        this.addLine(`Welcome to ABID HACKER Virtual Terminal`);
        this.addLine(`Type 'help' to see available commands`);
        this.addLine('');
        this.createInputLine();
        this.container.addEventListener('click', () => this.focusInput());
    }

    setupCommands() {
        this.commands = {
            help: {
                description: 'Show available commands',
                execute: () => {
                    const commands = Object.keys(this.commands).sort();
                    this.addLine('Available commands:');
                    this.addLine('');
                    this.addLine('Basic Commands:');
                    ['ls', 'cd', 'pwd', 'cat', 'mkdir', 'touch', 'rm', 'cp', 'mv'].forEach(cmd => {
                        if (this.commands[cmd]) {
                            this.addLine(`  ${cmd.padEnd(12)} - ${this.commands[cmd].description}`);
                        }
                    });
                    this.addLine('');
                    this.addLine('System Commands:');
                    ['whoami', 'ps', 'top', 'kill', 'grep', 'find', 'which', 'man'].forEach(cmd => {
                        if (this.commands[cmd]) {
                            this.addLine(`  ${cmd.padEnd(12)} - ${this.commands[cmd].description}`);
                        }
                    });
                    this.addLine('');
                    this.addLine('Security Tools:');
                    ['nmap', 'nikto', 'dirb', 'sqlmap', 'metasploit', 'hydra', 'john'].forEach(cmd => {
                        if (this.commands[cmd]) {
                            this.addLine(`  ${cmd.padEnd(12)} - ${this.commands[cmd].description}`);
                        }
                    });
                    this.addLine('');
                    this.addLine('Forensics Tools:');
                    ['volatility', 'strings', 'binwalk', 'foremost', 'autopsy'].forEach(cmd => {
                        if (this.commands[cmd]) {
                            this.addLine(`  ${cmd.padEnd(12)} - ${this.commands[cmd].description}`);
                        }
                    });
                    this.addLine('');
                    this.addLine('Wireless Tools:');
                    ['airodump-ng', 'aircrack-ng', 'reaver', 'wash'].forEach(cmd => {
                        if (this.commands[cmd]) {
                            this.addLine(`  ${cmd.padEnd(12)} - ${this.commands[cmd].description}`);
                        }
                    });
                }
            },
            clear: {
                description: 'Clear the terminal',
                execute: () => {
                    this.container.innerHTML = '';
                    this.createInputLine();
                }
            },
            whoami: {
                description: 'Display current user',
                execute: () => this.addLine(this.environment.USER)
            },
            pwd: {
                description: 'Print working directory',
                execute: () => this.addLine(this.resolvePath(this.currentPath))
            },
            cd: {
                description: 'Change directory',
                execute: (args) => {
                    if (args.length === 0) {
                        this.currentPath = '~';
                        return;
                    }
                    
                    const targetPath = args[0];
                    const resolvedPath = this.resolvePath(targetPath);
                    const pathObj = this.getPathObject(resolvedPath);
                    
                    if (!pathObj) {
                        this.addLine(`cd: ${targetPath}: No such file or directory`);
                        return;
                    }
                    
                    if (pathObj.type !== 'directory') {
                        this.addLine(`cd: ${targetPath}: Not a directory`);
                        return;
                    }
                    
                    this.currentPath = resolvedPath === '/home/root' ? '~' : resolvedPath;
                }
            },
            ls: {
                description: 'List directory contents',
                execute: (args) => {
                    const currentDir = this.getPathObject(this.resolvePath(this.currentPath));
                    if (!currentDir || currentDir.type !== 'directory') {
                        this.addLine('ls: cannot access directory');
                        return;
                    }
                    
                    const files = Object.keys(currentDir.contents);
                    
                    if (args.includes('-la') || args.includes('-l')) {
                        this.addLine(`total ${files.length * 4}`);
                        files.forEach(file => {
                            const fileObj = currentDir.contents[file];
                            const permissions = fileObj.type === 'directory' ? 'drwxr-xr-x' : '-rw-r--r--';
                            const size = fileObj.type === 'directory' ? '4096' : (fileObj.content ? fileObj.content.length : '0');
                            this.addLine(`${permissions} 1 root root ${size.padStart(8)} Jan 15 10:30 ${file}`);
                        });
                    } else if (args.includes('-a')) {
                        this.addLine(['.', '..', ...files].join('  '));
                    } else {
                        this.addLine(files.join('  '));
                    }
                }
            },
            mkdir: {
                description: 'Create directory',
                execute: (args) => {
                    if (args.length === 0) {
                        this.addLine('mkdir: missing operand');
                        return;
                    }
                    
                    const dirName = args[0];
                    const currentDir = this.getPathObject(this.resolvePath(this.currentPath));
                    
                    if (currentDir && currentDir.type === 'directory') {
                        if (currentDir.contents[dirName]) {
                            this.addLine(`mkdir: cannot create directory '${dirName}': File exists`);
                        } else {
                            currentDir.contents[dirName] = { type: 'directory', contents: {} };
                            this.addLine(`Directory '${dirName}' created`);
                        }
                    }
                }
            },
            touch: {
                description: 'Create empty file',
                execute: (args) => {
                    if (args.length === 0) {
                        this.addLine('touch: missing file operand');
                        return;
                    }
                    
                    const fileName = args[0];
                    const currentDir = this.getPathObject(this.resolvePath(this.currentPath));
                    
                    if (currentDir && currentDir.type === 'directory') {
                        currentDir.contents[fileName] = { type: 'file', content: '' };
                        this.addLine(`File '${fileName}' created`);
                    }
                }
            },
            rm: {
                description: 'Remove files and directories',
                execute: (args) => {
                    if (args.length === 0) {
                        this.addLine('rm: missing operand');
                        return;
                    }
                    
                    const fileName = args[0];
                    const currentDir = this.getPathObject(this.resolvePath(this.currentPath));
                    
                    if (currentDir && currentDir.type === 'directory') {
                        if (currentDir.contents[fileName]) {
                            delete currentDir.contents[fileName];
                            this.addLine(`'${fileName}' removed`);
                        } else {
                            this.addLine(`rm: cannot remove '${fileName}': No such file or directory`);
                        }
                    }
                }
            },
            nmap: {
                description: 'Network exploration tool',
                execute: (args) => {
                    if (args.length === 0) {
                        this.addLine('Nmap 7.80 ( https://nmap.org )');
                        this.addLine('Usage: nmap [Scan Type(s)] [Options] {target specification}');
                        return;
                    }
                    
                    this.addLine('Starting Nmap scan...');
                    setTimeout(() => {
                        if (args.includes('-sn')) {
                            this.addLine('Nmap scan report for 192.168.1.1');
                            this.addLine('Host is up (0.001s latency).');
                            this.addLine('Nmap scan report for 192.168.1.100');
                            this.addLine('Host is up (0.002s latency).');
                            this.addLine('Nmap scan report for 192.168.1.105');
                            this.addLine('Host is up (0.001s latency).');
                        } else {
                            this.addLine('PORT     STATE SERVICE');
                            this.addLine('22/tcp   open  ssh');
                            this.addLine('80/tcp   open  http');
                            this.addLine('443/tcp  open  https');
                            this.addLine('3306/tcp open  mysql');
                        }
                        this.addLine('Nmap done: scan completed');
                        this.createInputLine();
                    }, 2000);
                    return 'async';
                }
            },
            nikto: {
                description: 'Web vulnerability scanner',
                execute: (args) => {
                    if (args.length === 0) {
                        this.addLine('Nikto v2.1.6');
                        this.addLine('Usage: nikto -h <host>');
                        return;
                    }
                    
                    this.addLine('- Nikto v2.1.6');
                    this.addLine('+ Target IP: 192.168.1.100');
                    this.addLine('+ Target Hostname: target.com');
                    this.addLine('+ Target Port: 80');
                    setTimeout(() => {
                        this.addLine('+ Server: Apache/2.4.41');
                        this.addLine('+ Retrieved x-powered-by header: PHP/7.4.3');
                        this.addLine('+ The anti-clickjacking X-Frame-Options header is not present.');
                        this.addLine('+ The X-XSS-Protection header is not defined.');
                        this.addLine('+ Uncommon header "x-ob_mode" found, with contents: 1');
                        this.addLine('+ /admin/: Admin login page/section found.');
                        this.addLine('+ 7915 requests: 0 error(s) and 4 item(s) reported');
                        this.createInputLine();
                    }, 3000);
                    return 'async';
                }
            },
            dirb: {
                description: 'Web directory brute forcer',
                execute: (args) => {
                    if (args.length === 0) {
                        this.addLine('DIRB v2.22');
                        this.addLine('Usage: dirb <url_base>');
                        return;
                    }
                    
                    this.addLine('DIRB v2.22');
                    this.addLine('By The Dark Raver');
                    this.addLine('');
                    this.addLine('START_TIME: Mon Jan 15 10:30:00 2024');
                    this.addLine('URL_BASE: http://target.com/');
                    this.addLine('WORDLIST_FILES: /usr/share/dirb/wordlists/common.txt');
                    setTimeout(() => {
                        this.addLine('');
                        this.addLine('---- Scanning URL: http://target.com/ ----');
                        this.addLine('+ http://target.com/admin (CODE:200|SIZE:1234)');
                        this.addLine('+ http://target.com/backup (CODE:200|SIZE:567)');
                        this.addLine('+ http://target.com/config (CODE:403|SIZE:278)');
                        this.addLine('+ http://target.com/login (CODE:200|SIZE:890)');
                        this.addLine('');
                        this.addLine('END_TIME: Mon Jan 15 10:32:15 2024');
                        this.addLine('DOWNLOADED: 4612 - FOUND: 4');
                        this.createInputLine();
                    }, 2500);
                    return 'async';
                }
            },
            volatility: {
                description: 'Memory forensics framework',
                execute: (args) => {
                    if (args.length === 0) {
                        this.addLine('Volatility Foundation Volatility Framework 2.6.1');
                        this.addLine('Usage: volatility [options] [plugin [plugin options]]');
                        return;
                    }
                    
                    if (args.includes('imageinfo')) {
                        this.addLine('Volatility Foundation Volatility Framework 2.6.1');
                        this.addLine('INFO    : volatility.debug    : Determining profile based on KDBG search...');
                        setTimeout(() => {
                            this.addLine('          Suggested Profile(s) : Win7SP1x64, Win7SP0x64, Win2008R2SP0x64');
                            this.addLine('                     AS Layer1 : WindowsAMD64PagedMemory (Kernel AS)');
                            this.addLine('                     AS Layer2 : FileAddressSpace (/path/to/memory.dump)');
                            this.addLine('                      PAE type : No PAE');
                            this.addLine('                           DTB : 0x187000L');
                            this.addLine('                          KDBG : 0xf80002c0f0a0L');
                            this.createInputLine();
                        }, 2000);
                        return 'async';
                    } else if (args.includes('pslist')) {
                        this.addLine('Volatility Foundation Volatility Framework 2.6.1');
                        setTimeout(() => {
                            this.addLine('Offset(V)          Name                    PID   PPID   Thds     Hnds   Sess  Wow64 Start');
                            this.addLine('0xfffffa8000c94040 System                    4      0     95      411 ------      0');
                            this.addLine('0xfffffa8001a0b040 smss.exe                272      4      2       29 ------      0');
                            this.addLine('0xfffffa8002259040 csrss.exe               348    340      9      385      0      0');
                            this.addLine('0xfffffa8002325b30 winlogon.exe            372    340      3       113      0      0');
                            this.createInputLine();
                        }, 1500);
                        return 'async';
                    }
                }
            },
            strings: {
                description: 'Extract printable strings from files',
                execute: (args) => {
                    if (args.length === 0) {
                        this.addLine('Usage: strings [file]');
                        return;
                    }
                    
                    this.addLine('Extracting strings from ' + args[0] + '...');
                    setTimeout(() => {
                        this.addLine('admin');
                        this.addLine('password123');
                        this.addLine('SELECT * FROM users');
                        this.addLine('http://malicious-site.com');
                        this.addLine('C:\\Windows\\System32\\');
                        this.addLine('secret_key_12345');
                        this.addLine('user@company.com');
                        this.createInputLine();
                    }, 1000);
                    return 'async';
                }
            },
            fls: {
                description: 'List files and directories (Sleuth Kit)',
                execute: (args) => {
                    if (args.length === 0) {
                        this.addLine('fls: missing image name');
                        this.addLine('usage: fls [-adDFlhpruvV] [-f fstype] [-i imgtype] [-b dev_sector_size] [-o imgoffset] [-z zone] [-s seconds] image [images] [inode]');
                        return;
                    }
                    
                    this.addLine('Analyzing file system...');
                    setTimeout(() => {
                        this.addLine('r/r * 2:	$MFT');
                        this.addLine('r/r * 3:	$MFTMirr');
                        this.addLine('r/r * 4:	$LogFile');
                        this.addLine('r/r * 5:	$Volume');
                        this.addLine('d/d 11:	Documents and Settings');
                        this.addLine('d/d 12:	Program Files');
                        this.addLine('d/d 13:	Windows');
                        this.addLine('r/r 14:	pagefile.sys');
                        this.addLine('r/r 15:	evidence.txt');
                        this.createInputLine();
                    }, 1500);
                    return 'async';
                }
            },
            cat: {
                description: 'Display file contents',
                execute: (args) => {
                    if (args.length === 0) {
                        this.addLine('cat: missing file operand');
                        return;
                    }
                    
                    const filename = args[0];
                    const resolvedPath = this.resolvePath(filename);
                    const fileObj = this.getPathObject(resolvedPath);
                    
                    if (!fileObj) {
                        this.addLine(`cat: ${filename}: No such file or directory`);
                        return;
                    }
                    
                    if (fileObj.type === 'directory') {
                        this.addLine(`cat: ${filename}: Is a directory`);
                        return;
                    }
                    
                    if (fileObj.content) {
                        this.addLine(fileObj.content);
                    } else {
                        this.addLine(''); // Empty file
                    }
                }
            },
            grep: {
                description: 'Search text patterns in files',
                execute: (args) => {
                    if (args.length < 2) {
                        this.addLine('grep: usage: grep pattern file');
                        return;
                    }
                    
                    const pattern = args[0];
                    const filename = args[1];
                    const fileObj = this.getPathObject(this.resolvePath(filename));
                    
                    if (!fileObj || fileObj.type !== 'file') {
                        this.addLine(`grep: ${filename}: No such file or directory`);
                        return;
                    }
                    
                    const lines = fileObj.content.split('\n');
                    const matches = lines.filter(line => line.includes(pattern));
                    
                    if (matches.length > 0) {
                        matches.forEach(match => this.addLine(match));
                    } else {
                        // No output for no matches (like real grep)
                    }
                }
            },
            find: {
                description: 'Search for files and directories',
                execute: (args) => {
                    if (args.length === 0) {
                        this.addLine('find: missing starting point');
                        return;
                    }
                    
                    const startPath = args[0];
                    const namePattern = args.includes('-name') ? args[args.indexOf('-name') + 1] : null;
                    
                    const results = this.findFiles(startPath, namePattern);
                    results.forEach(result => this.addLine(result));
                }
            },
            ps: {
                description: 'Display running processes',
                execute: (args) => {
                    this.addLine('  PID TTY          TIME CMD');
                    this.addLine(' 1234 pts/0    00:00:01 bash');
                    this.addLine(' 1235 pts/0    00:00:00 nmap');
                    this.addLine(' 1236 pts/0    00:00:00 nikto');
                    this.addLine(' 1237 pts/0    00:00:00 ps');
                }
            },
            top: {
                description: 'Display system processes',
                execute: (args) => {
                    this.addLine('top - 10:30:00 up 1 day,  2:15,  1 user,  load average: 0.15, 0.05, 0.01');
                    this.addLine('Tasks:  95 total,   1 running,  94 sleeping,   0 stopped,   0 zombie');
                    this.addLine('Cpu(s):  2.3%us,  1.0%sy,  0.0%ni, 96.7%id,  0.0%wa,  0.0%hi,  0.0%si,  0.0%st');
                    this.addLine('Mem:   2048000k total,  1024000k used,  1024000k free,   128000k buffers');
                    this.addLine('');
                    this.addLine('  PID USER      PR  NI  VIRT  RES  SHR S %CPU %MEM    TIME+  COMMAND');
                    this.addLine(' 1234 root      20   0  4096 1024  512 S  2.0  0.1   0:01.23 nmap');
                    this.addLine(' 1235 root      20   0  8192 2048 1024 S  1.5  0.2   0:00.45 nikto');
                }
            },
            help: {
                description: 'Show available commands',
                execute: (args) => {
                    if (args.length > 0) {
                        const command = args[0];
                        if (this.commands[command]) {
                            this.addLine(`${command}: ${this.commands[command].description}`);
                            this.addLine('');
                            this.addLine('Usage examples:');
                            this.showCommandExamples(command);
                        } else {
                            this.addLine(`Command '${command}' not found.`);
                        }
                        return;
                    }
                    
                    this.addLine('ABID HACKER Terminal - Available Commands');
                    this.addLine('========================================');
                    this.addLine('');
                    
                    const categories = {
                        'System Commands': ['ls', 'cd', 'pwd', 'whoami', 'uname', 'ps', 'top', 'kill', 'chmod', 'chown'],
                        'Network Scanning': ['nmap', 'masscan', 'zmap', 'rustscan', 'ping', 'hping3', 'netstat', 'ss'],
                        'Web Application Testing': ['nikto', 'dirb', 'gobuster', 'burpsuite', 'owasp_zap', 'sqlmap'],
                        'Password Attacks': ['hydra', 'john', 'hashcat', 'medusa', 'patator', 'crowbar'],
                        'Wireless Security': ['aircrack-ng', 'airodump-ng', 'aireplay-ng', 'reaver', 'kismet'],
                        'Exploitation': ['msfconsole', 'msfvenom', 'setoolkit', 'beef', 'armitage', 'empire'],
                        'Forensics': ['volatility', 'autopsy', 'foremost', 'binwalk', 'strings', 'sleuthkit'],
                        'Network Analysis': ['wireshark', 'tcpdump', 'ettercap', 'dsniff', 'scapy'],
                        'OSINT': ['theharvester', 'maltego', 'recon-ng', 'shodan', 'amass'],
                        'Container Security': ['docker', 'kubectl'],
                        'Cloud Security': ['aws_cli'],
                        'Utilities': ['help', 'clear', 'history', 'man', 'tutorial', 'exit']
                    };
                    
                    for (const [category, commands] of Object.entries(categories)) {
                        this.addLine(`📁 ${category}:`);
                        this.addLine(`   ${commands.join(', ')}`);
                        this.addLine('');
                    }
                    
                    this.addLine('💡 Usage Tips:');
                    this.addLine('   • Type "help [command]" for specific command help');
                    this.addLine('   • Type "man [command]" for detailed manual pages');
                    this.addLine('   • Type "tutorial" to start interactive learning');
                    this.addLine('   • Type "examples [command]" to see usage examples');
                }
            },
            
            tutorial: {
                description: 'Start interactive tutorials',
                execute: (args) => {
                    if (args.length === 0) {
                        this.addLine('🎓 ABID HACKER Interactive Tutorials');
                        this.addLine('===================================');
                        this.addLine('');
                        this.addLine('Available tutorial modules:');
                        this.addLine('');
                        this.addLine('1. basic     - Basic terminal navigation');
                        this.addLine('2. nmap      - Network scanning with Nmap');
                        this.addLine('3. hydra     - Password attacks with Hydra');
                        this.addLine('4. sqlmap    - SQL injection testing');
                        this.addLine('5. wireless  - Wireless security testing');
                        this.addLine('6. forensics - Digital forensics basics');
                        this.addLine('');
                        this.addLine('Usage: tutorial [module_name]');
                        this.addLine('Example: tutorial nmap');
                        return;
                    }
                    
                    const module = args[0];
                    this.startTutorial(module);
                }
            },
            
            examples: {
                description: 'Show command usage examples',
                execute: (args) => {
                    if (args.length === 0) {
                        this.addLine('Usage: examples [command]');
                        this.addLine('Example: examples nmap');
                        return;
                    }
                    
                    const command = args[0];
                    this.addLine(`📚 Examples for '${command}':`);
                    this.addLine('');
                    this.showCommandExamples(command);
                }
            },
            man: {
                description: 'Display manual pages',
                execute: (args) => {
                    if (args.length === 0) {
                        this.addLine('What manual page do you want?');
                        return;
                    }
                    
                    const command = args[0];
                    const manPages = {
                        'ls': 'LS(1)\n\nNAME\n       ls - list directory contents\n\nSYNOPSIS\n       ls [OPTION]... [FILE]...\n\nDESCRIPTION\n       List information about the FILEs (the current directory by default).',
                        'nmap': 'NMAP(1)\n\nNAME\n       nmap - Network exploration tool and security / port scanner\n\nSYNOPSIS\n       nmap [Scan Type...] [Options] {target specification}\n\nDESCRIPTION\n       Nmap ("Network Mapper") is an open source tool for network exploration and security auditing.'
                    };
                    
                    if (manPages[command]) {
                        this.addLine(manPages[command]);
                    } else {
                        this.addLine(`No manual entry for ${command}`);
                    }
                }
            },
            history: {
                description: 'Show command history',
                execute: () => {
                    this.commandHistory.forEach((cmd, index) => {
                        this.addLine(`${index + 1}  ${cmd}`);
                    });
                }
            },
            date: {
                description: 'Display current date and time',
                execute: () => {
                    const now = new Date();
                    this.addLine(now.toString());
                }
            },
            uname: {
                description: 'System information',
                execute: (args) => {
                    if (args.includes('-a')) {
                        this.addLine('Linux kali 5.10.0-kali7-amd64 #1 SMP Debian 5.10.28-1kali1 (2021-04-12) x86_64 GNU/Linux');
                    } else {
                        this.addLine('Linux');
                    }
                }
            },
            ifconfig: {
                description: 'Configure network interface',
                execute: (args) => {
                    if (args.length === 0) {
                        this.addLine('eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500');
                        this.addLine('        inet 192.168.1.100  netmask 255.255.255.0  broadcast 192.168.1.255');
                        this.addLine('        inet6 fe80::a00:27ff:fe4e:66a1  prefixlen 64  scopeid 0x20<link>');
                        this.addLine('        ether 08:00:27:4e:66:a1  txqueuelen 1000  (Ethernet)');
                        this.addLine('        RX packets 1234  bytes 567890 (554.5 KiB)');
                        this.addLine('        RX errors 0  dropped 0  overruns 0  frame 0');
                        this.addLine('        TX packets 987  bytes 123456 (120.5 KiB)');
                        this.addLine('        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0');
                        this.addLine('');
                        this.addLine('lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536');
                        this.addLine('        inet 127.0.0.1  netmask 255.0.0.0');
                        this.addLine('        inet6 ::1  prefixlen 128  scopeid 0x10<host>');
                        this.addLine('        loop  txqueuelen 1000  (Local Loopback)');
                    } else {
                        this.addLine(`ifconfig: ${args.join(' ')}: command executed`);
                    }
                }
            },
            ip: {
                description: 'Show/manipulate routing, network devices',
                execute: (args) => {
                    if (args.includes('addr') || args.includes('a')) {
                        this.addLine('1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN');
                        this.addLine('    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00');
                        this.addLine('    inet 127.0.0.1/8 scope host lo');
                        this.addLine('    inet6 ::1/128 scope host');
                        this.addLine('2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP');
                        this.addLine('    link/ether 08:00:27:4e:66:a1 brd ff:ff:ff:ff:ff:ff');
                        this.addLine('    inet 192.168.1.100/24 brd 192.168.1.255 scope global eth0');
                    } else if (args.includes('route') || args.includes('r')) {
                        this.addLine('default via 192.168.1.1 dev eth0 proto dhcp metric 100');
                        this.addLine('192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.100 metric 100');
                    } else {
                        this.addLine('Usage: ip [ OPTIONS ] OBJECT { COMMAND | help }');
                        this.addLine('OBJECT := { link | address | addrlabel | route | rule | neigh | ntable |');
                        this.addLine('           tunnel | tuntap | maddress | mroute | mrule | monitor | xfrm |');
                        this.addLine('           netns | l2tp | fou | macsec | tcp_metrics | token | netconf | ila |');
                        this.addLine('           vrf | sr | nexthop | mptcp | ioam }');
                    }
                }
            },
            netstat: {
                description: 'Display network connections',
                execute: (args) => {
                    if (args.includes('-tuln') || args.includes('-a')) {
                        this.addLine('Active Internet connections (only servers)');
                        this.addLine('Proto Recv-Q Send-Q Local Address           Foreign Address         State');
                        this.addLine('tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN');
                        this.addLine('tcp        0      0 127.0.0.1:3306          0.0.0.0:*               LISTEN');
                        this.addLine('tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN');
                        this.addLine('tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN');
                        this.addLine('udp        0      0 0.0.0.0:53              0.0.0.0:*');
                        this.addLine('udp        0      0 0.0.0.0:67              0.0.0.0:*');
                    } else {
                        this.addLine('Active Internet connections (w/o servers)');
                        this.addLine('Proto Recv-Q Send-Q Local Address           Foreign Address         State');
                        this.addLine('tcp        0      0 192.168.1.100:45678     192.168.1.1:80          ESTABLISHED');
                    }
                }
            },
            ping: {
                description: 'Send ICMP echo requests',
                execute: (args) => {
                    if (args.length === 0) {
                        this.addLine('ping: usage error: Destination address required');
                        return;
                    }
                    
                    const target = args[0];
                    this.addLine(`PING ${target} (${target}) 56(84) bytes of data.`);
                    
                    setTimeout(() => {
                        this.addLine(`64 bytes from ${target}: icmp_seq=1 ttl=64 time=0.123 ms`);
                        setTimeout(() => {
                            this.addLine(`64 bytes from ${target}: icmp_seq=2 ttl=64 time=0.156 ms`);
                            setTimeout(() => {
                                this.addLine(`64 bytes from ${target}: icmp_seq=3 ttl=64 time=0.134 ms`);
                                this.addLine(`^C`);
                                this.addLine(`--- ${target} ping statistics ---`);
                                this.addLine(`3 packets transmitted, 3 received, 0% packet loss, time 2000ms`);
                                this.addLine(`rtt min/avg/max/mdev = 0.123/0.137/0.156/0.016 ms`);
                                this.createInputLine();
                            }, 1000);
                        }, 1000);
                    }, 1000);
                    return 'async';
                }
            },
            wget: {
                description: 'Download files from web',
                execute: (args) => {
                    if (args.length === 0) {
                        this.addLine('wget: missing URL');
                        return;
                    }
                    
                    const url = args[0];
                    this.addLine(`--${new Date().toISOString().slice(0,19).replace('T', ' ')}--  ${url}`);
                    this.addLine(`Resolving ${url.split('/')[2]}... 192.168.1.50`);
                    this.addLine(`Connecting to ${url.split('/')[2]}|192.168.1.50|:80... connected.`);
                    
                    setTimeout(() => {
                        this.addLine('HTTP request sent, awaiting response... 200 OK');
                        this.addLine('Length: 1234 (1.2K) [text/html]');
                        this.addLine('Saving to: \'index.html\'');
                        this.addLine('');
                        this.addLine('index.html          100%[===================>]   1.21K  --.-KB/s    in 0s');
                        this.addLine('');
                        this.addLine(`${new Date().toISOString().slice(0,19).replace('T', ' ')} (12.3 KB/s) - 'index.html' saved [1234/1234]`);
                        this.createInputLine();
                    }, 2000);
                    return 'async';
                }
            },
            curl: {
                description: 'Transfer data from/to servers',
                execute: (args) => {
                    if (args.length === 0) {
                        this.addLine('curl: try \'curl --help\' for more information');
                        return;
                    }
                    
                    const url = args[args.length - 1];
                    this.addLine('<!DOCTYPE html>');
                    this.addLine('<html>');
                    this.addLine('<head><title>Test Page</title></head>');
                    this.addLine('<body>');
                    this.addLine('<h1>Welcome to Test Server</h1>');
                    this.addLine('<p>This is a sample response from curl command.</p>');
                    this.addLine('</body>');
                    this.addLine('</html>');
                }
            },
            ssh: {
                description: 'OpenSSH SSH client',
                execute: (args) => {
                    if (args.length === 0) {
                        this.addLine('usage: ssh [-46AaCfGgKkMNnqsTtVvXxYy] [-B bind_interface]');
                        this.addLine('           [-b bind_address] [-c cipher_spec] [-D [bind_address:]port]');
                        this.addLine('           [-E log_file] [-e escape_char] [-F configfile] [-I pkcs11]');
                        return;
                    }
                    
                    const target = args[0];
                    this.addLine(`ssh: connect to host ${target} port 22: Connection refused`);
                }
            },
            env: {
                description: 'Display environment variables',
                execute: (args) => {
                    Object.keys(this.environment).forEach(key => {
                        this.addLine(`${key}=${this.environment[key]}`);
                    });
                }
            },
            echo: {
                description: 'Display text',
                execute: (args) => {
                    if (args.length === 0) {
                        this.addLine('');
                    } else {
                        this.addLine(args.join(' '));
                    }
                }
            },
            chmod: {
                description: 'Change file permissions',
                execute: (args) => {
                    if (args.length < 2) {
                        this.addLine('chmod: missing operand');
                        return;
                    }
                    
                    const permissions = args[0];
                    const filename = args[1];
                    this.addLine(`chmod: permissions changed for '${filename}'`);
                }
            },
            chown: {
                description: 'Change file ownership',
                execute: (args) => {
                    if (args.length < 2) {
                        this.addLine('chown: missing operand');
                        return;
                    }
                    
                    const owner = args[0];
                    const filename = args[1];
                    this.addLine(`chown: ownership changed for '${filename}'`);
                }
            },
            df: {
                description: 'Display filesystem disk space usage',
                execute: (args) => {
                    this.addLine('Filesystem     1K-blocks    Used Available Use% Mounted on');
                    this.addLine('/dev/sda1       20971520 8388608  12582912  40% /');
                    this.addLine('tmpfs            1048576       0   1048576   0% /dev/shm');
                    this.addLine('/dev/sda2        5242880 1048576   4194304  20% /home');
                }
            },
            du: {
                description: 'Display directory space usage',
                execute: (args) => {
                    const path = args.length > 0 ? args[0] : '.';
                    this.addLine('4096    ./Documents');
                    this.addLine('8192    ./Downloads');
                    this.addLine('2048    ./Desktop');
                    this.addLine('16384   ./tools');
                    this.addLine('12288   ./scripts');
                    this.addLine('24576   ./evidence');
                    this.addLine('67584   .');
                }
            },
            free: {
                description: 'Display memory usage',
                execute: (args) => {
                    this.addLine('              total        used        free      shared  buff/cache   available');
                    this.addLine('Mem:        2048000      512000     1024000       32000      512000     1504000');
                    this.addLine('Swap:       1048576           0     1048576');
                }
            },
            uptime: {
                description: 'Show system uptime',
                execute: (args) => {
                    this.addLine(' 10:30:00 up 1 day,  2:15,  1 user,  load average: 0.15, 0.05, 0.01');
                }
            },
            route: {
                description: 'Show/manipulate IP routing table',
                execute: (args) => {
                    this.addLine('Kernel IP routing table');
                    this.addLine('Destination     Gateway         Genmask         Flags Metric Ref    Use Iface');
                    this.addLine('default         192.168.1.1     0.0.0.0         UG    100    0        0 eth0');
                    this.addLine('192.168.1.0     0.0.0.0         255.255.255.0   U     100    0        0 eth0');
                }
            },
            arp: {
                description: 'Display/modify ARP cache',
                execute: (args) => {
                    this.addLine('Address                  HWtype  HWaddress           Flags Mask            Iface');
                    this.addLine('192.168.1.1              ether   aa:bb:cc:dd:ee:ff   C                     eth0');
                    this.addLine('192.168.1.50             ether   11:22:33:44:55:66   C                     eth0');
                    this.addLine('192.168.1.105            ether   77:88:99:aa:bb:cc   C                     eth0');
                }
            },
            lsof: {
                description: 'List open files',
                execute: (args) => {
                    this.addLine('COMMAND    PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME');
                    this.addLine('bash      1234 root  cwd    DIR    8,1     4096    2 /home/root');
                    this.addLine('bash      1234 root  txt    REG    8,1   1037528  123 /bin/bash');
                    this.addLine('nmap      1235 root  txt    REG    8,1   5984584  456 /usr/bin/nmap');
                    this.addLine('nikto     1236 root  txt    REG    8,1    298472  789 /usr/bin/nikto');
                }
            },
            kill: {
                description: 'Terminate processes',
                execute: (args) => {
                    if (args.length === 0) {
                        this.addLine('kill: usage: kill [-s sigspec | -n signum | -sigspec] pid | jobspec ... or kill -l [sigspec]');
                        return;
                    }
                    
                    const pid = args[0];
                    if (isNaN(pid)) {
                        this.addLine(`kill: ${pid}: arguments must be process or job IDs`);
                    } else {
                        this.addLine(`Process ${pid} terminated`);
                    }
                }
            },
            service: {
                description: 'Control system services',
                execute: (args) => {
                    if (args.length < 2) {
                        this.addLine('Usage: service < option > | --status-all | [ service_name [ command | --full-restart ] ]');
                        return;
                    }
                    
                    const serviceName = args[0];
                    const command = args[1];
                    
                    if (command === 'status') {
                        this.addLine(`● ${serviceName}.service - ${serviceName} service`);
                        this.addLine('   Loaded: loaded (/etc/systemd/system/${serviceName}.service; enabled; vendor preset: enabled)');
                        this.addLine('   Active: active (running) since Mon 2024-01-15 10:00:00 UTC; 30min ago');
                    } else {
                        this.addLine(`${serviceName} ${command}: [OK]`);
                    }
                }
            },
            systemctl: {
                description: 'Control systemd services',
                execute: (args) => {
                    if (args.length === 0) {
                        this.addLine('systemctl [OPTIONS...] {COMMAND} ...');
                        return;
                    }
                    
                    const command = args[0];
                    const service = args.length > 1 ? args[1] : '';
                    
                    if (command === 'status' && service) {
                        this.addLine(`● ${service}.service - ${service} service`);
                        this.addLine('   Loaded: loaded (/lib/systemd/system/${service}.service; enabled; vendor preset: enabled)');
                        this.addLine('   Active: active (running) since Mon 2024-01-15 10:00:00 UTC; 30min ago');
                    } else if (command === 'list-units') {
                        this.addLine('UNIT                     LOAD   ACTIVE SUB     DESCRIPTION');
                        this.addLine('ssh.service              loaded active running OpenBSD Secure Shell server');
                        this.addLine('apache2.service          loaded active running The Apache HTTP Server');
                        this.addLine('mysql.service            loaded active running MySQL Community Server');
                    } else {
                        this.addLine(`systemctl: ${command} executed`);
                    }
                }
            },
            // Advanced Network Scanning & Reconnaissance
            masscan: {
                description: 'Mass IP port scanner',
                execute: (args) => {
                    if (args.length === 0) {
                        this.addLine('Usage: masscan [ip/range] -p[ports] [options]');
                        return;
                    }
                    this.addLine('Starting masscan 1.3.2 at 2024-01-15 22:27:25 GMT');
                    this.addLine('Initiating SYN Stealth Scan');
                    this.addLine('Discovered open port 80/tcp on 192.168.1.100');
                    this.addLine('Discovered open port 443/tcp on 192.168.1.100');
                    this.addLine('Discovered open port 22/tcp on 192.168.1.100');
                }
            },
            zmap: {
                description: 'Fast single packet network scanner',
                execute: (args) => {
                    this.addLine('zmap 2.1.1 (https://zmap.io)');
                    this.addLine('Jan 15 22:27:25.000 [INFO] zmap: started');
                    this.addLine('Jan 15 22:27:26.000 [INFO] zmap: completed, 1000000 hosts scanned');
                    this.addLine('192.168.1.100:80');
                    this.addLine('192.168.1.101:80');
                    this.addLine('192.168.1.102:80');
                }
            },
            unicornscan: {
                description: 'Information gathering and correlation engine',
                execute: (args) => {
                    this.addLine('unicornscan (v0.4.7) JIT(0x28) for `linux` arch `x86_64`');
                    this.addLine('TCP open 192.168.1.100:22  ttl 64');
                    this.addLine('TCP open 192.168.1.100:80  ttl 64');
                    this.addLine('TCP open 192.168.1.100:443 ttl 64');
                }
            },
            rustscan: {
                description: 'Modern port scanner',
                execute: (args) => {
                    this.addLine('🚀 RustScan 2.0.1');
                    this.addLine('📡 Starting Nmap');
                    this.addLine('Host is up, received echo-reply ttl 64.');
                    this.addLine('22/tcp   open  ssh');
                    this.addLine('80/tcp   open  http');
                    this.addLine('443/tcp  open  https');
                }
            },
            angry_ip_scanner: {
                description: 'Fast and friendly network scanner',
                execute: (args) => {
                    this.addLine('Angry IP Scanner 3.8.2');
                    this.addLine('Scanning 192.168.1.1-254...');
                    this.addLine('192.168.1.1    - alive [0ms]');
                    this.addLine('192.168.1.100  - alive [1ms]');
                    this.addLine('192.168.1.101  - alive [2ms]');
                }
            },
            // Web Application Testing
            gobuster: {
                description: 'Directory/file & DNS busting tool',
                execute: (args) => {
                    this.addLine('Gobuster v3.1.0');
                    this.addLine('by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)');
                    this.addLine('[+] Url:                     http://example.com');
                    this.addLine('[+] Method:                  GET');
                    this.addLine('[+] Threads:                 10');
                    this.addLine('/admin                (Status: 200) [Size: 1234]');
                    this.addLine('/login                (Status: 200) [Size: 2345]');
                    this.addLine('/dashboard            (Status: 403) [Size: 567]');
                }
            },
            dirbuster: {
                description: 'Multi threaded java application for brute forcing directories',
                execute: (args) => {
                    this.addLine('DirBuster 1.0-RC1');
                    this.addLine('Starting dir/file list based brute forcing');
                    this.addLine('Dir found: /admin/ - 200');
                    this.addLine('Dir found: /backup/ - 200');
                    this.addLine('File found: /config.php - 200');
                }
            },
            ffuf: {
                description: 'Fast web fuzzer written in Go',
                execute: (args) => {
                    this.addLine('        /___\\  /___\\           /___\\       ');
                    this.addLine('       /\\ \\__/ /\\ \\__/  __  __  /\\ \\__/       ');
                    this.addLine('       \\ \\ ,__\\\\ \\ ,__\\/\\ \\/\\ \\ \\ \\ ,__\\      ');
                    this.addLine('        \\ \\ \\_/ \\ \\ \\_/\\ \\ \\_\\ \\ \\ \\_\\        ');
                    this.addLine('         \\ \\_\\   \\ \\_\\  \\ \\____/  \\ \\_\\       ');
                    this.addLine('          \\/_/    \\/_/   \\/___/    \\/_/       ');
                    this.addLine('');
                    this.addLine('admin                   [Status: 200, Size: 1234]');
                    this.addLine('login                   [Status: 200, Size: 2345]');
                }
            },
            wfuzz: {
                description: 'Web application fuzzer',
                execute: (args) => {
                    this.addLine('********************************************************');
                    this.addLine('* Wfuzz 3.1.0 - The Web Fuzzer                         *');
                    this.addLine('********************************************************');
                    this.addLine('');
                    this.addLine('000000001:   200        32 L     98 W    1234 Ch        "admin"');
                    this.addLine('000000002:   200        45 L     123 W   2345 Ch        "login"');
                }
            },
            burpsuite: {
                description: 'Web vulnerability scanner',
                execute: (args) => {
                    this.addLine('Burp Suite Professional v2023.10.3.4');
                    this.addLine('Starting Burp Suite...');
                    this.addLine('Proxy listening on 127.0.0.1:8080');
                    this.addLine('Scanner module loaded');
                    this.addLine('Intruder module loaded');
                }
            },
            owasp_zap: {
                description: 'OWASP Zed Attack Proxy',
                execute: (args) => {
                    this.addLine('OWASP ZAP 2.12.0');
                    this.addLine('Starting ZAP...');
                    this.addLine('Proxy started on 127.0.0.1:8080');
                    this.addLine('Active scan rules loaded: 50');
                    this.addLine('Passive scan rules loaded: 60');
                }
            },
            // SQL Injection Tools
            sqlninja: {
                description: 'SQL Server injection & takeover tool',
                execute: (args) => {
                    this.addLine('sqlninja rel. 0.2.999-alpha1');
                    this.addLine('(C) 2006-2011 icesurfer <r00t@northernfortress.net>');
                    this.addLine('Testing SQL injection...');
                    this.addLine('[+] Vulnerable parameter found!');
                    this.addLine('[+] Database: MSSQL Server 2019');
                }
            },
            sqlsus: {
                description: 'MySQL injection and takeover tool',
                execute: (args) => {
                    this.addLine('sqlsus version 0.7.2');
                    this.addLine('Automatic SQL injection tool');
                    this.addLine('[+] Testing for SQL injection...');
                    this.addLine('[+] MySQL 8.0.25 detected');
                    this.addLine('[+] Current user: root@localhost');
                }
            },
            bbqsql: {
                description: 'Blind SQL injection framework',
                execute: (args) => {
                    this.addLine('BBQSQL - Blind SQL Injection Framework');
                    this.addLine('Version: 1.2');
                    this.addLine('[+] Starting blind SQL injection attack');
                    this.addLine('[+] Database detected: MySQL 5.7');
                    this.addLine('[+] Extracting data...');
                }
            },
            // Password Attacks
            hashcat: {
                description: 'Advanced password recovery',
                execute: (args) => {
                    this.addLine('hashcat (v6.2.5) starting...');
                    this.addLine('');
                    this.addLine('OpenCL API (OpenCL 3.0 ) - Platform #1 [Intel(R) Corporation]');
                    this.addLine('* Device #1: Intel(R) UHD Graphics, 1024/2048 MB (512 MB allocatable)');
                    this.addLine('');
                    this.addLine('Hash.Target......: $2b$12$N4rLJu.../hash');
                    this.addLine('Hash.Type........: bcrypt $2*$, Blowfish (Unix)');
                    this.addLine('Time.Started.....: Mon Jan 15 22:27:25 2024');
                    this.addLine('Speed.#1.........:      456 H/s (8.92ms) @ Accel:8 Loops:32 Thr:8 Vec:1');
                }
            },
            john: {
                description: 'John the Ripper password cracker',
                execute: (args) => {
                    this.addLine('John the Ripper 1.9.0-jumbo-1 (linux-x86-64)');
                    this.addLine('Loaded 1 password hash (bcrypt [Blowfish 32/64 X3])');
                    this.addLine('Cost 1 (iteration count) is 4096 for all loaded hashes');
                    this.addLine('Will run 4 OpenMP threads');
                    this.addLine('Press \'q\' or Ctrl-C to abort, almost any other key for status');
                    this.addLine('password123      (user)');
                    this.addLine('1g 0:00:00:05 DONE (2024-01-15 22:27) 0.1923g/s 276.9p/s 276.9c/s 276.9C/s');
                }
            },
            medusa: {
                description: 'Speedy, parallel, and modular login brute-forcer',
                execute: (args) => {
                    this.addLine('Medusa v2.2 [http://www.foofus.net] (C) JoMo-Kun / Foofus Networks <jmk@foofus.net>');
                    this.addLine('');
                    this.addLine('ACCOUNT CHECK: [ssh] Host: 192.168.1.100 (1 of 1, 0 complete) User: admin (1 of 1, 0 complete) Password: password (1 of 100 complete)');
                    this.addLine('ACCOUNT FOUND: [ssh] Host: 192.168.1.100 User: admin Password: password [SUCCESS]');
                }
            },
            patator: {
                description: 'Multi-purpose brute-forcer',
                execute: (args) => {
                    this.addLine('patator 0.9 (https://github.com/lanjelot/patator)');
                    this.addLine('');
                    this.addLine('22:27:25 patator    INFO - Starting Patator v0.9 at 2024-01-15 22:27 UTC');
                    this.addLine('22:27:25 patator    INFO - code size:clen       time | candidate                          |   num | mesg');
                    this.addLine('22:27:26 patator    INFO - 200  1234:1234      0.123 | admin:password                     |     1 | HTTP/1.1 200 OK');
                }
            },
            crowbar: {
                description: 'Brute forcing tool',
                execute: (args) => {
                    this.addLine('2024-01-15 22:27:25 START');
                    this.addLine('2024-01-15 22:27:25 Crowbar v0.4.1');
                    this.addLine('2024-01-15 22:27:25 Trying 192.168.1.100:22');
                    this.addLine('2024-01-15 22:27:26 RDP-SUCCESS : 192.168.1.100:3389 - admin:password');
                }
            },
            // Network Sniffing & Analysis
            tcpdump: {
                description: 'Command-line packet analyzer',
                execute: (args) => {
                    this.addLine('tcpdump: verbose output suppressed, use -v or -vv for full protocol decode');
                    this.addLine('listening on eth0, link-type EN10MB (Ethernet), capture size 262144 bytes');
                    this.addLine('22:27:25.123456 IP 192.168.1.100.12345 > 192.168.1.1.80: Flags [S], seq 123456789');
                    this.addLine('22:27:25.124567 IP 192.168.1.1.80 > 192.168.1.100.12345: Flags [S.], seq 987654321');
                    this.addLine('22:27:25.125678 IP 192.168.1.100.12345 > 192.168.1.1.80: Flags [.], ack 987654322');
                }
            },
            wireshark: {
                description: 'Network protocol analyzer',
                execute: (args) => {
                    this.addLine('Wireshark 4.0.0 (Git v4.0.0 packaged as 4.0.0-1)');
                    this.addLine('');
                    this.addLine('Capturing on \'eth0\'');
                    this.addLine('Frame 1: 74 bytes on wire (592 bits), 74 bytes captured (592 bits)');
                    this.addLine('Ethernet II, Src: aa:bb:cc:dd:ee:ff, Dst: 11:22:33:44:55:66');
                    this.addLine('Internet Protocol Version 4, Src: 192.168.1.100, Dst: 192.168.1.1');
                }
            },
            tshark: {
                description: 'Terminal-based Wireshark',
                execute: (args) => {
                    this.addLine('Running as user "root" and group "root". This could be dangerous.');
                    this.addLine('Capturing on \'eth0\'');
                    this.addLine('    1   0.000000 192.168.1.100 → 192.168.1.1    TCP 74 12345 → 80 [SYN] Seq=0 Win=65535');
                    this.addLine('    2   0.001234 192.168.1.1 → 192.168.1.100    TCP 74 80 → 12345 [SYN, ACK] Seq=0 Ack=1');
                    this.addLine('    3   0.002345 192.168.1.100 → 192.168.1.1    TCP 66 12345 → 80 [ACK] Seq=1 Ack=1');
                }
            },
            ettercap: {
                description: 'Comprehensive suite for MITM attacks',
                execute: (args) => {
                    this.addLine('ettercap 0.8.3.1 copyright 2001-2020 Ettercap Development Team');
                    this.addLine('');
                    this.addLine('Listening on:');
                    this.addLine('  eth0 -> 08:00:27:4e:66:a1');
                    this.addLine('        192.168.1.100/255.255.255.0');
                    this.addLine('');
                    this.addLine('SSL dissection [ON]');
                    this.addLine('Starting Unified sniffing...');
                }
            },
            dsniff: {
                description: 'Collection of tools for network auditing',
                execute: (args) => {
                    this.addLine('dsniff: listening on eth0');
                    this.addLine('01/15/24 22:27:25 tcp 192.168.1.100.1234 -> 192.168.1.50.21 (ftp)');
                    this.addLine('USER admin');
                    this.addLine('PASS password123');
                }
            },
            // Wireless Security Tools
            'aircrack-ng': {
                description: 'WiFi security auditing tools suite',
                execute: (args) => {
                    this.addLine('Aircrack-ng 1.7');
                    this.addLine('');
                    this.addLine('[00:00:01] Tested 12345 keys (got 5678 IVs)');
                    this.addLine('');
                    this.addLine('   KB    depth   byte(vote)');
                    this.addLine('    0    0/  1   A4(7936) 2F(7680) 5C(7424) 6E(7168) 8B(6912)');
                    this.addLine('    1    0/  1   2F(8192) A4(7936) 5C(7680) 6E(7424) 8B(7168)');
                    this.addLine('');
                    this.addLine('KEY FOUND! [ A4:2F:5C:6E:8B ]');
                }
            },
            'airodump-ng': {
                description: 'WiFi packet capture program',
                execute: (args) => {
                    this.addLine(' CH  6 ][ Elapsed: 1 min ][ 2024-01-15 22:27                                         ');
                    this.addLine('                                                                                       ');
                    this.addLine(' BSSID              PWR  Beacons    #Data, #/s  CH  MB   CC  ESSID');
                    this.addLine('                                                                                       ');
                    this.addLine(' AA:BB:CC:DD:EE:FF  -30       54      123    2   6  54e  WPA2 MyNetwork');
                    this.addLine(' 11:22:33:44:55:66  -45       32       89    1  11  54e  WEP  OldRouter');
                    this.addLine('                                                                                       ');
                    this.addLine(' BSSID              STATION            PWR   Rate    Lost    Frames  Probe');
                }
            },
            'aireplay-ng': {
                description: 'WiFi packet injection tool',
                execute: (args) => {
                    this.addLine('22:27:25  Waiting for beacon frame (BSSID: AA:BB:CC:DD:EE:FF) on channel 6');
                    this.addLine('22:27:26  Sending Authentication Request (Open System) [ACK]');
                    this.addLine('22:27:26  Authentication successful');
                    this.addLine('22:27:26  Sending Association Request [ACK]');
                    this.addLine('22:27:26  Association successful :-) (AID: 1)');
                    this.addLine('22:27:26  Sending keep-alive packet [ACK]');
                }
            },
            kismet: {
                description: 'Wireless network detector and sniffer',
                execute: (args) => {
                    this.addLine('INFO: Kismet 2023.07.R1 starting');
                    this.addLine('INFO: Reading from config file /etc/kismet/kismet.conf');
                    this.addLine('INFO: No specific sources given to kismet, all local sources will be used.');
                    this.addLine('INFO: Opened pcapfile for writing: /tmp/kismet-20240115-222725-1.pcap');
                    this.addLine('INFO: Serving HTTP on port 2501');
                }
            },
            // Exploitation Frameworks
            msfconsole: {
                description: 'Metasploit Framework Console',
                execute: (args) => {
                    this.addLine('                                                  ');
                    this.addLine('      .:okOOOkdc\'           \'cdkOOOko:.      ');
                    this.addLine('    .xOOOOOOOOOOOOc       cOOOOOOOOOOOOx.    ');
                    this.addLine('   :OOOOOOOOOOOOOOOk,   ,kOOOOOOOOOOOOOOO:   ');
                    this.addLine('  cOOOOOOOOOOOOOOOOOOc:cOOOOOOOOOOOOOOOOOOc  ');
                    this.addLine(' dOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOd ');
                    this.addLine(' OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO ');
                    this.addLine(' OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO ');
                    this.addLine(' OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO ');
                    this.addLine(' OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO ');
                    this.addLine(' OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO ');
                    this.addLine(' `dOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOd` ');
                    this.addLine('  cOOOOOOOOOOOOOOOOOOc:cOOOOOOOOOOOOOOOOOOc  ');
                    this.addLine('   :OOOOOOOOOOOOOOOk,   ,kOOOOOOOOOOOOOOO:   ');
                    this.addLine('    .xOOOOOOOOOOOOc       cOOOOOOOOOOOOx.    ');
                    this.addLine('      .:okOOOkdc\'           \'cdkOOOko:.      ');
                    this.addLine('                                                  ');
                    this.addLine('       =[ metasploit v6.3.4-dev                  ]');
                    this.addLine('+ -- --=[ 2294 exploits - 1201 auxiliary - 409 post       ]');
                    this.addLine('+ -- --=[ 951 payloads - 45 encoders - 11 nops            ]');
                    this.addLine('+ -- --=[ 9 evasion                                       ]');
                    this.addLine('');
                    this.addLine('msf6 > ');
                }
            },
            msfvenom: {
                description: 'Metasploit payload generator',
                execute: (args) => {
                    if (args.length === 0) {
                        this.addLine('MsfVenom - a Metasploit standalone payload generator.');
                        this.addLine('Usage: msfvenom [options] <var=val>');
                        this.addLine('    -p, --payload    <payload>       Payload to use');
                        this.addLine('    -l, --list       [type]          List all modules');
                        this.addLine('    -f, --format     <format>        Output format');
                        return;
                    }
                    this.addLine('[-] No platform was selected, choosing Msf::Module::Platform::Windows from the payload');
                    this.addLine('[-] No arch selected, selecting arch: x86 from the payload');
                    this.addLine('No encoder specified, outputting raw payload');
                    this.addLine('Payload size: 341 bytes');
                    this.addLine('Final size of exe file: 73802 bytes');
                }
            },
            // Social Engineering Framework
            setoolkit: {
                description: 'Social Engineering Toolkit',
                execute: (args) => {
                    this.addLine(' _________________________________________ ');
                    this.addLine('|  ..######..######..######..##......##  |');
                    this.addLine('|  .##....##.##.......##....##..##..##   |');
                    this.addLine('|  .##.......##.......##.....##..##..    |');
                    this.addLine('|  ..######..######...##......####.....  |');
                    this.addLine('|  .......##.##.......##.......##.......  |');
                    this.addLine('|  .##....##.##.......##.......##.......  |');
                    this.addLine('|  ..######..########.##.......##.......  |');
                    this.addLine('|_________________________________________|');
                    this.addLine('');
                    this.addLine('[---]        The Social-Engineer Toolkit (SET)         [---]');
                    this.addLine('[---]        Created by: David Kennedy (ReL1K)         [---]');
                    this.addLine('[---]                Version: 8.0.3                    [---]');
                    this.addLine('[---]              Codename: \'Maverick\'                [---]');
                }
            },
            // Forensics & Reverse Engineering
            binwalk: {
                description: 'Firmware analysis tool',
                execute: (args) => {
                    this.addLine('DECIMAL       HEXADECIMAL     DESCRIPTION');
                    this.addLine('--------------------------------------------------------------------------------');
                    this.addLine('0             0x0             JFFS2 filesystem, little endian');
                    this.addLine('1048576       0x100000        Squashfs filesystem, little endian, version 4.0');
                    this.addLine('2097152       0x200000        Linux kernel ARM boot executable zImage');
                }
            },
            foremost: {
                description: 'File carving tool',
                execute: (args) => {
                    this.addLine('Foremost version 1.5.7 by Jesse Kornblum, Kris Kendall, and Nick Mikus');
                    this.addLine('Audit File');
                    this.addLine('');
                    this.addLine('Foremost started at Mon Jan 15 22:27:25 2024');
                    this.addLine('Invocation: foremost -i disk.img -o output/');
                    this.addLine('Output directory: /tmp/foremost-output');
                    this.addLine('Configuration file: /etc/foremost.conf');
                    this.addLine('Processing: disk.img');
                    this.addLine('|------------------------------------------------------------------');
                    this.addLine('File: disk.img');
                    this.addLine('Start: Mon Jan 15 22:27:25 2024');
                    this.addLine('Length: 1 GB (1073741824 bytes)');
                    this.addLine('');
                    this.addLine('Num	 Name (bs=512)	       Size	 File Offset	 Comment');
                    this.addLine('0:	00000001.jpg 	       45 KB 	          512 	');
                    this.addLine('1:	00000002.pdf 	      123 KB 	        46592 	');
                    this.addLine('2:	00000003.doc 	       67 KB 	       172032 	');
                }
            },
            autopsy: {
                description: 'Digital forensics platform',
                execute: (args) => {
                    this.addLine('Autopsy 4.19.3');
                    this.addLine('Starting Autopsy forensic browser...');
                    this.addLine('Web server will be available at:');
                    this.addLine('http://localhost:9999/autopsy');
                    this.addLine('');
                    this.addLine('Evidence Locker: /var/lib/autopsy');
                    this.addLine('Temp Directory: /tmp');
                    this.addLine('Log Directory: /var/log/autopsy');
                }
            },
            volatility: {
                description: 'Memory forensics framework',
                execute: (args) => {
                    this.addLine('Volatility Foundation Volatility Framework 2.6.1');
                    this.addLine('');
                    if (args.includes('imageinfo')) {
                        this.addLine('INFO    : volatility.debug    : Determining profile based on KDBG search...');
                        this.addLine('          Suggested Profile(s) : Win7SP1x64, Win7SP0x64, Win2008R2SP0x64, Win2008R2SP1x64_24000');
                        this.addLine('                     AS Layer1 : WindowsAMD64PagedMemory (Kernel AS)');
                        this.addLine('                     AS Layer2 : FileAddressSpace (/path/to/memory.dmp)');
                        this.addLine('                      PAE type : No PAE');
                        this.addLine('                           DTB : 0x187000L');
                        this.addLine('                          KDBG : 0xf80002c030a0L');
                    } else {
                        this.addLine('Usage: volatility [options] [plugin [plugin-options]]');
                        this.addLine('Supported Plugin Commands:');
                        this.addLine('    pslist          Print all running processes');
                        this.addLine('    pstree          Print process list as a tree');
                        this.addLine('    psxview         Find hidden processes');
                        this.addLine('    netscan         Scan for network artifacts');
                    }
                }
            },
            strings: {
                description: 'Extract printable strings from files',
                execute: (args) => {
                    if (args.length === 0) {
                        this.addLine('Usage: strings [OPTION]... [FILE]...');
                        return;
                    }
                    this.addLine('Hello World');
                    this.addLine('This is a test string');
                    this.addLine('admin');
                    this.addLine('password123');
                    this.addLine('http://example.com');
                    this.addLine('secret_key_12345');
                    this.addLine('database_connection_string');
                }
            },
            hexdump: {
                description: 'Display file contents in hexadecimal',
                execute: (args) => {
                    if (args.length === 0) {
                        this.addLine('Usage: hexdump [OPTION]... [FILE]...');
                        return;
                    }
                    this.addLine('0000000 4d5a 9000 0003 0000 0004 0000 ffff 0000');
                    this.addLine('0000010 00b8 0000 0000 0000 0040 0000 0000 0000');
                    this.addLine('0000020 0000 0000 0000 0000 0000 0000 0000 0000');
                    this.addLine('0000030 0000 0000 0000 0000 0000 0000 0080 0000');
                }
            },
            // Steganography Tools
            steghide: {
                description: 'Steganography program',
                execute: (args) => {
                    if (args.includes('extract')) {
                        this.addLine('Enter passphrase: ');
                        this.addLine('wrote extracted data to "secret.txt".');
                    } else if (args.includes('embed')) {
                        this.addLine('Enter passphrase: ');
                        this.addLine('Re-Enter passphrase: ');
                        this.addLine('embedding "secret.txt" in "image.jpg"... done');
                    } else {
                        this.addLine('steghide version 0.5.1');
                        this.addLine('Usage: steghide command [arguments]');
                        this.addLine('Available commands:');
                        this.addLine('embed, --embed          embed data');
                        this.addLine('extract, --extract      extract data');
                        this.addLine('info, --info            display info about a cover- or stego-file');
                    }
                }
            },
            stegsolve: {
                description: 'Steganography solver',
                execute: (args) => {
                    this.addLine('Stegsolve 1.3');
                    this.addLine('Loading image analysis tools...');
                    this.addLine('Available filters:');
                    this.addLine('- Red plane 0-7');
                    this.addLine('- Green plane 0-7');
                    this.addLine('- Blue plane 0-7');
                    this.addLine('- Alpha plane 0-7');
                    this.addLine('- XOR operations');
                }
            },
            // OSINT Tools
            theharvester: {
                description: 'E-mails, subdomains and names harvester',
                execute: (args) => {
                    if (args.length === 0) {
                        this.addLine('Usage: theHarvester -d <domain> -l <limit> -b <data source>');
                        return;
                    }
                    this.addLine('*******************************************************************');
                    this.addLine('*  _   _                                            _             *');
                    this.addLine('* | |_| |__   ___    /\  /\__ _ _ ____   _____  ___| |_ ___ _ __   *');
                    this.addLine('* | __|  _ \ / _ \  /  \/  / _` |  __\ \ / / _ \/ __| __/ _ \  __|  *');
                    this.addLine('* | |_| | | |  __/ / /\  / (_| | |   \ V /  __/\__ \ ||  __/ |     *');
                    this.addLine('*  \__|_| |_|\___| \/  \/  \__,_|_|    \_/ \___||___/\__\___|_|     *');
                    this.addLine('*                                                               *');
                    this.addLine('* theHarvester 4.2.0                                           *');
                    this.addLine('* Coded by Christian Martorella                                *');
                    this.addLine('* Edge-Security Research                                       *');
                    this.addLine('* cmartorella@edge-security.com                                *');
                    this.addLine('*******************************************************************');
                    this.addLine('');
                    this.addLine('[*] Target: example.com');
                    this.addLine('');
                    this.addLine('[*] Searching Google.');
                    this.addLine('[*] Searching Bing.');
                    this.addLine('');
                    this.addLine('[*] Emails found: 5');
                    this.addLine('admin@example.com');
                    this.addLine('info@example.com');
                    this.addLine('support@example.com');
                    this.addLine('');
                    this.addLine('[*] Hosts found: 8');
                    this.addLine('www.example.com');
                    this.addLine('mail.example.com');
                    this.addLine('ftp.example.com');
                }
            },
            maltego: {
                description: 'Open source intelligence and forensics application',
                execute: (args) => {
                    this.addLine('Maltego CE 4.3.0');
                    this.addLine('Starting Maltego Community Edition...');
                    this.addLine('Loading transforms...');
                    this.addLine('Available transform sets:');
                    this.addLine('- Paterva CTAS CE');
                    this.addLine('- Have I Been Pwned?');
                    this.addLine('- Shodan');
                    this.addLine('- VirusTotal Public API');
                }
            },
            recon_ng: {
                description: 'Web reconnaissance framework',
                execute: (args) => {
                    this.addLine('');
                    this.addLine('    _/_/_/    _/_/_/_/    _/_/_/    _/_/_/    _/      _/            _/      _/    _/_/_/');
                    this.addLine('   _/    _/  _/        _/        _/    _/  _/_/    _/            _/_/    _/  _/       ');
                    this.addLine('  _/_/_/    _/_/_/    _/        _/    _/  _/  _/  _/  _/_/_/_/  _/  _/  _/  _/  _/_/_/');
                    this.addLine(' _/    _/  _/        _/        _/    _/  _/    _/_/            _/    _/_/  _/      _/');
                    this.addLine('_/    _/  _/_/_/_/    _/_/_/    _/_/_/    _/      _/            _/      _/    _/_/_/');
                    this.addLine('');
                    this.addLine('                                         /\');
                    this.addLine('                                        / \\');
                    this.addLine('                                       /   \\');
                    this.addLine('                                      /  ___\\');
                    this.addLine('                                     /  /  \\ \\');
                    this.addLine('                                    /  /    \\ \\');
                    this.addLine('                                   /  /      \\ \\');
                    this.addLine('                                  /  /________\\ \\');
                    this.addLine('                                 /    ________  \\');
                    this.addLine('                                /   /        \\  \\');
                    this.addLine('                               /   /          \\  \\');
                    this.addLine('');
                    this.addLine('                    ____   ____   ____   ____ _____ _  _     ____   ____');
                    this.addLine('                   |  _ \\ | ___| / ___| / ___| ____| \\| |   |  _ \\ / ___|');
                    this.addLine('                   | |_) ||  _| | |    | |   |  _| |  . ` |   | |_) | |  _');
                    this.addLine('                   |  _ < | |___| |___ | |___| |___| |\\  |   |  _ <| |_| |');
                    this.addLine('                   |_| \\_\\|_____|\\____| \\____|_____|_| \\_|   |_| \\_\\\\____|');
                    this.addLine('');
                    this.addLine('                                     [recon-ng v5.1.2]');
                    this.addLine('');
                    this.addLine('[recon-ng][default] > ');
                }
            },
            // Social Engineering Commands
            'analyze-email': {
                description: 'Analyze suspicious emails for phishing indicators',
                execute: (args) => {
                    if (args.length === 0) {
                        this.addLine('Usage: analyze-email <email_file>');
                        return;
                    }
                    this.addLine('Analyzing suspicious email...');
                    setTimeout(() => {
                        this.addLine('Email Analysis Report');
                        this.addLine('=====================');
                        this.addLine('From: security@paypal-support.com');
                        this.addLine('Subject: Urgent: Account Verification Required');
                        this.addLine('');
                        this.addLine('SUSPICIOUS INDICATORS:');
                        this.addLine('[HIGH] Sender domain mismatch');
                        this.addLine('[HIGH] Urgent language detected');
                        this.addLine('[MEDIUM] Generic greeting');
                        this.addLine('[HIGH] Suspicious link detected');
                        this.addLine('');
                        this.addLine('VERDICT: PHISHING EMAIL - DO NOT CLICK LINKS');
                        this.addLine('Confidence: 95%');
                        this.createInputLine();
                    }, 2000);
                    return 'async';
                }
            },
            'check-domain': {
                description: 'Check domain reputation and threat intelligence',
                execute: (args) => {
                    if (args.length === 0) {
                        this.addLine('Usage: check-domain <domain>');
                        return;
                    }
                    this.addLine(`Checking domain reputation for ${args[0]}...`);
                    setTimeout(() => {
                        this.addLine('Domain Analysis Results');
                        this.addLine('======================');
                        this.addLine(`Domain: ${args[0]}`);
                        this.addLine('Registered: 5 days ago');
                        this.addLine('');
                        this.addLine('Security Checks:');
                        this.addLine('[ALERT] Domain age: Less than 30 days');
                        this.addLine('[ALERT] Found on 3 threat intelligence feeds');
                        this.addLine('[WARNING] Self-signed SSL certificate');
                        this.addLine('');
                        this.addLine('VERDICT: MALICIOUS DOMAIN');
                        this.addLine('Risk Level: HIGH');
                        this.createInputLine();
                    }, 1500);
                    return 'async';
                }
            },
            // Wireless Security Commands
            'airodump-ng': {
                description: 'Wireless network discovery and monitoring',
                execute: (args) => {
                    this.addLine('Starting wireless network discovery...');
                    setTimeout(() => {
                        this.addLine('airodump-ng wlan0mon');
                        this.addLine('');
                        this.addLine('CH  6 ][ Elapsed: 1 min ][ WPA handshake: AA:BB:CC:DD:EE:FF');
                        this.addLine('');
                        this.addLine('BSSID              PWR  Beacons    #Data, #/s  CH  MB   CC  ESSID');
                        this.addLine('');
                        this.addLine('AA:BB:CC:DD:EE:FF  -42       15        0    0   6  54e  WPA2 HomeNetwork');
                        this.addLine('BB:CC:DD:EE:FF:AA  -55        8        0    0   1  54e  WPA2 OfficeWiFi');
                        this.addLine('CC:DD:EE:FF:AA:BB  -67        3        0    0  11  54e  WEP  OldRouter');
                        this.addLine('DD:EE:FF:AA:BB:CC  -78        1        0    0   6  54e  WPA3 SecureNet');
                        this.addLine('');
                        this.addLine('Press Ctrl+C to stop...');
                        this.createInputLine();
                    }, 2000);
                    return 'async';
                }
            },
            'aircrack-ng': {
                description: 'WPA/WPA2 key cracking tool',
                execute: (args) => {
                    if (args.length === 0) {
                        this.addLine('Usage: aircrack-ng -w wordlist.txt capture.cap');
                        return;
                    }
                    this.addLine('Starting WPA/WPA2 key cracking...');
                    setTimeout(() => {
                        this.addLine('Opening capture-01.cap');
                        this.addLine('Read 2534 packets.');
                        this.addLine('');
                        this.addLine('   #  BSSID              ESSID                     Encryption');
                        this.addLine('');
                        this.addLine('   1  AA:BB:CC:DD:EE:FF  HomeNetwork               WPA (1 handshake)');
                        this.addLine('');
                        this.addLine('Choosing first network as target.');
                        this.addLine('');
                        this.addLine('                               Aircrack-ng 1.7');
                        this.addLine('');
                        this.addLine('      [00:01:45] 1250/9999 keys tested (13.89 k/s)');
                        this.addLine('');
                        this.addLine('                          KEY FOUND! [ password123 ]');
                        this.createInputLine();
                    }, 3000);
                    return 'async';
                }
            },
            reaver: {
                description: 'WPS PIN attack tool',
                execute: (args) => {
                    if (args.length === 0) {
                        this.addLine('Usage: reaver -i wlan0mon -b <BSSID>');
                        return;
                    }
                    this.addLine('Starting WPS PIN attack with Reaver...');
                    setTimeout(() => {
                        this.addLine('Reaver v1.6.6 WiFi Protected Setup Attack Tool');
                        this.addLine('');
                        this.addLine('[+] Switching wlan0mon to channel 6');
                        this.addLine('[+] Waiting for beacon from AA:BB:CC:DD:EE:FF');
                        this.addLine('[+] Received beacon from AA:BB:CC:DD:EE:FF');
                        this.addLine('[+] Trying pin "12345670"');
                        this.addLine('[+] Sending authentication request');
                        this.addLine('[+] Associated with AA:BB:CC:DD:EE:FF');
                        this.addLine('[+] WPS PIN found: 12345670');
                        this.addLine('[+] WPA PSK: \'password123\'');
                        this.addLine('[+] AP SSID: \'HomeNetwork\'');
                        this.createInputLine();
                    }, 2500);
                    return 'async';
                }
            },
            // Advanced Exploitation Tools
            beef: {
                description: 'Browser Exploitation Framework',
                execute: (args) => {
                    this.addLine('BeEF - The Browser Exploitation Framework');
                    this.addLine('Version: 0.5.3.0');
                    this.addLine('');
                    this.addLine('Starting BeEF server...');
                    this.addLine('Web UI: http://127.0.0.1:3000/ui/panel');
                    this.addLine('Hook URL: http://127.0.0.1:3000/hook.js');
                    this.addLine('');
                    this.addLine('Username: beef');
                    this.addLine('Password: beef');
                }
            },
            armitage: {
                description: 'Graphical cyber attack management tool',
                execute: (args) => {
                    this.addLine('Armitage - Cyber Attack Management for Metasploit');
                    this.addLine('Starting Armitage GUI...');
                    this.addLine('Connecting to Metasploit RPC server...');
                    this.addLine('Loading exploits and payloads...');
                    this.addLine('Armitage ready - GUI launched');
                }
            },
            empire: {
                description: 'PowerShell and Python post-exploitation framework',
                execute: (args) => {
                    this.addLine('Empire - PowerShell & Python Post-Exploitation Framework');
                    this.addLine('Version: 5.0');
                    this.addLine('');
                    this.addLine(' ==================================================================================');
                    this.addLine(' Empire: PowerShell post-exploitation framework | [Version]: 5.0.0 | [Web]: https://github.com/EmpireProject/Empire');
                    this.addLine(' ==================================================================================');
                    this.addLine(' [Web]: https://github.com/EmpireProject/Empire | [Twitter]: @harmj0y, @sixdub, @enigma0x3');
                    this.addLine(' ==================================================================================');
                    this.addLine('');
                    this.addLine('(Empire) > ');
                }
            },
            // Advanced Network Tools
            scapy: {
                description: 'Interactive packet manipulation program',
                execute: (args) => {
                    this.addLine('Scapy - Interactive Packet Manipulation Program');
                    this.addLine('Version: 2.4.5');
                    this.addLine('');
                    this.addLine('Welcome to Scapy (2.4.5)');
                    this.addLine('>>> packet = IP(dst="192.168.1.1")/ICMP()');
                    this.addLine('>>> send(packet)');
                    this.addLine('Sent 1 packets.');
                    this.addLine('>>> sniff(count=5)');
                    this.addLine('<Sniffed: TCP:3 UDP:1 ICMP:1 Other:0>');
                }
            },
            hping3: {
                description: 'Network tool able to send custom TCP/IP packets',
                execute: (args) => {
                    if (args.length === 0) {
                        this.addLine('usage: hping3 host [options]');
                        this.addLine('  -S  --syn       set SYN flag');
                        this.addLine('  -A  --ack       set ACK flag');
                        this.addLine('  -F  --fin       set FIN flag');
                        this.addLine('  -p  --destport  destination port(default 0)');
                        return;
                    }
                    
                    const target = args[0];
                    this.addLine(`HPING ${target} (eth0 ${target}): S set, 40 headers + 0 data bytes`);
                    this.addLine(`len=46 ip=${target} ttl=64 DF id=0 sport=80 flags=SA seq=0 win=5840 rtt=0.4 ms`);
                    this.addLine(`len=46 ip=${target} ttl=64 DF id=0 sport=80 flags=SA seq=1 win=5840 rtt=0.3 ms`);
                    this.addLine(`len=46 ip=${target} ttl=64 DF id=0 sport=80 flags=SA seq=2 win=5840 rtt=0.5 ms`);
                }
            },
            // Container Security
            docker: {
                description: 'Container platform',
                execute: (args) => {
                    if (args.length === 0) {
                        this.addLine('Usage:  docker [OPTIONS] COMMAND');
                        this.addLine('');
                        this.addLine('A self-sufficient runtime for containers');
                        this.addLine('');
                        this.addLine('Management Commands:');
                        this.addLine('  container   Manage containers');
                        this.addLine('  image       Manage images');
                        this.addLine('  network     Manage networks');
                        this.addLine('  volume      Manage volumes');
                        return;
                    }
                    
                    if (args[0] === 'ps') {
                        this.addLine('CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS         PORTS                    NAMES');
                        this.addLine('abc123def456   nginx:latest   "/docker-entrypoint.…"   2 hours ago     Up 2 hours     0.0.0.0:80->80/tcp       web-server');
                        this.addLine('789ghi012jkl   mysql:5.7      "docker-entrypoint.s…"   3 hours ago     Up 3 hours     0.0.0.0:3306->3306/tcp   database');
                    } else if (args[0] === 'images') {
                        this.addLine('REPOSITORY   TAG       IMAGE ID       CREATED        SIZE');
                        this.addLine('nginx        latest    abc123def456   2 weeks ago    133MB');
                        this.addLine('mysql        5.7       789ghi012jkl   3 weeks ago    448MB');
                        this.addLine('kali         latest    mno345pqr678   1 week ago     1.2GB');
                    }
                }
            }
        };
    }

    addLine(text) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = this.escapeHtml(text);
        this.container.appendChild(line);
        this.scrollToBottom();
    }

    createInputLine() {
        const inputLine = document.createElement('div');
        inputLine.className = 'terminal-line terminal-input-line';
        inputLine.innerHTML = `
            <span class="text-warning">${this.prompt.split('@')[0]}</span><span class="text-white">@</span><span class="text-warning">${this.prompt.split('@')[1].split(':')[0]}</span><span class="text-white">:</span><span class="text-primary">${this.currentPath}</span><span class="text-white"># </span>
            <input type="text" class="terminal-input" style="background: transparent; border: none; outline: none; color: #00ff41; font-family: inherit; font-size: inherit; width: 70%;" autocomplete="off">
        `;
        
        this.container.appendChild(inputLine);
        
        const input = inputLine.querySelector('.terminal-input');
        input.focus();
        
        input.addEventListener('keydown', (e) => this.handleKeyDown(e, input, inputLine));
        this.scrollToBottom();
    }

    handleKeyDown(e, input, inputLine) {
        // Handle Ctrl+C to interrupt
        if (e.ctrlKey && e.key === 'c') {
            e.preventDefault();
            this.addLine('^C');
            inputLine.remove();
            this.createInputLine();
            return;
        }
        
        // Handle Ctrl+L to clear screen
        if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            this.container.innerHTML = '';
            this.createInputLine();
            return;
        }
        
        // Handle Ctrl+D for EOF/logout
        if (e.ctrlKey && e.key === 'd') {
            e.preventDefault();
            this.addLine('logout');
            inputLine.remove();
            this.addLine('Connection to terminal closed.');
            return;
        }
        
        if (e.key === 'Enter') {
            const command = input.value.trim();
            if (command) {
                this.commandHistory.push(command);
                this.historyIndex = this.commandHistory.length;
                this.saveCommandHistory();
                
                // Show the command in terminal
                const commandDisplay = inputLine.cloneNode(true);
                commandDisplay.querySelector('.terminal-input').remove();
                commandDisplay.innerHTML += this.escapeHtml(command);
                this.container.replaceChild(commandDisplay, inputLine);
                
                this.executeCommand(command);
            } else {
                inputLine.remove();
                this.createInputLine();
            }
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
        } else if (e.key === 'Tab') {
            e.preventDefault();
            this.autoComplete(input);
        }
    }

    executeCommand(commandLine) {
        const parts = commandLine.split(' ');
        const command = parts[0];
        const args = parts.slice(1);

        if (this.commands[command]) {
            const result = this.commands[command].execute(args);
            if (result !== 'async') {
                this.createInputLine();
            }
        } else {
            this.addLine(`${command}: command not found`);
            this.createInputLine();
        }
    }

    autoComplete(input) {
        const value = input.value;
        const commands = Object.keys(this.commands);
        const matches = commands.filter(cmd => cmd.startsWith(value));
        
        if (matches.length === 1) {
            input.value = matches[0] + ' ';
        } else if (matches.length > 1) {
            this.addLine('');
            this.addLine(matches.join('  '));
            this.createInputLine();
            const newInput = this.container.querySelector('.terminal-input');
            newInput.value = value;
            newInput.focus();
        }
    }

    focusInput() {
        const input = this.container.querySelector('.terminal-input');
        if (input) {
            input.focus();
        }
    }

    scrollToBottom() {
        this.container.scrollTop = this.container.scrollHeight;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    showCommandExamples(command) {
        const examples = {
            nmap: [
                'nmap 192.168.1.1                    # Basic host scan',
                'nmap -sS 192.168.1.0/24             # SYN scan on network',
                'nmap -sV -O 192.168.1.1             # Version and OS detection',
                'nmap -p 80,443 192.168.1.1          # Scan specific ports',
                'nmap -A 192.168.1.1                 # Aggressive scan'
            ],
            hydra: [
                'hydra -l admin -P passwords.txt ssh://192.168.1.1',
                'hydra -L users.txt -p password ftp://192.168.1.1',
                'hydra -l admin -P rockyou.txt 192.168.1.1 http-post-form',
                'hydra -C combo.txt ssh://192.168.1.1'
            ],
            sqlmap: [
                'sqlmap -u "http://site.com/page.php?id=1"',
                'sqlmap -u "http://site.com/page.php?id=1" --dbs',
                'sqlmap -u "http://site.com/page.php?id=1" --tables',
                'sqlmap -u "http://site.com/page.php?id=1" --dump'
            ],
            nikto: [
                'nikto -h 192.168.1.1',
                'nikto -h 192.168.1.1 -p 80,443',
                'nikto -h 192.168.1.1 -ssl',
                'nikto -h 192.168.1.1 -output report.txt'
            ],
            aircrack: [
                'aircrack-ng capture.cap',
                'aircrack-ng -w wordlist.txt capture.cap',
                'aircrack-ng -b AA:BB:CC:DD:EE:FF capture.cap'
            ]
        };
        
        if (examples[command]) {
            examples[command].forEach(example => {
                this.addLine(`  ${example}`);
            });
        } else {
            this.addLine(`No examples available for '${command}'`);
        }
    }
    
    startTutorial(module) {
        switch (module) {
            case 'basic':
                this.runBasicTutorial();
                break;
            case 'nmap':
                this.runNmapTutorial();
                break;
            case 'hydra':
                this.runHydraTutorial();
                break;
            case 'sqlmap':
                this.runSqlmapTutorial();
                break;
            case 'wireless':
                this.runWirelessTutorial();
                break;
            case 'forensics':
                this.runForensicsTutorial();
                break;
            default:
                this.addLine(`Tutorial module '${module}' not found.`);
                this.addLine('Available modules: basic, nmap, hydra, sqlmap, wireless, forensics');
        }
    }
    
    runBasicTutorial() {
        this.addLine('🎓 Basic Terminal Tutorial');
        this.addLine('========================');
        this.addLine('');
        this.addLine('Welcome to the basic terminal tutorial!');
        this.addLine('');
        this.addLine('Essential commands:');
        this.addLine('• ls      - List files and directories');
        this.addLine('• pwd     - Show current directory');
        this.addLine('• whoami  - Show current user');
        this.addLine('• help    - Show available commands');
        this.addLine('• clear   - Clear the terminal');
        this.addLine('');
        this.addLine('Try typing these commands to get familiar with the terminal!');
        this.addLine('');
        this.addLine('💡 Tip: Use Tab completion and arrow keys for efficiency');
    }
    
    runNmapTutorial() {
        this.addLine('🎓 Nmap Network Scanning Tutorial');
        this.addLine('================================');
        this.addLine('');
        this.addLine('Nmap is a powerful network discovery and security auditing tool.');
        this.addLine('');
        this.addLine('Basic scan types:');
        this.addLine('• nmap [target]           - Basic scan');
        this.addLine('• nmap -sS [target]       - SYN stealth scan');
        this.addLine('• nmap -sU [target]       - UDP scan');
        this.addLine('• nmap -sV [target]       - Version detection');
        this.addLine('• nmap -O [target]        - OS detection');
        this.addLine('');
        this.addLine('Port specification:');
        this.addLine('• nmap -p 80 [target]     - Scan port 80');
        this.addLine('• nmap -p 1-1000 [target] - Scan ports 1-1000');
        this.addLine('• nmap -p- [target]       - Scan all ports');
        this.addLine('');
        this.addLine('Try: nmap 192.168.1.1');
    }
    
    runHydraTutorial() {
        this.addLine('🎓 Hydra Password Attack Tutorial');
        this.addLine('=================================');
        this.addLine('');
        this.addLine('Hydra is a parallelized login cracker supporting many protocols.');
        this.addLine('');
        this.addLine('Basic syntax:');
        this.addLine('hydra [options] [target] [service]');
        this.addLine('');
        this.addLine('Common options:');
        this.addLine('• -l [user]     - Single username');
        this.addLine('• -L [file]     - Username list');
        this.addLine('• -p [pass]     - Single password');
        this.addLine('• -P [file]     - Password list');
        this.addLine('• -t [threads]  - Number of parallel connections');
        this.addLine('');
        this.addLine('Example attacks:');
        this.addLine('• SSH: hydra -l admin -P passwords.txt ssh://192.168.1.1');
        this.addLine('• FTP: hydra -L users.txt -p password ftp://192.168.1.1');
        this.addLine('');
        this.addLine('⚠️  Only use on systems you own or have permission to test!');
    }
    
    runSqlmapTutorial() {
        this.addLine('🎓 SQLMap SQL Injection Tutorial');
        this.addLine('================================');
        this.addLine('');
        this.addLine('SQLMap automates SQL injection detection and exploitation.');
        this.addLine('');
        this.addLine('Basic usage:');
        this.addLine('sqlmap -u "http://target.com/page.php?id=1"');
        this.addLine('');
        this.addLine('Common options:');
        this.addLine('• --dbs           - Enumerate databases');
        this.addLine('• --tables        - Enumerate tables');
        this.addLine('• --columns       - Enumerate columns');
        this.addLine('• --dump          - Dump table contents');
        this.addLine('• --batch         - Never ask for user input');
        this.addLine('');
        this.addLine('Advanced techniques:');
        this.addLine('• --tamper=space2comment  - Use tamper scripts');
        this.addLine('• --level=5 --risk=3      - Increase test levels');
        this.addLine('');
        this.addLine('⚠️  Only test on applications you own or have permission!');
    }
    
    runWirelessTutorial() {
        this.addLine('🎓 Wireless Security Tutorial');
        this.addLine('=============================');
        this.addLine('');
        this.addLine('Wireless penetration testing workflow:');
        this.addLine('');
        this.addLine('1. Monitor Mode:');
        this.addLine('   airmon-ng start wlan0');
        this.addLine('');
        this.addLine('2. Discover Networks:');
        this.addLine('   airodump-ng wlan0mon');
        this.addLine('');
        this.addLine('3. Capture Handshake:');
        this.addLine('   airodump-ng -c [channel] --bssid [AP] -w capture wlan0mon');
        this.addLine('');
        this.addLine('4. Deauth Attack:');
        this.addLine('   aireplay-ng -0 5 -a [AP] -c [client] wlan0mon');
        this.addLine('');
        this.addLine('5. Crack Password:');
        this.addLine('   aircrack-ng -w wordlist.txt capture.cap');
        this.addLine('');
        this.addLine('⚠️  Only test on networks you own or have explicit permission!');
    }
    
    runForensicsTutorial() {
        this.addLine('🎓 Digital Forensics Tutorial');
        this.addLine('============================');
        this.addLine('');
        this.addLine('Digital forensics tools and techniques:');
        this.addLine('');
        this.addLine('File Analysis:');
        this.addLine('• file [filename]         - Identify file type');
        this.addLine('• strings [filename]      - Extract strings');
        this.addLine('• binwalk [filename]      - Analyze firmware');
        this.addLine('• foremost [image]        - Recover files');
        this.addLine('');
        this.addLine('Memory Analysis:');
        this.addLine('• volatility -f memory.dmp imageinfo');
        this.addLine('• volatility -f memory.dmp --profile=Win7SP1x64 pslist');
        this.addLine('');
        this.addLine('Disk Analysis:');
        this.addLine('• autopsy                 - GUI forensics tool');
        this.addLine('• sleuthkit tools         - Command-line analysis');
        this.addLine('');
        this.addLine('Network Forensics:');
        this.addLine('• wireshark [pcap]        - Analyze network traffic');
        this.addLine('• tcpdump -r [pcap]       - Command-line analysis');
    }
    
    // Command history persistence
    saveCommandHistory() {
        try {
            const historyKey = `terminal_history_${this.environment.USER}`;
            localStorage.setItem(historyKey, JSON.stringify(this.commandHistory.slice(-100))); // Keep last 100 commands
        } catch (e) {
            // Ignore localStorage errors
        }
    }
    
    loadCommandHistory() {
        try {
            const historyKey = `terminal_history_${this.environment.USER}`;
            const saved = localStorage.getItem(historyKey);
            if (saved) {
                this.commandHistory = JSON.parse(saved);
                this.historyIndex = this.commandHistory.length;
            }
        } catch (e) {
            // Ignore localStorage errors
        }
    }
    
    // Helper methods for file system navigation
    resolvePath(path) {
        if (path.startsWith('/')) {
            return path;
        } else if (path === '~') {
            return '/home/root';
        } else if (path.startsWith('~/')) {
            return '/home/root/' + path.slice(2);
        } else if (path === '..') {
            const currentResolved = this.resolvePath(this.currentPath);
            const parts = currentResolved.split('/').filter(p => p);
            parts.pop();
            return '/' + parts.join('/');
        } else if (path === '.') {
            return this.resolvePath(this.currentPath);
        } else {
            // Relative path
            const currentResolved = this.resolvePath(this.currentPath);
            if (currentResolved === '/') {
                return '/' + path;
            } else {
                return currentResolved + '/' + path;
            }
        }
    }

    getPathObject(path) {
        const parts = path.split('/').filter(p => p);
        let current = this.fileSystem['/'];
        
        for (const part of parts) {
            if (current && current.type === 'directory' && current.contents[part]) {
                current = current.contents[part];
            } else {
                return null;
            }
        }
        
        return current;
    }

    findFiles(startPath, namePattern = null) {
        const results = [];
        const startObj = this.getPathObject(this.resolvePath(startPath));
        
        if (!startObj) {
            return [`find: '${startPath}': No such file or directory`];
        }
        
        const traverse = (obj, currentPath) => {
            if (obj.type === 'directory') {
                if (!namePattern || currentPath.includes(namePattern)) {
                    results.push(currentPath);
                }
                
                Object.keys(obj.contents).forEach(name => {
                    const childPath = currentPath === '/' ? '/' + name : currentPath + '/' + name;
                    traverse(obj.contents[name], childPath);
                });
            } else {
                if (!namePattern || currentPath.includes(namePattern)) {
                    results.push(currentPath);
                }
            }
        };
        
        traverse(startObj, this.resolvePath(startPath));
        return results;
    }
};

// Confirm VirtualTerminal is available globally
console.log('VirtualTerminal class defined:', typeof window.VirtualTerminal);

// Initialize terminals when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing terminals...');
    
    // Initialize penetration testing terminal
    if (document.getElementById('terminal-pentest')) {
        new window.VirtualTerminal('terminal-pentest', 'root@kali:~# ');
    }
    
    // Initialize forensics terminal
    if (document.getElementById('terminal-forensics')) {
        new window.VirtualTerminal('terminal-forensics', 'forensics@lab:~# ');
    }
    
    // Initialize social engineering terminal
    if (document.getElementById('terminal-social')) {
        new window.VirtualTerminal('terminal-social', 'analyst@security:~$ ');
    }
    
    // Initialize wireless security terminal
    if (document.getElementById('terminal-wireless')) {
        new window.VirtualTerminal('terminal-wireless', 'wireless@lab:~$ ');
    }
    
    // Initialize any other terminals
    if (document.getElementById('terminal-general')) {
        new window.VirtualTerminal('terminal-general', 'user@system:~$ ');
    }
    
    // Debug: Log that VirtualTerminal is available
    console.log('VirtualTerminal class loaded and available globally:', typeof window.VirtualTerminal);
});
