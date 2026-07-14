import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Handle,
  Position,
  Panel,
  applyNodeChanges,
  applyEdgeChanges
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Filter, ArrowUpDown, Merge, GitMerge, FileEdit, Calculator, Scissors, Play, Undo, Redo, Trash2, Link as LinkIcon, Database } from 'lucide-react';

const NODE_TYPES_CONFIG = {
  input: { icon: Database, label: 'Input Dataset', color: 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700' },
  filter: { icon: Filter, label: 'Filter', color: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400' },
  sort: { icon: ArrowUpDown, label: 'Sort', color: 'bg-green-50 text-green-600 border-green-200 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400' },
  join: { icon: LinkIcon, label: 'Join', color: 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-400' },
  rename: { icon: FileEdit, label: 'Rename', color: 'bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-400' },
  aggregate: { icon: Merge, label: 'Aggregate', color: 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/30 dark:border-orange-800 dark:text-orange-400' },
  calculate: { icon: Calculator, label: 'Calculate', color: 'bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-900/30 dark:border-pink-800 dark:text-pink-400' },
  split: { icon: Scissors, label: 'Split', color: 'bg-cyan-50 text-cyan-600 border-cyan-200 dark:bg-cyan-900/30 dark:border-cyan-800 dark:text-cyan-400' },
  merge: { icon: GitMerge, label: 'Merge', color: 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-400' }
};

const CustomNode = ({ data, selected }) => {
  const config = NODE_TYPES_CONFIG[data.type];
  if (!config) return null;
  const Icon = config.icon;

  const updateConfig = (key, value) => {
    if (data.onChange) {
      data.onChange(data.id, { ...data.config, [key]: value });
    }
  };

  return (
    <div className={`rounded-xl shadow-md bg-white dark:bg-gray-900 w-[260px] border-2 transition-all ${selected ? 'border-blue-500 ring-4 ring-blue-500/20' : 'border-gray-200 dark:border-gray-700'}`}>
      {data.type !== 'input' && <Handle type="target" position={Position.Top} className="w-3 h-3 bg-gray-400 dark:bg-gray-500 border-2 border-white dark:border-gray-900" />}
      
      <div className={`px-4 py-3 rounded-t-xl border-b border-gray-100 dark:border-gray-800 flex items-center justify-between ${config.color}`}>
        <div className="flex items-center gap-2">
          <Icon size={16} />
          <span className="font-bold text-sm tracking-wide uppercase">{config.label}</span>
        </div>
      </div>
      
      <div className="p-4 bg-white dark:bg-gray-900 rounded-b-xl">
        {data.type === 'input' && (
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">
            {data.filename || 'Raw Dataset'}
          </div>
        )}

        {data.type === 'filter' && (
          <div className="space-y-2.5">
            <select 
              value={data.config?.column || ''} 
              onChange={e => updateConfig('column', e.target.value)}
              className="w-full text-xs p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Column...</option>
              {data.columns?.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select 
              value={data.config?.operator || 'equals'} 
              onChange={e => updateConfig('operator', e.target.value)}
              className="w-full text-xs p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="equals">Equals</option>
              <option value="contains">Contains</option>
              <option value="gt">Greater Than</option>
              <option value="lt">Less Than</option>
            </select>
            <input 
              value={data.config?.value || ''} 
              onChange={e => updateConfig('value', e.target.value)}
              placeholder="Value" 
              className="w-full text-xs p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
        )}

        {data.type === 'sort' && (
          <div className="space-y-2.5">
            <select 
              value={data.config?.column || ''} 
              onChange={e => updateConfig('column', e.target.value)}
              className="w-full text-xs p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Column...</option>
              {data.columns?.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select 
              value={data.config?.direction || 'asc'} 
              onChange={e => updateConfig('direction', e.target.value)}
              className="w-full text-xs p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        )}

        {data.type === 'aggregate' && (
          <div className="space-y-2.5">
            <select 
              value={data.config?.groupCol || ''} 
              onChange={e => updateConfig('groupCol', e.target.value)}
              className="w-full text-xs p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white outline-none"
            >
              <option value="">Group by...</option>
              {data.columns?.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select 
              value={data.config?.aggCol || ''} 
              onChange={e => updateConfig('aggCol', e.target.value)}
              className="w-full text-xs p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white outline-none"
            >
              <option value="">Target column...</option>
              {data.columns?.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select 
              value={data.config?.op || 'sum'} 
              onChange={e => updateConfig('op', e.target.value)}
              className="w-full text-xs p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white outline-none"
            >
              <option value="sum">Sum</option>
              <option value="mean">Average</option>
              <option value="count">Count</option>
              <option value="max">Max</option>
            </select>
          </div>
        )}

        {data.type === 'rename' && (
          <div className="space-y-2.5">
            <select className="w-full text-xs p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white outline-none">
              <option value="">Select Column...</option>
              {data.columns?.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input placeholder="New Name" className="w-full text-xs p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 dark:text-white outline-none" />
          </div>
        )}

        {['join', 'calculate', 'split', 'merge'].includes(data.type) && (
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-4 italic bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
            Configure {config.label}...
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-500 border-2 border-white dark:border-gray-900" />
    </div>
  );
};

const nodeTypes = {
  customNode: CustomNode,
};

let idCounter = 1;

export default function TransformationsTab({ id, columns }) {
  const reactFlowWrapper = useRef(null);
  
  // State History for Undo/Redo
  const [history, setHistory] = useState([
    {
      nodes: [{ id: 'node-0', type: 'customNode', position: { x: 300, y: 50 }, data: { id: 'node-0', type: 'input', filename: `Dataset ${id.slice(0,6)}`, columns } }],
      edges: []
    }
  ]);
  const [pointer, setPointer] = useState(0);

  const [nodes, setNodes] = useState(history[0].nodes);
  const [edges, setEdges] = useState(history[0].edges);
  
  const [previewData, setPreviewData] = useState(null);
  const [isPreviewing, setIsPreviewing] = useState(false);

  // Sync state changes to history
  const pushState = (newNodes, newEdges) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, pointer + 1);
      newHistory.push({ nodes: newNodes, edges: newEdges });
      return newHistory;
    });
    setPointer(p => p + 1);
  };

  const onNodesChange = useCallback(
    (changes) => {
      const newNodes = applyNodeChanges(changes, nodes);
      setNodes(newNodes);
      // Only push state on drag stop, remove, or add to avoid flooding history
      const significantChange = changes.some(c => c.type === 'remove' || c.type === 'add' || (c.type === 'position' && !c.dragging));
      if (significantChange) pushState(newNodes, edges);
    },
    [nodes, edges, pointer]
  );

  const onEdgesChange = useCallback(
    (changes) => {
      const newEdges = applyEdgeChanges(changes, edges);
      setEdges(newEdges);
      const significantChange = changes.some(c => c.type === 'remove' || c.type === 'add');
      if (significantChange) pushState(nodes, newEdges);
    },
    [nodes, edges, pointer]
  );

  const onConnect = useCallback(
    (params) => {
      const newEdges = addEdge(params, edges);
      setEdges(newEdges);
      pushState(nodes, newEdges);
    },
    [nodes, edges, pointer]
  );

  // Undo / Redo
  const undo = () => {
    if (pointer > 0) {
      const prev = history[pointer - 1];
      setNodes(prev.nodes);
      setEdges(prev.edges);
      setPointer(pointer - 1);
    }
  };

  const redo = () => {
    if (pointer < history.length - 1) {
      const next = history[pointer + 1];
      setNodes(next.nodes);
      setEdges(next.edges);
      setPointer(pointer + 1);
    }
  };

  // Node config changes
  const onNodeConfigChange = (nodeId, newConfig) => {
    const newNodes = nodes.map(n => {
      if (n.id === nodeId) {
        return { ...n, data: { ...n.data, config: newConfig } };
      }
      return n;
    });
    setNodes(newNodes);
    pushState(newNodes, edges);
  };

  // Drag and Drop handlers
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left - 100,
        y: event.clientY - reactFlowBounds.top - 20,
      };

      const newNodeId = `node-${idCounter++}`;
      const newNode = {
        id: newNodeId,
        type: 'customNode',
        position,
        data: { id: newNodeId, type, columns, config: {}, onChange: onNodeConfigChange },
      };

      const newNodes = nodes.concat(newNode);
      setNodes(newNodes);
      pushState(newNodes, edges);
    },
    [nodes, edges, pointer, columns]
  );

  // Attach onChange to existing nodes on initial render to prevent undefined
  useEffect(() => {
    setNodes(nds => nds.map(n => ({ ...n, data: { ...n.data, onChange: onNodeConfigChange } })));
  }, []);

  const handlePreview = () => {
    setIsPreviewing(true);
    // Simulate pipeline execution
    setTimeout(() => {
      setPreviewData([
        { id: 1, name: 'Example Row 1', value: 100, status: 'Active' },
        { id: 2, name: 'Example Row 2', value: 250, status: 'Pending' },
        { id: 3, name: 'Example Row 3', value: 300, status: 'Active' },
        { id: 4, name: 'Example Row 4', value: 150, status: 'Closed' }
      ]);
      setIsPreviewing(false);
    }, 1200);
  };

  const handleClear = () => {
    const newNodes = [nodes.find(n => n.data.type === 'input')];
    setNodes(newNodes);
    setEdges([]);
    pushState(newNodes, []);
    setPreviewData(null);
  };

  return (
    <div className="flex h-[75vh] flex-col md:flex-row gap-6 animate-in fade-in duration-500">
      
      {/* Toolbox Sidebar */}
      <div className="w-full md:w-64 shrink-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl flex flex-col overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wider text-xs">Transform Blocks</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Drag blocks onto the canvas.</p>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1 space-y-2">
          {Object.entries(NODE_TYPES_CONFIG).filter(([k]) => k !== 'input').map(([key, config]) => (
            <div 
              key={key}
              onDragStart={(event) => onDragStart(event, key)}
              draggable
              className={`flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md cursor-grab active:cursor-grabbing transition-all hover:-translate-y-0.5 group`}
            >
              <div className={`p-2 rounded-lg ${config.color} group-hover:scale-110 transition-transform`}>
                <config.icon size={16} />
              </div>
              <span className="font-semibold text-sm text-gray-700 dark:text-gray-200">{config.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm relative">
        
        {/* Toolbar */}
        <div className="h-14 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur flex items-center justify-between px-4 absolute top-0 w-full z-10">
          <div className="flex items-center gap-2">
            <button 
              onClick={undo} disabled={pointer === 0}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg disabled:opacity-30 transition-colors" title="Undo"
            >
              <Undo size={18} />
            </button>
            <button 
              onClick={redo} disabled={pointer === history.length - 1}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg disabled:opacity-30 transition-colors" title="Redo"
            >
              <Redo size={18} />
            </button>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2"></div>
            <button onClick={handleClear} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Clear Canvas">
              <Trash2 size={18} />
            </button>
          </div>
          
          <button 
            onClick={handlePreview} disabled={isPreviewing}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700 disabled:opacity-70 shadow-sm transition-all hover:shadow"
          >
            {isPreviewing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Play size={16} />}
            {isPreviewing ? 'Executing...' : 'Run Preview'}
          </button>
        </div>

        {/* Canvas */}
        <div className="flex-1 w-full h-full relative" ref={reactFlowWrapper}>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onDrop={onDrop}
              onDragOver={onDragOver}
              fitView
              className="bg-gray-50 dark:bg-gray-950 pt-14"
            >
              <Background color="#94a3b8" gap={16} size={1} />
              <Controls className="bottom-6 left-4 border-gray-200 dark:border-gray-800 shadow-lg" showInteractive={false} />
            </ReactFlow>
          </ReactFlowProvider>
        </div>

        {/* Preview Panel (Bottom Sheet) */}
        {previewData && (
          <div className="h-64 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 absolute bottom-0 w-full z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col animate-in slide-in-from-bottom-6 duration-300">
            <div className="p-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
              <h3 className="font-bold text-gray-800 dark:text-white text-sm flex items-center gap-2">
                <Play size={14} className="text-blue-500" /> Pipeline Output Preview
              </h3>
              <button onClick={() => setPreviewData(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                &times;
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 text-sm text-left">
                <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 sticky top-0">
                  <tr>
                    {Object.keys(previewData[0]).map(k => <th key={k} className="px-6 py-3 font-semibold uppercase">{k}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
                  {previewData.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      {Object.values(row).map((v, j) => <td key={j} className="px-6 py-3 text-gray-700 dark:text-gray-300">{v}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
