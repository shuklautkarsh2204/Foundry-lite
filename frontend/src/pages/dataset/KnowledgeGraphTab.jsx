import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import { Search, ZoomIn, ZoomOut, Maximize, FoldVertical, UnfoldVertical, Filter } from 'lucide-react';
import cytoscape from 'cytoscape';

const initialElements = [
  // Compound Nodes (Group by type)
  { data: { id: 'Customers', label: 'Customers', type: 'group' } },
  { data: { id: 'Orders', label: 'Orders', type: 'group' } },
  { data: { id: 'Products', label: 'Products', type: 'group' } },

  // Nodes (Instances)
  { data: { id: 'c1', label: 'Alice', entityType: 'Customer', parent: 'Customers' } },
  { data: { id: 'c2', label: 'Bob', entityType: 'Customer', parent: 'Customers' } },
  { data: { id: 'c3', label: 'Charlie', entityType: 'Customer', parent: 'Customers' } },

  { data: { id: 'o1', label: 'Order #101', entityType: 'Order', parent: 'Orders' } },
  { data: { id: 'o2', label: 'Order #102', entityType: 'Order', parent: 'Orders' } },
  { data: { id: 'o3', label: 'Order #103', entityType: 'Order', parent: 'Orders' } },
  
  { data: { id: 'p1', label: 'Laptop', entityType: 'Product', parent: 'Products' } },
  { data: { id: 'p2', label: 'Smartphone', entityType: 'Product', parent: 'Products' } },
  { data: { id: 'p3', label: 'Headphones', entityType: 'Product', parent: 'Products' } },

  // Edges
  { data: { id: 'e1', source: 'c1', target: 'o1', label: 'placed' } },
  { data: { id: 'e2', source: 'c2', target: 'o2', label: 'placed' } },
  { data: { id: 'e3', source: 'c3', target: 'o3', label: 'placed' } },
  
  { data: { id: 'e4', source: 'o1', target: 'p1', label: 'contains' } },
  { data: { id: 'e5', source: 'o2', target: 'p2', label: 'contains' } },
  { data: { id: 'e6', source: 'o3', target: 'p1', label: 'contains' } },
  { data: { id: 'e7', source: 'o1', target: 'p3', label: 'contains' } },
];

const stylesheet = [
  {
    selector: 'node',
    style: {
      'label': 'data(label)',
      'text-valign': 'center',
      'text-halign': 'center',
      'color': '#ffffff',
      'font-size': '11px',
      'font-weight': 'bold',
      'text-outline-width': 2,
      'text-outline-color': '#475569',
      'background-color': '#94a3b8',
      'transition-property': 'background-color, opacity, border-width, border-color, width, height',
      'transition-duration': '0.3s',
      'width': '40px',
      'height': '40px',
    }
  },
  {
    selector: ':parent',
    style: {
      'background-opacity': 0.05,
      'background-color': '#cbd5e1',
      'border-width': 2,
      'border-color': '#94a3b8',
      'border-style': 'dashed',
      'text-valign': 'top',
      'text-halign': 'center',
      'color': '#475569',
      'font-size': '14px',
      'font-weight': 'bold',
      'text-outline-width': 0,
      'padding': '15px'
    }
  },
  // Color by Entity
  { selector: 'node[entityType = "Customer"]', style: { 'background-color': '#3b82f6', 'text-outline-color': '#1d4ed8' } },
  { selector: 'node[entityType = "Order"]', style: { 'background-color': '#10b981', 'text-outline-color': '#047857' } },
  { selector: 'node[entityType = "Product"]', style: { 'background-color': '#8b5cf6', 'text-outline-color': '#5b21b6' } },
  
  // Highlight states
  {
    selector: 'node.highlighted',
    style: {
      'border-width': 4,
      'border-color': '#fbbf24',
      'background-color': '#fbbf24',
      'text-outline-color': '#d97706',
    }
  },
  {
    selector: 'node.dimmed',
    style: { 'opacity': 0.15 }
  },
  {
    selector: 'edge',
    style: {
      'width': 2,
      'line-color': '#cbd5e1',
      'target-arrow-color': '#cbd5e1',
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier',
      'label': 'data(label)',
      'font-size': '10px',
      'color': '#64748b',
      'text-background-opacity': 1,
      'text-background-color': '#ffffff',
      'text-background-padding': 2,
      'text-border-opacity': 1,
      'text-border-width': 1,
      'text-border-color': '#e2e8f0',
      'transition-property': 'line-color, target-arrow-color, opacity, width',
      'transition-duration': '0.3s'
    }
  },
  {
    selector: 'edge.highlighted',
    style: {
      'width': 4,
      'line-color': '#fbbf24',
      'target-arrow-color': '#fbbf24',
      'z-index': 10
    }
  },
  {
    selector: 'edge.dimmed',
    style: { 'opacity': 0.15 }
  },
  // Collapse state for compound nodes
  {
    selector: 'node.collapsed',
    style: {
      'shape': 'hexagon',
      'width': '65px',
      'height': '65px',
      'background-color': '#64748b',
      'border-width': 3,
      'border-color': '#334155',
      'border-style': 'solid',
      'background-opacity': 1,
      'text-outline-width': 2,
      'text-outline-color': '#334155',
      'color': '#ffffff',
      'font-size': '14px',
      'text-valign': 'center',
    }
  }
];

