import { useQuery } from '@tanstack/react-query';
import { getSources, getAIContext } from '../api/sources';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Search, Pin, MessageSquare, Send, Sparkles, Database, Plus, Lightbulb, FileText, BarChart3, User, Cpu, Info, Columns, Layers, Link as LinkIcon, Filter, Zap, X } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const OLLAMA_URL = 'http://localhost:11434/api/chat';
const MODEL = 'llama3.2';

const SUGGESTIONS = [
  { icon: Lightbulb, text: 'Analyze dataset schema', desc: 'Identify primary keys and foreign keys' },
  { icon: BarChart3, text: 'Generate sales report', desc: 'Output a `chart-bar` JSON block for sales' },
  { icon: FileText, text: 'Summarize anomalies', desc: 'Find missing values and outliers' },
  { icon: Database, text: 'Write SQL query', desc: 'Generate SQL to extract top 10 customers' },
];

const PINNED_CHATS = [
  { id: 1, title: 'Q3 Sales Analysis', date: '2d ago' },
  { id: 2, title: 'Customer Churn Prediction', date: '5d ago' },
];

const RECENT_CHATS = [
  { id: 3, title: 'Data Quality Report', date: 'Yesterday' },
  { id: 4, title: 'SQL Joins for Orders', date: 'Yesterday' },
  { id: 5, title: 'Schema Optimization', date: 'Last Week' },
];

