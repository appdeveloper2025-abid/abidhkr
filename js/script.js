// ABID HACKER - Custom JavaScript

$(document).ready(function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Smooth scrolling for anchor links
    $('a[href^="#"]').on('click', function(event) {
        var target = $(this.getAttribute('href'));
        if( target.length ) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 100
            }, 1000);
        }
    });

    // Add loading animation to buttons (exclude navigation links)
    $('.btn').on('click', function(e) {
        var $btn = $(this);
        var originalText = $btn.text();
        
        // Don't add loading to navigation links or buttons with href attributes
        if (!$btn.hasClass('no-loading') && !$btn.attr('href') && !$btn.closest('nav').length) {
            e.preventDefault();
            $btn.html('<span class="loading"></span> Loading...');
            
            setTimeout(function() {
                $btn.html(originalText);
            }, 1500);
        }
    });

    // Terminal typing effect
    function typeWriter(element, text, speed = 50) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // Initialize terminal effects on page load
    $('.terminal').each(function() {
        const terminalText = $(this).text();
        typeWriter(this, terminalText, 30);
    });

    // Code syntax highlighting effect
    $('.code-block').each(function() {
        $(this).addClass('animate__animated animate__fadeIn');
    });

    // Navbar scroll effect
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('.navbar').addClass('scrolled');
        } else {
            $('.navbar').removeClass('scrolled');
        }
    });

    // Course progress tracking (localStorage)
    function updateProgress(courseId, progress) {
        localStorage.setItem('course_' + courseId, progress);
    }

    function getProgress(courseId) {
        return localStorage.getItem('course_' + courseId) || 0;
    }

    // Search functionality
    $('#searchInput').on('keyup', function() {
        var value = $(this).val().toLowerCase();
        $('.course-item').filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    // Dark mode toggle (already dark by default, but for future use)
    function toggleDarkMode() {
        $('body').toggleClass('light-mode');
        localStorage.setItem('darkMode', $('body').hasClass('light-mode') ? 'false' : 'true');
    }

    // Initialize dark mode from localStorage
    if (localStorage.getItem('darkMode') === 'false') {
        $('body').addClass('light-mode');
    }

    // Add click handlers for interactive elements
    $('.card').hover(
        function() {
            $(this).addClass('shadow-lg');
        },
        function() {
            $(this).removeClass('shadow-lg');
        }
    );

    // Console welcome message
    console.log('%c🛡️ ABID HACKER - Ethical Hacking Learning Platform', 'color: #00ff41; font-size: 16px; font-weight: bold;');
    console.log('%cWelcome to the developer console! This site was created by Abid Mehmood.', 'color: #00ff41;');
    console.log('%cEmail: abidbusiness@gmail.com | Phone: 03029382306', 'color: #8b949e;');

    // Easter egg - Konami code
    var konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    var konamiIndex = 0;

    $(document).keydown(function(e) {
        if (e.keyCode === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                alert('🎉 Konami Code Activated! Welcome to ABID HACKER Elite Mode!');
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
});

// Global variable to hold current modal terminal instance
let currentModalTerminal = null;

// Terminal Modal Functions
function openTerminalModal(terminalType) {
    const terminalTitles = {
        'general': 'General Practice Terminal',
        'pentest': 'Penetration Testing Terminal',
        'forensics': 'Digital Forensics Terminal',
        'social': 'Social Engineering Terminal',
        'wireless': 'Wireless Security Terminal'
    };
    
    const terminalHints = {
        'general': 'Practice basic Linux commands and navigation',
        'pentest': 'Advanced penetration testing tools and techniques',
        'forensics': 'Digital forensics analysis and investigation tools',
        'social': 'Social engineering tools and methodologies',
        'wireless': 'Wireless network security testing tools'
    };
    
    const terminalPrompts = {
        'general': 'user@kali:~$ ',
        'pentest': 'root@kali:~# ',
        'forensics': 'forensics@lab:~# ',
        'social': 'analyst@security:~$ ',
        'wireless': 'wireless@lab:~$ '
    };
    
    // Create modal if it doesn't exist
    if (!document.getElementById('terminalModal')) {
        const modalHtml = `
            <div class="modal fade" id="terminalModal" tabindex="-1" aria-labelledby="terminalTitle" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content bg-dark text-success">
                        <div class="modal-header border-success">
                            <h5 class="modal-title" id="terminalTitle">Terminal</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-info" role="alert">
                                <i class="fas fa-info-circle"></i> <span id="terminalHint">Terminal hint</span>
                            </div>
                            <div id="modal-terminal" class="terminal-container" style="height: 400px; overflow-y: auto; background: #000; padding: 10px; border-radius: 5px; font-family: 'Courier New', monospace;"></div>
                        </div>
                        <div class="modal-footer border-success">
                            <button type="button" class="btn btn-outline-success" onclick="clearTerminal()">
                                <i class="fas fa-broom"></i> Clear
                            </button>
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                                <i class="fas fa-times"></i> Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }
    
    // Update modal title and hint
    document.getElementById('terminalTitle').textContent = terminalTitles[terminalType];
    document.getElementById('terminalHint').textContent = terminalHints[terminalType];
    
    // Clear previous terminal
    const terminalContainer = document.getElementById('modal-terminal');
    terminalContainer.innerHTML = '';
    
    // Debug: Check if VirtualTerminal is available
    console.log('Checking VirtualTerminal availability:', typeof window.VirtualTerminal);
    
    // Wait for scripts to fully load
    setTimeout(() => {
        try {
            if (window.VirtualTerminal && typeof window.VirtualTerminal === 'function') {
                console.log('Creating terminal with prompt:', terminalPrompts[terminalType]);
                currentModalTerminal = new window.VirtualTerminal('modal-terminal', terminalPrompts[terminalType]);
                console.log('Terminal created successfully');
                
                // Focus terminal after creation
                setTimeout(() => {
                    if (currentModalTerminal && currentModalTerminal.focusInput) {
                        currentModalTerminal.focusInput();
                    }
                }, 300);
            } else {
                console.error('VirtualTerminal not available or not a function');
                terminalContainer.innerHTML = '<div class="text-center text-danger p-4">Loading terminal... Please wait a moment.</div>';
                
                // Try one more time after longer delay
                setTimeout(() => {
                    if (window.VirtualTerminal && typeof window.VirtualTerminal === 'function') {
                        currentModalTerminal = new window.VirtualTerminal('modal-terminal', terminalPrompts[terminalType]);
                        console.log('Terminal created on second attempt');
                        if (currentModalTerminal && currentModalTerminal.focusInput) {
                            currentModalTerminal.focusInput();
                        }
                    } else {
                        terminalContainer.innerHTML = '<div class="text-center text-danger p-4">Terminal initialization failed. Check console for errors.</div>';
                    }
                }, 1000);
            }
        } catch (error) {
            console.error('Error creating terminal:', error);
            terminalContainer.innerHTML = '<div class="text-center text-danger p-4">Error: ' + error.message + '</div>';
        }
    }, 200);
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('terminalModal'));
    modal.show();
}

function clearTerminal() {
    if (currentModalTerminal) {
        currentModalTerminal.container.innerHTML = '';
        currentModalTerminal.addLine('Welcome to ABID HACKER Virtual Terminal');
        currentModalTerminal.addLine('Type \'help\' to see available commands');
        currentModalTerminal.addLine('');
        currentModalTerminal.createInputLine();
        currentModalTerminal.focusInput();
    }
}

function createTerminalModal() {
    const modalHTML = `
    <!-- Terminal Modal -->
    <div class="modal fade" id="terminalModal" tabindex="-1" aria-labelledby="terminalModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content bg-dark">
                <div class="modal-header bg-success text-white">
                    <h5 class="modal-title" id="terminalModalLabel">
                        <i class="fas fa-terminal"></i> <span id="terminalTitle">Virtual Terminal</span>
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-0">
                    <div id="modal-terminal" class="virtual-terminal bg-black text-success" style="height: 500px; overflow-y: auto; padding: 15px; font-family: 'Courier New', monospace; font-size: 14px;">
                        <!-- Terminal content will be populated by JavaScript -->
                    </div>
                </div>
                <div class="modal-footer bg-dark">
                    <small class="text-muted me-auto">
                        <span id="terminalHint">Type 'help' to see available commands</span>
                    </small>
                    <button type="button" class="btn btn-outline-success btn-sm" onclick="clearTerminal()">
                        <i class="fas fa-trash"></i> Clear
                    </button>
                    <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>`;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Handle modal close event
    document.getElementById('terminalModal').addEventListener('hidden.bs.modal', function () {
        currentModalTerminal = null;
    });
}

function openCodeEditorModal() {
    // Check if modal exists, if not create it
    if (!document.getElementById('codeEditorModal')) {
        createCodeEditorModal();
    }
    
    const modal = new bootstrap.Modal(document.getElementById('codeEditorModal'));
    modal.show();
    
    // Initialize code editor if not already done
    setTimeout(() => {
        if (typeof CodeEditorTerminal !== 'undefined' && !window.codeEditorInstance) {
            window.codeEditorInstance = new CodeEditorTerminal('codeEditorTerminal');
        }
    }, 300);
}

function openPythonEditorModal() {
    // Check if modal exists, if not create it
    if (!document.getElementById('pythonEditorModal')) {
        createPythonEditorModal();
    }
    
    const modal = new bootstrap.Modal(document.getElementById('pythonEditorModal'));
    modal.show();
    
    // Initialize Python editor if not already done
    setTimeout(() => {
        if (typeof PythonEditor !== 'undefined' && !window.pythonEditorInstance) {
            window.pythonEditorInstance = new PythonEditor('pythonEditorTerminal');
        }
    }, 300);
}

function createCodeEditorModal() {
    const modalHTML = `
    <!-- Code Editor Modal -->
    <div class="modal fade" id="codeEditorModal" tabindex="-1" aria-labelledby="codeEditorModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content bg-dark">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title" id="codeEditorModalLabel">
                        <i class="fas fa-code"></i> Code Editor Terminal
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-0">
                    <div id="codeEditorTerminal" class="code-editor-terminal bg-black text-success" style="height: 600px; overflow-y: auto; padding: 15px; font-family: 'Courier New', monospace; font-size: 14px;">
                        <!-- Code editor terminal content will be populated by JavaScript -->
                    </div>
                </div>
                <div class="modal-footer bg-dark">
                    <small class="text-muted me-auto">
                        Multi-language code editor with execution support
                    </small>
                    <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>`;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function createPythonEditorModal() {
    const modalHTML = `
    <!-- Python Editor Modal -->
    <div class="modal fade" id="pythonEditorModal" tabindex="-1" aria-labelledby="pythonEditorModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content bg-dark">
                <div class="modal-header bg-warning text-dark">
                    <h5 class="modal-title" id="pythonEditorModalLabel">
                        <i class="fab fa-python"></i> Python Editor
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-0">
                    <div id="pythonEditorTerminal" class="python-editor-terminal bg-black text-success" style="height: 600px; overflow-y: auto; padding: 15px; font-family: 'Courier New', monospace; font-size: 14px;">
                        <!-- Python editor terminal content will be populated by JavaScript -->
                    </div>
                </div>
                <div class="modal-footer bg-dark">
                    <small class="text-muted me-auto">
                        Python code editor with execution simulation
                    </small>
                    <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>`;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Utility functions
function showNotification(message, type = 'success') {
    const notification = $(`
        <div class="alert alert-${type} alert-dismissible fade show position-fixed" 
             style="top: 100px; right: 20px; z-index: 9999;">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `);
    
    $('body').append(notification);
    
    setTimeout(() => {
        notification.alert('close');
    }, 5000);
}

// Course completion tracking
function markCourseComplete(courseId) {
    updateProgress(courseId, 100);
    showNotification('Course completed! Great job! 🎉');
}

// Copy code to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        showNotification('Code copied to clipboard!');
    });
}

// Add copy buttons to code blocks
$(document).ready(function() {
    $('.code-block').each(function() {
        const codeText = $(this).text();
        const copyBtn = $('<button class="btn btn-sm btn-outline-success copy-btn">Copy</button>');
        
        $(this).css('position', 'relative');
        copyBtn.css({
            'position': 'absolute',
            'top': '10px',
            'right': '10px'
        });
        
        $(this).append(copyBtn);
        
        copyBtn.on('click', function(e) {
            e.preventDefault();
            copyToClipboard(codeText);
        });
    });
});
