import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Panel,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toPng } from 'html-to-image';
import { Download, FileText, Eraser, Cog, Merge, Calculator, BarChart3, BrainCircuit } from 'lucide-react';

const iconMap = {
  CSV: FileText,
  Cleaning: Eraser,
  Transformation: Cog,
  Join: Merge,
  Aggregation: Calculator,
  Dashboard: BarChart3,
  AI: BrainCircuit,
};

const CustomNode = ({ data }) => {
  const Icon = iconMap[data.iconName] || FileText;
  return (
    <div className="px-5 py-4 shadow-lg rounded-2xl bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 flex items-center gap-4 w-64 hover:border-blue-500 hover:shadow-blue-500/20 transition-all cursor-pointer group">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-gray-900" />
      <div className={`p-3 rounded-xl ${data.colorClass} group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      <div>
        <div className="font-bold text-gray-900 dark:text-white text-base">{data.label}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{data.description}</div>
      </div>
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-gray-900" />
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

const initialNodes = [
  { id: '1', type: 'custom', position: { x: 0, y: 150 }, data: { label: 'CSV Source', iconName: 'CSV', description: 'Raw Sales Data', colorClass: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' } },
  { id: '2', type: 'custom', position: { x: 320, y: 150 }, data: { label: 'Cleaning', iconName: 'Cleaning', description: 'Remove nulls & dupes', colorClass: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' } },
  { id: '3', type: 'custom', position: { x: 640, y: 150 }, data: { label: 'Transformation', iconName: 'Transformation', description: 'Currency Conversion', colorClass: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' } },
  { id: '4', type: 'custom', position: { x: 960, y: 150 }, data: { label: 'Join', iconName: 'Join', description: 'Join with Customers', colorClass: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' } },
  { id: '5', type: 'custom', position: { x: 1280, y: 150 }, data: { label: 'Aggregation', iconName: 'Aggregation', description: 'Monthly Revenue', colorClass: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' } },
  { id: '6', type: 'custom', position: { x: 1600, y: 50 }, data: { label: 'Dashboard', iconName: 'Dashboard', description: 'Exec BI Report', colorClass: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' } },
  { id: '7', type: 'custom', position: { x: 1600, y: 250 }, data: { label: 'AI Model', iconName: 'AI', description: 'Sales Forecasting', colorClass: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
  { id: 'e2-3', source: '2', target: '3', type: 'smoothstep', animated: true, style: { stroke: '#eab308', strokeWidth: 2 } },
  { id: 'e3-4', source: '3', target: '4', type: 'smoothstep', animated: true, style: { stroke: '#a855f7', strokeWidth: 2 } },
  { id: 'e4-5', source: '4', target: '5', type: 'smoothstep', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
  { id: 'e5-6', source: '5', target: '6', type: 'smoothstep', animated: true, style: { stroke: '#f97316', strokeWidth: 2 } },
  { id: 'e5-7', source: '5', target: '7', type: 'smoothstep', animated: true, style: { stroke: '#f97316', strokeWidth: 2 } },
];

export default function LineageTab({ id }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const flowWrapperRef = useRef(null);

  const onClickNode = useCallback((event, node) => {
    // Basic interaction to show nodes are clickable
    alert(`Clicked on node: ${node.data.label}\n\nDescription: ${node.data.description}`);
  }, []);

  const downloadImage = useCallback(() => {
    if (flowWrapperRef.current === null) return;
    
    // Use html-to-image to generate a PNG of the React Flow wrapper
    toPng(flowWrapperRef.current, {
      backgroundColor: '#ffffff',
      filter: (node) => {
        // Exclude UI controls from screenshot
        if (
          node?.classList?.contains('react-flow__minimap') ||
          node?.classList?.contains('react-flow__controls') ||
          node?.classList?.contains('react-flow__panel')
        ) {
          return false;
        }
        return true;
      },
    }).then((dataUrl) => {
      const a = document.createElement('a');
      a.setAttribute('download', 'dataset-lineage.png');
      a.setAttribute('href', dataUrl);
      a.click();
    });
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white text-xl">Dataset Lineage</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Trace the end-to-end flow of transformations and downstream dependencies.</p>
        </div>
      </div>
      
      <div className="h-[600px] w-full rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm bg-gray-50/50 dark:bg-gray-950/50 relative" ref={flowWrapperRef}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onClickNode}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.2}
          maxZoom={4}
          className="react-flow-container"
        >
          <Background color="#9ca3af" gap={20} size={1} />
          <Controls className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg rounded-xl overflow-hidden [&>button]:border-gray-200 dark:[&>button]:border-gray-700 dark:[&>button]:text-gray-300 dark:[&>button]:bg-gray-800 dark:hover:[&>button]:bg-gray-700" />
          <MiniMap 
            nodeStrokeColor={(n) => {
              if (n.data?.iconName === 'Dashboard') return '#ef4444';
              if (n.data?.iconName === 'AI') return '#6366f1';
              return '#3b82f6';
            }}
            nodeColor={(n) => {
              return '#ffffff';
            }}
            maskColor="rgba(0,0,0,0.1)"
            className="rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700"
          />
          <Panel position="top-right" className="m-4">
            <button
              onClick={downloadImage}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2.5 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <Download size={18} /> Export PNG
            </button>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}