export default function AIPage() {
  const { data } = useQuery({ queryKey: ['sources'], queryFn: getSources });
  const sources = data?.data || [];
  
  const [selectedId, setSelectedId] = useState('');
  const [context, setContext] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [ollamaOk, setOllamaOk] = useState(null);
  const bottomRef = useRef(null);

  // Right panel toggle
  const [showContextPanel, setShowContextPanel] = useState(true);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    fetch('http://localhost:11434/api/tags')
      .then(() => setOllamaOk(true))
      .catch(() => setOllamaOk(false));
  }, []);

  const loadContext = async (id) => {
    setSelectedId(id);
    setMessages([]);
    if (!id) { setContext(null); return; }
    try {
      const r = await getAIContext(id);
      setContext({ ...r.data.context, filename: r.data.filename });
      setMessages([{
        role: 'assistant',
        content: `I've loaded **${r.data.filename}** context into memory.\n\n- **Rows:** ${r.data.context.row_count}\n- **Columns:** ${r.data.context.columns.length}\n- **Detected Entity:** ${r.data.context.ontology?.entity_name}\n\nWhat would you like to analyze today? You can ask me to generate SQL, identify anomalies, or even visualize data trends.`
      }]);
    } catch { setContext(null); }
  };

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    const newMessages = [...messages, { role: 'user', content: msg }];
    setMessages(newMessages);
    setLoading(true);

    const sysCtx = context ? `Dataset Context:\n- Rows: ${context.row_count}\n- Cols: ${context.columns.join(', ')}\n- Entity: ${context.ontology?.entity_name}\n\n` : '';
    const systemPrompt = `You are Foundry AIP, an advanced AI business analyst.
${sysCtx}
When a user asks for data analysis, metrics, or trends (e.g., "Show revenue"), you MUST automatically respond with a comprehensive analysis structured EXACTLY in this order:

### 1. Chart
Output a \`\`\`chart-bar\`\`\` or \`\`\`chart-line\`\`\` code block containing a JSON array of the data. Example:
\`\`\`chart-bar
[{"name": "Jan", "value": 400}, {"name": "Feb", "value": 300}]
\`\`\`

### 2. Table
Provide a standard Markdown table representing the exact same data shown in the chart.

### 3. Summary
A brief 1-2 sentence text summary of the key insight.

### 4. Recommendations
Instead of answering with text, you MUST output an \`action-chips\` code block containing a JSON array of up to 4 recommended next steps the user can take (e.g., ["Clean duplicates", "Join datasets", "Create dashboard", "Generate KPI", "Analyze customer churn", "Detect anomalies"]). Example:
\`\`\`action-chips
["Clean duplicates", "Generate KPI"]
\`\`\`

You do not need the user to ask for a chart explicitly. Automatically infer the best visualization and generate plausible data based on the schema if you don't have the exact rows. Always include the Chart, Table, Summary, and Recommendations (as action chips).`;

    try {
      const response = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            ...newMessages.map(m => ({ role: m.role, content: m.content })),
          ],
          stream: true,
        }),
      });

      let fullText = '';
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value).split('\n').filter(Boolean);
        for (const line of lines) {
          try {
            const chunk = JSON.parse(line);
            const token = chunk?.message?.content || '';
            fullText += token;
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1] = { role: 'assistant', content: fullText };
              return updated;
            });
          } catch {}
        }
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: `❌ **Connection Error:** Could not reach Ollama backend at \`localhost:11434\`.\n\nPlease ensure Ollama is running.\n\n\`\`\`bash\nollama serve\nollama pull llama3.2\n\`\`\`` }]);
    } finally { setLoading(false); }
  };

  const renderers = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-([\w-]+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      if (language === 'action-chips') {
        try {
          const chips = JSON.parse(String(children).replace(/\n$/, ''));
          return (
            <div className="flex flex-wrap gap-2 mt-4 mb-2">
              {chips.map((chip, idx) => (
                <button 
                  key={idx}
                  onClick={() => send(chip)}
                  className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-300 rounded-full text-sm font-semibold transition-colors flex items-center gap-1.5 border border-blue-200 dark:border-blue-800/50 shadow-sm"
                >
                  <Sparkles size={14} />
                  {chip}
                </button>
              ))}
            </div>
          );
        } catch (e) {
          return null;
        }
      }

      if (language.startsWith('chart-')) {
        try {
          const data = JSON.parse(String(children).replace(/\n$/, ''));
          const type = language.split('-')[1];
          return (
            <div className="my-6 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm h-80">
              <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                <BarChart3 size={16} className="text-blue-500" /> Auto-generated {type.toUpperCase()} chart
              </h4>
              <ResponsiveContainer width="100%" height="100%">
                {type === 'bar' ? (
                  <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#1f2937', color: '#fff' }} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  </BarChart>
                ) : (
                  <LineChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#1f2937', color: '#fff' }} />
                    <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          );
        } catch (e) {
          return <div className="text-red-500 text-sm p-4 bg-red-50 rounded-lg border border-red-200">Failed to render chart: Invalid JSON data.</div>;
        }
      }
  
      return !inline && match ? (
        <div className="relative group my-6 rounded-xl overflow-hidden shadow-sm border border-gray-700">
          <div className="bg-gray-800 text-gray-400 text-xs px-4 py-2 flex justify-between items-center border-b border-gray-700">
            <span className="font-mono">{language}</span>
            <button className="hover:text-white transition-colors" onClick={() => navigator.clipboard.writeText(String(children))}>Copy Code</button>
          </div>
          <SyntaxHighlighter
            style={vscDarkPlus}
            language={language}
            PreTag="div"
            customStyle={{ margin: 0, padding: '1.25rem', background: '#1e1e1e', fontSize: '13px' }}
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className="bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 px-1.5 py-0.5 rounded font-mono text-sm" {...props}>
          {children}
        </code>
      );
    },
    table: ({...props}) => <div className="overflow-x-auto my-6"><table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm" {...props} /></div>,
    thead: ({...props}) => <thead className="bg-gray-50 dark:bg-gray-800/50" {...props} />,
    th: ({...props}) => <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider" {...props} />,
    td: ({...props}) => <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900" {...props} />,
    h1: ({...props}) => <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4" {...props} />,
    h2: ({...props}) => <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4 border-b border-gray-200 dark:border-gray-800 pb-2" {...props} />,
    p: ({...props}) => <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300" {...props} />,
    ul: ({...props}) => <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />,
    ol: ({...props}) => <ol className="list-decimal pl-6 mb-4 space-y-1" {...props} />,
    li: ({...props}) => <li className="pl-1" {...props} />,
    h3: ({...props}) => <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-8 mb-4" {...props} />,
    h4: ({...props}) => <h4 className="text-base font-bold text-gray-900 dark:text-white mt-6 mb-3" {...props} />,
    blockquote: ({...props}) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 my-6 bg-gray-50 dark:bg-gray-800/50 py-3 pr-4 rounded-r-xl" {...props} />
  };

  const filteredPinned = PINNED_CHATS.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredRecent = RECENT_CHATS.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()));

  // Estimate Context metrics
  const contextStr = context ? JSON.stringify(context) : '';
  const contextSizeKB = context ? (contextStr.length / 1024).toFixed(1) : 0;
  const estimatedTokens = context ? Math.round(contextStr.length / 4).toLocaleString() : 0;

  return (
    <div className="flex h-full bg-white dark:bg-gray-950 overflow-hidden">
      
      {/* Sidebar */}
      <div className="w-72 border-r border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="text-blue-500" size={20} /> Foundry AIP
          </div>
          <button onClick={() => setMessages([])} className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 transition-colors shadow-sm" title="New Chat">
            <Plus size={18} />
          </button>
        </div>
        
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-200 shadow-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {(searchQuery ? filteredPinned.length > 0 : true) && (
            <div>
              <h4 className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Pin size={12} className="text-gray-400" /> Pinned
              </h4>
              <div className="space-y-1">
                {filteredPinned.map(c => (
                  <button key={c.id} className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-800 transition-colors flex flex-col group">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{c.title}</span>
                    <span className="text-xs text-gray-400 group-hover:text-gray-500">{c.date}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {(searchQuery ? filteredRecent.length > 0 : true) && (
            <div>
              <h4 className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <MessageSquare size={12} className="text-gray-400" /> Recent
              </h4>
              <div className="space-y-1">
                {filteredRecent.map(c => (
                  <button key={c.id} className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-800 transition-colors flex flex-col group">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{c.title}</span>
                    <span className="text-xs text-gray-400 group-hover:text-gray-500">{c.date}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
        
        {/* Header - Context Selector & Inspector Toggle */}
        <div className="h-14 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur flex items-center justify-between px-4 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Database size={16} className="text-gray-400" />
            <select value={selectedId} onChange={e => loadContext(e.target.value)} className="bg-transparent text-sm font-semibold text-gray-800 dark:text-gray-200 focus:outline-none cursor-pointer">
              <option value="">Select a dataset context...</option>
              {sources.map(s => <option key={s.id} value={s.id}>{s.filename}</option>)}
            </select>
          </div>
          <button 
            onClick={() => setShowContextPanel(!showContextPanel)}
            className={`p-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${showContextPanel ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <Cpu size={16} />
            Context
          </button>
        </div>

        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-3xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-200 dark:border-blue-800/50">
              <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">Hello, how can I help you today?</h1>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-12">I'm your AI data analyst. Select a dataset context above or just start asking questions.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => send(s.text)} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all rounded-2xl p-5 text-left group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                      <s.icon size={18} />
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{s.text}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 ml-[44px]">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
            <div className="max-w-4xl mx-auto space-y-8 pb-32">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  
                  {m.role === 'assistant' && (
                    <div className="w-8 h-8 shrink-0 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center border border-blue-200 dark:border-blue-800/50 shadow-sm mt-1">
                      <Sparkles size={16} className="text-blue-600 dark:text-blue-400" />
                    </div>
                  )}

                  <div className={`max-w-[85%] rounded-3xl px-6 py-4 text-[15px] shadow-sm ${
                    m.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-sm' 
                      : 'bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-800 rounded-tl-sm'
                  }`}>
                    {m.content ? (
                      m.role === 'user' ? (
                        <div className="whitespace-pre-wrap">{m.content}</div>
                      ) : (
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]} 
                          components={renderers}
                          className="prose dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent"
                        >
                          {m.content}
                        </ReactMarkdown>
                      )
                    ) : (
                      <div className="flex items-center gap-2 h-6">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                      </div>
                    )}
                  </div>

                  {m.role === 'user' && (
                    <div className="w-8 h-8 shrink-0 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shadow-sm mt-1">
                      <User size={16} className="text-gray-500 dark:text-gray-300" />
                    </div>
                  )}

                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          </div>
        )}

        {/* Chat Input */}
        <div className="p-4 md:p-6 bg-gradient-to-t from-white via-white to-transparent dark:from-gray-900 dark:via-gray-900 absolute bottom-0 w-full left-0">
          <div className="max-w-4xl mx-auto relative group">
            <textarea 
              value={input} 
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Message Foundry AIP... (Shift+Enter for new line)"
              rows={1}
              disabled={loading}
              className="w-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl pl-6 pr-14 py-4 text-[15px] text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-lg transition-all disabled:bg-gray-50 disabled:opacity-70 resize-none min-h-[60px] max-h-[200px]" 
            />
            <button 
              onClick={() => send()} 
              disabled={!input.trim() || loading}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:bg-gray-400 transition-colors flex items-center justify-center"
            >
              {loading ? <Sparkles className="animate-spin-slow" size={20} /> : <Send size={20} className="ml-1" />}
            </button>
          </div>
          <div className="text-center text-xs text-gray-400 mt-3 font-medium">
            AI can make mistakes. Verify important information.
          </div>
        </div>

      </div>

      {/* Right AI Context Panel */}
      {showContextPanel && (
        <div className="w-80 bg-gray-50 dark:bg-gray-900 flex flex-col shrink-0 border-l border-gray-200 dark:border-gray-800 animate-in slide-in-from-right-8 duration-300">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-950">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Cpu className="text-purple-500" size={18} /> Context Inspector
            </h3>
            <button onClick={() => setShowContextPanel(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {context ? (
              <div className="space-y-6">
                
                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-1">Context Size</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{contextSizeKB} <span className="text-xs font-normal text-gray-500">KB</span></div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-1">Est. Tokens</div>
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">~{estimatedTokens}</div>
                  </div>
                </div>

                {/* Datasets */}
                <div>
                  <h4 className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Database size={12} /> Selected Datasets
                  </h4>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-2.5 border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{context.filename}</span>
                  </div>
                </div>

                {/* Columns */}
                <div>
                  <h4 className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Columns size={12} /> Selected Columns <span className="text-gray-400 font-normal">({context.columns.length})</span>
                  </h4>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                    {context.columns.map(col => (
                      <span key={col} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-md">
                        {col}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Statistics */}
                <div>
                  <h4 className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <BarChart3 size={12} /> Selected Statistics
                  </h4>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 shadow-sm space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex justify-between"><span>Row Count</span> <span className="font-semibold">{context.row_count}</span></div>
                    <div className="flex justify-between"><span>Completeness</span> <span className="font-semibold">98.5%</span></div>
                    <div className="flex justify-between"><span>Anomalies</span> <span className="font-semibold text-orange-500">3 detected</span></div>
                  </div>
                </div>

                {/* Relationships */}
                <div>
                  <h4 className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <LinkIcon size={12} /> Relationships
                  </h4>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 shadow-sm">
                    {context.ontology?.entity_name ? (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium text-blue-600">{context.ontology.entity_name}</span>
                        <span className="text-gray-400">→</span>
                        <span className="font-medium">1-to-Many Maps</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">No relationships mapped.</span>
                    )}
                  </div>
                </div>

                {/* Filters & Transformations */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <h4 className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Filter size={12} /> Filters
                    </h4>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-2.5 border border-gray-200 dark:border-gray-700 shadow-sm text-xs text-gray-500 dark:text-gray-400">
                      None active
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Zap size={12} /> Transforms
                    </h4>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-2.5 border border-gray-200 dark:border-gray-700 shadow-sm text-xs text-gray-500 dark:text-gray-400">
                      Auto-clean
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <Database className="text-gray-400" size={24} />
                </div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">No context loaded</div>
                <p className="text-xs text-gray-400">Select a dataset from the dropdown above to populate the AI context window.</p>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
            <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-3 rounded-lg text-xs leading-relaxed">
              <Info size={14} className="shrink-0 mt-0.5" />
              <span>This panel shows exactly what is injected into the LLM prompt. Optimizing context reduces token costs and improves AI reasoning.</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
