'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { t } from '@/lib/i18n';
import { useToast } from '@/components/ui/toast';
import { Nav } from '@/components/nav';
import { BackLink } from '@/components/nav';
import { Play, Square, Lightbulb, Copy, Plus, Users, Download } from 'lucide-react';

const DEFAULT_CODE = `// Welcome to CodeForge Me!
// Write your code here and press "Run"
function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("World"));
console.log("Ready to collaborate?");
console.log("AI suggestion: press Ctrl+Space");
`;

const LANGUAGES = ['JavaScript', 'TypeScript', 'Python', 'Go', 'Rust', 'C', 'Java', 'Ruby'];
const EXTENSIONS: Record<string, string> = {
  JavaScript: '.js',
  TypeScript: '.ts',
  Python: '.py',
  Go: '.go',
  Rust: '.rs',
  C: '.c',
  Java: '.java',
  Ruby: '.rb',
};

export default function EditorPage() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/editor';
  const { user } = useAuth();
  const { addToast } = useToast();
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const [editorLang, setEditorLang] = useState('JavaScript');
  const [mounted, setMounted] = useState(false);
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [roomUsers, setRoomUsers] = useState(1);
  const [roomCode, setRoomCode] = useState('');
  const [showJoin, setShowJoin] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('cf_lang') as 'en' | 'id' | null;
    if (stored) setLang(stored);
    // Generate room code if not exists
    const existing = localStorage.getItem('cf_room_code');
    if (existing) setRoomCode(existing);
  }, []);

  useEffect(() => {
    if (mounted && roomCode) {
      localStorage.setItem('cf_room_code', roomCode);
    }
  }, [mounted, roomCode]);

  const handleRun = useCallback(() => {
    setIsRunning(true);
    setOutput([]);
    const lines: string[] = [];
    const fakeConsoleLog = (...args: any[]) => {
      lines.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '));
    };
    try {
      const start = Date.now();
      const fn = new Function('console', 'require', code);
      fn({ log: fakeConsoleLog, error: fakeConsoleLog, warn: fakeConsoleLog, info: fakeConsoleLog }, (m: string) => ({ }));
      const elapsed = Date.now() - start;
      lines.push(`\n--- Execution completed in ${elapsed}ms ---`);
    } catch (err) {
      lines.push(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
    setTimeout(() => {
      setOutput(lines);
      setIsRunning(false);
      addToast({ title: t.runCode[lang], description: `${lines.length} ${lang === 'en' ? 'lines' : 'baris'}` });
    }, 300);
  }, [code, lang, addToast]);

  const handleSuggest = useCallback(() => {
    const suggestions = [
      'const result = data.filter(x => x.active).map(x => x.name);',
      'await new Promise(r => setTimeout(r, 1000));',
      'return { ...state, lastUpdated: Date.now() };',
      'const [value, setValue] = React.useState(null);',
      'const response = await fetch("/api/data", { method: "POST" });',
    ];
    const s = suggestions[Math.floor(Math.random() * suggestions.length)];
    setSuggestion(s);
  }, []);

  const handleAcceptSuggestion = () => {
    if (!suggestion) return;
    const current = code;
    setCode(current + '\n' + suggestion);
    setSuggestion('');
    addToast({ title: t.suggestionAccepted[lang] });
  };

  const handleRejectSuggestion = () => {
    setSuggestion('');
    addToast({ title: t.suggestionRejected[lang] });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    addToast({ title: t.copied[lang], description: `${code.length} characters` });
  };

  const handleExport = (ext?: string) => {
    const extension = ext || EXTENSIONS[editorLang] || '.txt';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codeforgeme-snippet${extension}`;
    a.click();
    URL.revokeObjectURL(url);
    addToast({ title: t.exportComplete[lang], description: `${lang === 'en' ? 'Exported as' : 'Diekspor sebagai'} ${extension}` });
  };

  const handleSaveToLibrary = () => {
    const raw = localStorage.getItem('cf_library') || '[]';
    const library = JSON.parse(raw);
    library.push({
      id: Date.now(),
      name: `Snippet ${library.length + 1}`,
      description: `${editorLang} snippet`,
      language: editorLang,
      code,
      ts: Date.now(),
    });
    localStorage.setItem('cf_library', JSON.stringify(library));
    addToast({ title: t.savedToLibrary[lang] });
  };

  const handleShareLink = () => {
    const encoded = btoa(unescape(encodeURIComponent(code)));
    const url = `${window.location.origin}/editor?code=${encoded.substring(0, 500)}`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(`Check this code on CodeForge Me:\n${url}`)}`;
    window.open(waUrl, '_blank');
    navigator.clipboard.writeText(url);
    addToast({ title: t.shareLinkCopied[lang] });
  };

  const handleNewRoom = () => {
    const newRoom = `room-${Math.random().toString(36).slice(2, 8)}`;
    setRoomCode(newRoom);
    setShowJoin(false);
    addToast({ title: t.newRoom[lang], description: newRoom });
    window.history.replaceState(null, '', `/editor?room=${newRoom}`);
  };

  const handleJoinRoom = (code: string) => {
    setRoomCode(code);
    setShowJoin(false);
    addToast({ title: t.joinRoom[lang], description: code });
    window.history.replaceState(null, '', `/editor?room=${code}`);
  };

  if (!mounted) return null;
  const L = t;

  return (
    <div className="min-h-screen bg-background">
      <Nav lang={lang} currentRoute="/editor" />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <BackLink href="/dashboard" lang={lang} />
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{L.editor[lang]}</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 px-3 py-1 rounded-md bg-muted text-sm">
              <Users size={14} className="text-muted-foreground" />
              <span>{roomUsers} {L.usersOnline[lang]}</span>
            </div>
            {roomCode && (
              <span className="px-3 py-1 rounded-md bg-primary/10 text-primary text-sm font-mono">{roomCode}</span>
            )}
          </div>
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setLang('en')}
            className={`px-3 py-1 rounded-md text-sm font-medium border transition-colors ${
              lang === 'en' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:bg-muted'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLang('id')}
            className={`px-3 py-1 rounded-md text-sm font-medium border transition-colors ${
              lang === 'id' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:bg-muted'
            }`}
          >
            ID
          </button>
          <div className="flex-1" />
          <button onClick={handleNewRoom} className="px-3 py-1 rounded-md border border-border text-sm font-medium hover:bg-muted transition-colors flex items-center gap-1">
            <Plus size={14} /> {L.newRoom[lang]}
          </button>
          <button onClick={() => setShowJoin(!showJoin)} className="px-3 py-1 rounded-md border border-border text-sm font-medium hover:bg-muted transition-colors">
            {L.joinRoom[lang]}
          </button>
        </div>

        {showJoin && (
          <div className="mb-4 p-4 rounded-lg border border-border bg-card flex items-center gap-3">
            <input
              type="text"
              placeholder={L.enterRoomCode[lang]}
              className="flex-1 px-3 py-1 rounded-md border border-border bg-card text-foreground text-sm"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
            />
            <button
              onClick={() => handleJoinRoom(roomCode)}
              className="px-4 py-1 bg-primary text-primary-foreground rounded-md text-sm font-medium"
            >
              {L.join[lang]}
            </button>
          </div>
        )}

        {/* Language Selector */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
          {LANGUAGES.map((l) => (
            <button
              key={l}
              onClick={() => setEditorLang(l)}
              className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                editorLang === l ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Editor */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <span className="text-sm font-medium">{L.editor[lang]} ({editorLang})</span>
              <div className="flex items-center gap-2">
                <button onClick={handleCopy} className="p-1 rounded-md hover:bg-muted transition-colors" title={L.copy[lang]}>
                  <Copy size={14} />
                </button>
                <button onClick={() => handleExport()} className="p-1 rounded-md hover:bg-muted transition-colors" title={L.exportCode[lang]}>
                  <Download size={14} />
                </button>
              </div>
            </div>
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-96 p-4 bg-transparent font-mono text-sm leading-relaxed resize-none focus:outline-none"
              spellCheck={false}
              onKeyDown={(e) => {
                if (e.key === 'Tab') {
                  e.preventDefault();
                  const start = e.currentTarget.selectionStart;
                  const end = e.currentTarget.selectionEnd;
                  setCode(code.substring(0, start) + '  ' + code.substring(end));
                  setTimeout(() => {
                    if (textareaRef.current) {
                      textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
                    }
                  }, 0);
                }
                if (e.ctrlKey && e.key === ' ') {
                  e.preventDefault();
                  handleSuggest();
                }
              }}
            />
          </div>

          {/* Terminal + Suggestions */}
          <div className="space-y-4">
            {/* AI Suggestion */}
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Lightbulb size={14} className="text-accent-foreground" />
                  {lang === 'en' ? 'AI Suggestion' : 'Saran AI'}
                </span>
                <button
                  onClick={handleSuggest}
                  className="px-3 py-1 rounded-md bg-accent text-accent-foreground text-xs font-medium hover:bg-accent/80 transition-colors"
                >
                  {L.suggest[lang]}
                </button>
              </div>
              {suggestion && (
                <div className="p-3 rounded-md bg-muted/50 border border-border font-mono text-xs leading-relaxed">
                  {suggestion}
                  <div className="flex gap-2 mt-2">
                    <button onClick={handleAcceptSuggestion} className="px-3 py-1 rounded-md bg-primary text-primary-foreground text-xs">
                      {lang === 'en' ? 'Accept' : 'Terima'}
                    </button>
                    <button onClick={handleRejectSuggestion} className="px-3 py-1 rounded-md border border-border text-xs">
                      {lang === 'en' ? 'Reject' : 'Tolak'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Terminal */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <span className="text-sm font-medium">{L.terminal[lang]}</span>
                <button onClick={() => setOutput([])} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  {L.clear[lang]}
                </button>
              </div>
              <div className="p-4 h-48 overflow-y-auto font-mono text-xs leading-relaxed bg-muted/20">
                {output.length === 0 ? (
                  <span className="text-muted-foreground">{L.noOutput[lang]}</span>
                ) : (
                  output.map((line, i) => (
                    <div key={i} className="whitespace-pre-wrap">{line}</div>
                  ))
                )}
              </div>
              <div className="px-4 py-3 border-t border-border flex items-center gap-3">
                <button
                  onClick={handleRun}
                  disabled={isRunning}
                  className="flex items-center gap-1 px-3 py-1 rounded-md bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 transition-opacity"
                >
                  {isRunning ? <Square size={14} /> : <Play size={14} />}
                  {isRunning ? L.stop[lang] : L.run[lang]}
                </button>
                <button onClick={handleSaveToLibrary} className="px-3 py-1 rounded-md border border-border text-sm hover:bg-muted transition-colors">
                  {lang === 'en' ? 'Save to Library' : 'Simpan ke Perpustakaan'}
                </button>
                <button onClick={handleShareLink} className="px-3 py-1 rounded-md border border-border text-sm hover:bg-muted transition-colors">
                  {L.shareLink[lang]}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}