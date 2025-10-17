(function(){
  const PISTON_BASE = 'https://emkc.org/api/v2/piston';
  const ENDPOINT_RUNTIMES = `${PISTON_BASE}/runtimes`;
  const ENDPOINT_EXECUTE = `${PISTON_BASE}/execute`;

  const STORAGE_PREFIX = 'abidcodingagent';
  const el = {
    language: document.getElementById('languageSelect'),
    version: document.getElementById('versionSelect'),
    runBtn: document.getElementById('runBtn'),
    templateBtn: document.getElementById('templateBtn'),
    themeToggle: document.getElementById('themeToggle'),
    status: document.getElementById('statusBadge'),
    stdin: document.getElementById('stdin'),
    stdout: document.getElementById('stdout'),
    stderr: document.getElementById('stderr'),
    compile: document.getElementById('compile'),
    exitCode: document.getElementById('exitCode'),
    time: document.getElementById('time'),
    memory: document.getElementById('memory')
  };

  // Ace editor setup
  const editor = ace.edit('editor');
  editor.setTheme('ace/theme/monokai');
  editor.session.setMode('ace/mode/text');
  editor.setOptions({
    fontSize: '14px',
    showPrintMargin: false,
    tabSize: 2,
    useSoftTabs: true,
    wrap: true,
  });

  const state = {
    runtimes: [],
    languageToVersions: new Map(),
    selectedLanguage: null,
    selectedVersion: null,
  };

  function setStatus(text, tone = 'muted'){
    el.status.textContent = text;
    el.status.style.color = tone === 'error' ? 'var(--bad)' : tone === 'ok' ? 'var(--good)' : 'var(--muted)';
  }

  function toTitleCase(s){
    return s.replace(/(^|[^a-zA-Z])(\w)/g, (_, p1, p2) => p1 + p2.toUpperCase());
  }

  function getLocalKey(key){
    return `${STORAGE_PREFIX}:${key}`;
  }

  function saveCodeForLanguage(language, code){
    try { localStorage.setItem(getLocalKey(`code:${language}`), code); } catch {}
  }

  function loadCodeForLanguage(language){
    try { return localStorage.getItem(getLocalKey(`code:${language}`)); } catch { return null; }
  }

  function saveLastSelection(language, version){
    try { localStorage.setItem(getLocalKey('lastLanguage'), language); } catch {}
    try { localStorage.setItem(getLocalKey(`version:${language}`), version); } catch {}
  }

  function loadLastLanguage(){
    try { return localStorage.getItem(getLocalKey('lastLanguage')); } catch { return null; }
  }

  function loadSavedVersion(language){
    try { return localStorage.getItem(getLocalKey(`version:${language}`)); } catch { return null; }
  }

  function debounce(fn, wait){
    let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
  }

  const debouncedSave = debounce(() => {
    if (state.selectedLanguage) {
      saveCodeForLanguage(state.selectedLanguage, editor.getValue());
    }
  }, 500);

  editor.session.on('change', debouncedSave);
  window.addEventListener('beforeunload', debouncedSave);

  function detectAceMode(language){
    const l = language.toLowerCase();
    if (l.includes('python')) return 'ace/mode/python';
    if (l.includes('typescript')) return 'ace/mode/typescript';
    if (l.includes('javascript') || l.includes('node')) return 'ace/mode/javascript';
    if (l.includes('java')) return 'ace/mode/java';
    if (l.includes('csharp') || l.includes('c#') || l.includes('dotnet')) return 'ace/mode/csharp';
    if (l.includes('c++') || l.includes('cpp')) return 'ace/mode/c_cpp';
    if (l === 'c') return 'ace/mode/c_cpp';
    if (l.includes('go')) return 'ace/mode/golang';
    if (l.includes('rust')) return 'ace/mode/rust';
    if (l.includes('php')) return 'ace/mode/php';
    if (l.includes('ruby')) return 'ace/mode/ruby';
    if (l.includes('swift')) return 'ace/mode/swift';
    if (l.includes('kotlin')) return 'ace/mode/kotlin';
    return 'ace/mode/text';
  }

  function getMainFileName(language){
    const l = language.toLowerCase();
    if (l.includes('python')) return 'main.py';
    if (l.includes('typescript')) return 'main.ts';
    if (l.includes('javascript') || l.includes('node')) return 'main.js';
    if (l.includes('java')) return 'Main.java';
    if (l.includes('csharp') || l.includes('c#') || l.includes('dotnet')) return 'Main.cs';
    if (l.includes('c++') || l.includes('cpp')) return 'main.cpp';
    if (l === 'c') return 'main.c';
    if (l.includes('go')) return 'main.go';
    if (l.includes('rust')) return 'main.rs';
    if (l.includes('php')) return 'main.php';
    if (l.includes('ruby')) return 'main.rb';
    if (l.includes('swift')) return 'main.swift';
    if (l.includes('kotlin')) return 'Main.kt';
    return 'main.txt';
  }

  function getTemplate(language){
    const l = language.toLowerCase();
    if (l.includes('python')) return `import sys\n\n\ndef main():\n    data = sys.stdin.read().strip()\n\n    if not data:\n        print(\"Hello from Python!\")\n    else:\n        print(f\"Echo: {data}\")\n\n\nif __name__ == \"__main__\":\n    main()\n`;
    if (l.includes('javascript') || l.includes('node')) return `const fs = require('fs');\n\nconst input = fs.readFileSync(0, 'utf8').trim();\nif (!input) {\n  console.log('Hello from JavaScript (Node.js)!');\n} else {\n  console.log('Echo:', input);\n}\n`;
    if (l.includes('java')) return `import java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringBuilder sb = new StringBuilder();\n        String line;\n        while ((line = br.readLine()) != null) {\n            if (sb.length() > 0) sb.append("\n");\n            sb.append(line);\n        }\n        String input = sb.toString().trim();\n        if (input.isEmpty()) {\n            System.out.println("Hello from Java!");\n        } else {\n            System.out.println("Echo: " + input);\n        }\n    }\n}\n`;
    if (l === 'c' || l.includes(' c ')) return `#include <stdio.h>\n\nint main(){\n  char buf[1024];\n  if (fgets(buf, sizeof(buf), stdin) == NULL) {\n    printf("Hello from C!\\n");\n  } else {\n    printf("Echo: %s", buf);\n  }\n  return 0;\n}\n`;
    if (l.includes('c++') || l.includes('cpp')) return `#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n  ios::sync_with_stdio(false);\n  cin.tie(nullptr);\n  string s, all;\n  while (getline(cin, s)) { if (!all.empty()) all += "\n"; all += s; }\n  if (all.empty()) cout << "Hello from C++!\\n";\n  else cout << "Echo: " << all << "\\n";\n  return 0;\n}\n`;
    if (l.includes('go')) return `package main\n\nimport (\n  "bufio"\n  "fmt"\n  "os"\n  "strings"\n)\n\nfunc main(){\n  scanner := bufio.NewScanner(os.Stdin)\n  var lines []string\n  for scanner.Scan(){\n    lines = append(lines, scanner.Text())\n  }\n  input := strings.TrimSpace(strings.Join(lines, "\n"))\n  if input == "" {\n    fmt.Println("Hello from Go!")\n  } else {\n    fmt.Println("Echo:", input)\n  }\n}\n`;
    if (l.includes('ruby')) return `input = STDIN.read.strip\nputs input.empty? ? "Hello from Ruby!" : "Echo: #{input}"\n`;
    if (l.includes('php')) return `<?php\n$input = trim(stream_get_contents(STDIN));\nif ($input === "") {\n  echo "Hello from PHP!\\n";\n} else {\n  echo "Echo: " . $input . "\\n";\n}\n`;
    if (l.includes('rust')) return `use std::io::{self, Read};\n\nfn main(){\n    let mut input = String::new();\n    io::stdin().read_to_string(&mut input).unwrap();\n    let input = input.trim();\n    if input.is_empty(){\n        println!("Hello from Rust!");\n    } else {\n        println!("Echo: {}", input);\n    }\n}\n`;
    return `// Language template not found.\n// Write your program here.\n`; 
  }

  function groupRuntimes(runtimes){
    const map = new Map();
    for (const r of runtimes){
      const lang = r.language.toLowerCase();
      if (!map.has(lang)) map.set(lang, []);
      map.get(lang).push(r.version);
    }
    for (const [k, arr] of map){
      arr.sort((a,b) => a.localeCompare(b, undefined, {numeric:true, sensitivity:'base'})).reverse();
    }
    return map;
  }

  function populateLanguages(){
    const preferred = ['python', 'javascript', 'java', 'c++', 'cpp', 'c', 'go', 'ruby', 'php', 'rust', 'typescript'];
    const langs = Array.from(state.languageToVersions.keys());
    langs.sort((a,b) => {
      const ai = preferred.indexOf(a);
      const bi = preferred.indexOf(b);
      if (ai !== -1 || bi !== -1){
        return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
      }
      return a.localeCompare(b);
    });

    el.language.innerHTML = '';
    for (const lang of langs){
      const opt = document.createElement('option');
      opt.value = lang;
      opt.textContent = toTitleCase(lang);
      el.language.appendChild(opt);
    }

    const last = loadLastLanguage();
    if (last && state.languageToVersions.has(last)) {
      el.language.value = last;
    }

    handleLanguageChange();
  }

  function populateVersions(language){
    const versions = state.languageToVersions.get(language) || [];
    el.version.innerHTML = '';
    for (const v of versions){
      const opt = document.createElement('option');
      opt.value = v; opt.textContent = v;
      el.version.appendChild(opt);
    }
    const savedV = loadSavedVersion(language);
    if (savedV && versions.includes(savedV)){
      el.version.value = savedV;
    } else if (versions.length){
      el.version.value = versions[0];
    }
    state.selectedVersion = el.version.value;
  }

  function handleLanguageChange(){
    const lang = el.language.value;
    state.selectedLanguage = lang;
    populateVersions(lang);

    const mode = detectAceMode(lang);
    editor.session.setMode(mode);

    const saved = loadCodeForLanguage(lang);
    editor.setValue(saved ?? getTemplate(lang), -1);

    saveLastSelection(lang, state.selectedVersion);
    setStatus('Ready');
  }

  function handleVersionChange(){
    state.selectedVersion = el.version.value;
    saveLastSelection(state.selectedLanguage, state.selectedVersion);
  }

  async function fetchRuntimes(){
    setStatus('Loading runtimes…');
    try {
      const res = await fetch(ENDPOINT_RUNTIMES, { method:'GET' });
      if (!res.ok) throw new Error(`Failed to load runtimes: ${res.status}`);
      const data = await res.json();
      state.runtimes = data;
      state.languageToVersions = groupRuntimes(data);
      populateLanguages();
      setStatus('Runtimes loaded');
    } catch (err){
      console.error(err);
      setStatus('Failed to load runtimes', 'error');
    }
  }

  function clearOutput(){
    el.stdout.textContent = '';
    el.stderr.textContent = '';
    el.compile.textContent = '';
    el.exitCode.textContent = '—';
    el.time.textContent = '—';
    el.memory.textContent = '—';
  }

  async function run(){
    if (!state.selectedLanguage || !state.selectedVersion) return;

    const language = state.selectedLanguage;
    const version = state.selectedVersion;
    const code = editor.getValue();
    const stdin = el.stdin.value ?? '';
    const fileName = getMainFileName(language);

    clearOutput();
    el.runBtn.disabled = true;
    setStatus('Running…');

    try {
      const body = {
        language,
        version,
        files: [{ name: fileName, content: code }],
        stdin,
      };

      const res = await fetch(ENDPOINT_EXECUTE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`Execute failed: ${res.status}`);
      const data = await res.json();
      // data structure: { run: { stdout, stderr, code, signal, output }, compile?: { stdout, stderr, code } }
      const run = data.run || {};
      const compile = data.compile || {};

      el.stdout.textContent = (run.stdout || '').trimEnd();
      el.stderr.textContent = [compile.stderr, run.stderr].filter(Boolean).join('\n').trim();
      el.compile.textContent = [compile.stdout].filter(Boolean).join('\n').trim();

      el.exitCode.textContent = `exit: ${run.code ?? 'n/a'}`;
      if (run.signal) el.exitCode.textContent += ` (${run.signal})`;
      el.time.textContent = data?.run?.stdout !== undefined && data?.time ? `time: ${data.time}ms` : '';
      el.memory.textContent = data?.memory ? `mem: ${data.memory}KB` : '';

      const ok = (run.code === 0 || run.code === undefined) && !(compile.stderr);
      setStatus(ok ? 'Done' : 'Completed with errors', ok ? 'ok' : 'error');
    } catch (err){
      console.error(err);
      setStatus('Run failed', 'error');
      el.stderr.textContent = String(err);
    } finally {
      el.runBtn.disabled = false;
    }
  }

  function resetTemplate(){
    if (!state.selectedLanguage) return;
    editor.setValue(getTemplate(state.selectedLanguage), -1);
  }

  function initTheme(){
    const saved = localStorage.getItem(getLocalKey('theme'));
    if (saved === 'light'){
      document.documentElement.classList.add('light');
      editor.setTheme('ace/theme/github');
    } else {
      document.documentElement.classList.remove('light');
      editor.setTheme('ace/theme/monokai');
    }
  }

  function toggleTheme(){
    const isLight = document.documentElement.classList.toggle('light');
    localStorage.setItem(getLocalKey('theme'), isLight ? 'light' : 'dark');
    editor.setTheme(isLight ? 'ace/theme/github' : 'ace/theme/monokai');
  }

  // Wire events
  el.language.addEventListener('change', handleLanguageChange);
  el.version.addEventListener('change', handleVersionChange);
  el.runBtn.addEventListener('click', run);
  el.templateBtn.addEventListener('click', resetTemplate);
  el.themeToggle.addEventListener('click', toggleTheme);

  // Bootstrap
  initTheme();
  fetchRuntimes();
})();
