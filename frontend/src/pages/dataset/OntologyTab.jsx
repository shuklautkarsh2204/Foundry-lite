import React, { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Database, User, ShoppingCart, FileText, Truck, Users, CreditCard, X, List, BarChart2, Link as LinkIcon, Component } from 'lucide-react';

const iconMap = {
  Customer: User,
  Product: ShoppingCart,
  Invoice: FileText,
  Supplier: Truck,
  Employee: Users,
  Order: Database,
  Payment: CreditCard,
};

const CustomNode = ({ data, selected }) => {
  const Icon = iconMap[data.label] || Component;
  return (
    <div className={`px-4 py-3 shadow-md rounded-2xl bg-white dark:bg-gray-900 border-2 transition-all cursor-pointer flex items-center gap-3 w-48 ${selected ? 'border-blue-500 shadow-blue-500/20 ring-4 ring-blue-500/10' : 'border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700/50'}`}>
      <Handle type="target" position={Position.Top} className="w-0 h-0 border-0 bg-transparent opacity-0" />
      <div className={`p-2.5 rounded-xl ${data.colorClass}`}>
        <Icon size={20} />
      </div>
      <div className="font-bold text-gray-800 dark:text-gray-100 text-sm tracking-wide">{data.label}</div>
      <Handle type="source" position={Position.Bottom} className="w-0 h-0 border-0 bg-transparent opacity-0" />
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

const initialNodes = [
  { id: 'customer', type: 'custom', position: { x: 250, y: 50 }, data: { label: 'Customer', colorClass: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' } },
  { id: 'employee', type: 'custom', position: { x: 550, y: 50 }, data: { label: 'Employee', colorClass: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' } },
  { id: 'order', type: 'custom', position: { x: 400, y: 200 }, data: { label: 'Order', colorClass: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' } },
  { id: 'payment', type: 'custom', position: { x: 100, y: 350 }, data: { label: 'Payment', colorClass: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' } },
  { id: 'invoice', type: 'custom', position: { x: 400, y: 350 }, data: { label: 'Invoice', colorClass: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' } },
  { id: 'product', type: 'custom', position: { x: 700, y: 350 }, data: { label: 'Product', colorClass: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400' } },
  { id: 'supplier', type: 'custom', position: { x: 700, y: 500 }, data: { label: 'Supplier', colorClass: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' } },
];

const initialEdges = [
  { id: 'e-cust-order', source: 'customer', target: 'order', label: 'places', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed }, style: { strokeWidth: 2, stroke: '#9ca3af' } },
  { id: 'e-emp-order', source: 'employee', target: 'order', label: 'processes', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed }, style: { strokeWidth: 2, stroke: '#9ca3af' } },
  { id: 'e-order-payment', source: 'order', target: 'payment', label: 'paid via', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed }, style: { strokeWidth: 2, stroke: '#9ca3af' } },
  { id: 'e-order-invoice', source: 'order', target: 'invoice', label: 'generates', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed }, style: { strokeWidth: 2, stroke: '#9ca3af' } },
  { id: 'e-order-product', source: 'order', target: 'product', label: 'contains', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed }, style: { strokeWidth: 2, stroke: '#9ca3af' } },
  { id: 'e-supp-product', source: 'supplier', target: 'product', label: 'supplies', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed }, style: { strokeWidth: 2, stroke: '#9ca3af' } },
];

const mockEntityData = {
  Customer: {
    properties: [{ name: 'customer_id', type: 'UUID' }, { name: 'email', type: 'VARCHAR' }, { name: 'created_at', type: 'TIMESTAMP' }, { name: 'status', type: 'ENUM' }],
    stats: { rows: '124,592', nullRate: '0.4%', size: '15 MB' },
    connected: ['Order']
  },
  Employee: {
    properties: [{ name: 'employee_id', type: 'UUID' }, { name: 'name', type: 'VARCHAR' }, { name: 'role', type: 'VARCHAR' }],
    stats: { rows: '450', nullRate: '0.0%', size: '1.2 MB' },
    connected: ['Order']
  },
  Order: {
    properties: [{ name: 'order_id', type: 'UUID' }, { name: 'customer_id', type: 'UUID' }, { name: 'employee_id', type: 'UUID' }, { name: 'total_amount', type: 'DECIMAL' }, { name: 'date', type: 'TIMESTAMP' }],
    stats: { rows: '1,542,109', nullRate: '0.0%', size: '240 MB' },
    connected: ['Customer', 'Employee', 'Payment', 'Invoice', 'Product']
  },
  Payment: {
    properties: [{ name: 'payment_id', type: 'UUID' }, { name: 'order_id', type: 'UUID' }, { name: 'amount', type: 'DECIMAL' }, { name: 'method', type: 'VARCHAR' }],
    stats: { rows: '1,500,020', nullRate: '0.1%', size: '180 MB' },
    connected: ['Order']
  },
  Invoice: {
    properties: [{ name: 'invoice_id', type: 'UUID' }, { name: 'order_id', type: 'UUID' }, { name: 'pdf_url', type: 'VARCHAR' }, { name: 'issued_at', type: 'TIMESTAMP' }],
    stats: { rows: '1,542,109', nullRate: '0.5%', size: '450 MB' },
    connected: ['Order']
  },
  Product: {
    properties: [{ name: 'product_id', type: 'UUID' }, { name: 'supplier_id', type: 'UUID' }, { name: 'name', type: 'VARCHAR' }, { name: 'price', type: 'DECIMAL' }, { name: 'stock', type: 'INT' }],
    stats: { rows: '15,200', nullRate: '2.4%', size: '8 MB' },
    connected: ['Order', 'Supplier']
  },
  Supplier: {
    properties: [{ name: 'supplier_id', type: 'UUID' }, { name: 'company_name', type: 'VARCHAR' }, { name: 'contact_email', type: 'VARCHAR' }],
    stats: { rows: '340', nullRate: '0.0%', size: '1 MB' },
    connected: ['Product']
  }
};

export default function OntologyTab({ id }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const activeData = selectedNode ? mockEntityData[selectedNode.data.label] : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white text-xl">Ontology Viewer</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Explore the business entities mapped across your organization's data.</p>
        </div>
      </div>
      
      <div className="h-[650px] w-full rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm bg-gray-50/50 dark:bg-gray-950/50 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
        >
          <Background color="#9ca3af" gap={24} size={1} />
          <Controls className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg rounded-xl overflow-hidden [&>button]:border-gray-200 dark:[&>button]:border-gray-700 dark:[&>button]:text-gray-300 dark:[&>button]:bg-gray-800 dark:hover:[&>button]:bg-gray-700" />
        </ReactFlow>

        {/* Sliding Side Panel */}
        <div 
          className={`absolute top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-2xl transition-transform duration-300 ease-out z-10 flex flex-col ${
            selectedNode ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {activeData && selectedNode && (
            <>
              {/* Panel Header */}
              <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${selectedNode.data.colorClass}`}>
                    {React.createElement(iconMap[selectedNode.data.label] || Component, { size: 18 })}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">{selectedNode.data.label}</h3>
                </div>
                <button onClick={onPaneClick} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Panel Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-8">
                
                {/* Properties */}
                <section>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">
                    <List size={16} className="text-blue-500" /> Properties
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                    {activeData.properties.map((prop, i) => (
                      <div key={i} className="flex justify-between items-center p-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{prop.name}</span>
                        <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded font-mono">
                          {prop.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Statistics */}
                <section>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">
                    <BarChart2 size={16} className="text-purple-500" /> Statistics
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-purple-50 dark:bg-purple-900/10 rounded-xl p-3 border border-purple-100 dark:border-purple-900/30">
                      <div className="text-xs text-purple-600 dark:text-purple-400 mb-1">Total Rows</div>
                      <div className="font-bold text-gray-900 dark:text-white">{activeData.stats.rows}</div>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl p-3 border border-emerald-100 dark:border-emerald-900/30">
                      <div className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">Null Rate</div>
                      <div className="font-bold text-gray-900 dark:text-white">{activeData.stats.nullRate}</div>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/10 rounded-xl p-3 border border-orange-100 dark:border-orange-900/30 col-span-2">
                      <div className="text-xs text-orange-600 dark:text-orange-400 mb-1">Total Size</div>
                      <div className="font-bold text-gray-900 dark:text-white">{activeData.stats.size}</div>
                    </div>
                  </div>
                </section>

                {/* Connected Entities */}
                <section>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">
                    <LinkIcon size={16} className="text-green-500" /> Connected Entities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeData.connected.map((ent, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm px-3 py-1.5 rounded-lg font-medium shadow-sm">
                        {React.createElement(iconMap[ent] || Component, { size: 14, className: 'text-gray-400' })}
                        {ent}
                      </span>
                    ))}
                  </div>
                </section>

              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