export default function KnowledgeGraphTab({ id }) {
  const [search, setSearch] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState(new Set());
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const cyRef = useRef(null);

  // Derive active elements based on collapse state
  const displayElements = useMemo(() => {
    let display = [];
    const hiddenChildren = new Set();
    
    // Find hidden children
    initialElements.forEach(el => {
      if (el.data.parent && collapsedGroups.has(el.data.parent)) {
        hiddenChildren.add(el.data.id);
      }
    });

    initialElements.forEach(el => {
      // If it's a hidden child, exclude it
      if (hiddenChildren.has(el.data.id)) return;

      // If it's an edge connected to a hidden child, remap it to the parent group
      if (el.data.source || el.data.target) {
        let src = el.data.source;
        let tgt = el.data.target;
        
        const srcNode = initialElements.find(n => n.data.id === src);
        const tgtNode = initialElements.find(n => n.data.id === tgt);
        
        if (srcNode && hiddenChildren.has(src)) src = srcNode.data.parent;
        if (tgtNode && hiddenChildren.has(tgt)) tgt = tgtNode.data.parent;
        
        // Avoid self-loops
        if (src === tgt) return;
        
        display.push({ data: { ...el.data, source: src, target: tgt, id: `${src}-${tgt}-${el.data.label}` } });
      } else {
        let newEl = { ...el, classes: '' };
        if (collapsedGroups.has(el.data.id)) {
          newEl.classes = 'collapsed';
          newEl.data = { ...newEl.data, label: `${el.data.label} (Group)` };
        }
        display.push(newEl);
      }
    });

    // Deduplicate edges
    const uniqueEdges = [];
    const edgeSet = new Set();
    display.forEach(el => {
      if (el.data.source) {
        const key = `${el.data.source}-${el.data.target}-${el.data.label}`;
        if (!edgeSet.has(key)) {
          edgeSet.add(key);
          uniqueEdges.push(el);
        }
      } else {
        uniqueEdges.push(el);
      }
    });

    return uniqueEdges;
  }, [collapsedGroups]);

  // Handle Search and Highlight
  useEffect(() => {
    if (!cyRef.current) return;
    const cy = cyRef.current;

    cy.batch(() => {
      if (!search.trim()) {
        cy.elements().removeClass('highlighted dimmed');
      } else {
        const query = search.toLowerCase();
        const matches = cy.nodes().filter(n => n.data('label')?.toLowerCase().includes(query));
        
        if (matches.length > 0) {
          cy.elements().addClass('dimmed');
          matches.removeClass('dimmed').addClass('highlighted');
          matches.connectedEdges().removeClass('dimmed').addClass('highlighted');
        } else {
          cy.elements().removeClass('highlighted dimmed');
        }
      }
    });
  }, [search]);

  // Initialization & Event Listeners
  const onCyInit = useCallback((cy) => {
    cyRef.current = cy;
    
    // Custom Highlight neighbors on tap
    cy.on('tap', 'node', (e) => {
      const node = e.target;
      setSelectedNodeId(node.id());
      
      cy.batch(() => {
        cy.elements().removeClass('highlighted').addClass('dimmed');
        node.removeClass('dimmed').addClass('highlighted');
        node.neighborhood().removeClass('dimmed').addClass('highlighted');
      });
    });

    cy.on('tap', (e) => {
      if (e.target === cy) {
        setSelectedNodeId(null);
        cy.elements().removeClass('highlighted dimmed');
      }
    });

    // Layout configuration
    cy.layout({
      name: 'cose',
      idealEdgeLength: 100,
      nodeOverlap: 20,
      refresh: 20,
      fit: true,
      padding: 30,
      randomize: false,
      componentSpacing: 100,
      nodeRepulsion: 400000,
      edgeElasticity: 100,
      nestingFactor: 5,
      gravity: 80,
      numIter: 1000,
    }).run();

  }, []);

  // Controls
  const handleZoomIn = () => cyRef.current?.zoom(cyRef.current.zoom() * 1.2);
  const handleZoomOut = () => cyRef.current?.zoom(cyRef.current.zoom() * 0.8);
  const handleFit = () => cyRef.current?.fit(null, 50);

  const toggleCollapse = () => {
    if (!selectedNodeId) return;
    
    // Check if the selected node is a group node (either collapsed or expanded)
    const isGroup = initialElements.find(el => el.data.id === selectedNodeId && el.data.type === 'group');
    if (!isGroup) return;

    setCollapsedGroups(prev => {
      const next = new Set(prev);
      if (next.has(selectedNodeId)) next.delete(selectedNodeId);
      else next.add(selectedNodeId);
      return next;
    });
  };

  const selectedIsGroup = useMemo(() => {
    return initialElements.some(el => el.data.id === selectedNodeId && el.data.type === 'group');
  }, [selectedNodeId]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white text-xl">Knowledge Graph</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Interactive Cytoscape visualization grouped by entity types.
          </p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search nodes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-200 shadow-sm w-64"
          />
        </div>
      </div>
      
      <div className="h-[600px] w-full rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm relative bg-gray-50/30 dark:bg-gray-950/30">
        
        {/* Floating Controls */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
            <button onClick={handleZoomIn} className="p-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 transition-colors" title="Zoom In"><ZoomIn size={18} /></button>
            <button onClick={handleZoomOut} className="p-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 transition-colors" title="Zoom Out"><ZoomOut size={18} /></button>
            <button onClick={handleFit} className="p-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Fit to screen"><Maximize size={18} /></button>
          </div>

          {selectedIsGroup && (
            <button
              onClick={toggleCollapse}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
              title="Toggle Collapse"
            >
              {collapsedGroups.has(selectedNodeId) ? <UnfoldVertical size={18} className="text-blue-500" /> : <FoldVertical size={18} className="text-blue-500" />}
            </button>
          )}
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 text-xs">
          <div className="font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Color by Entity</div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span> <span className="text-gray-600 dark:text-gray-400">Customer</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> <span className="text-gray-600 dark:text-gray-400">Order</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-purple-500"></span> <span className="text-gray-600 dark:text-gray-400">Product</span></div>
          </div>
        </div>

        <CytoscapeComponent 
          elements={displayElements} 
          stylesheet={stylesheet}
          style={{ width: '100%', height: '100%' }}
          cy={onCyInit}
          wheelSensitivity={0.1}
        />
      </div>
    </div>
  );
}
