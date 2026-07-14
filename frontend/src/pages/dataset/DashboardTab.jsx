import React, { useState, useRef, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { toPng } from 'html-to-image';
import { Download, Save, Edit3, LayoutDashboard, Type, Image as ImageIcon, BarChart3, Filter, Plus, X, Trash2, Check, TrendingUp, Grid, FileText, Table } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Treemap, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ResponsiveGridLayout = WidthProvider(Responsive);

// --- MOCK DATA ---
const salesTrendData = [
  { name: 'Jan', sales: 4000, orders: 2400 },
  { name: 'Feb', sales: 3000, orders: 1398 },
  { name: 'Mar', sales: 5000, orders: 3800 },
  { name: 'Apr', sales: 4500, orders: 3908 },
  { name: 'May', sales: 6000, orders: 4800 },
  { name: 'Jun', sales: 5500, orders: 3800 },
  { name: 'Jul', sales: 7000, orders: 4300 },
];

const topCustomersData = [
  { name: 'Acme Corp', amount: 120000 },
  { name: 'Globex Inc', amount: 95000 },
  { name: 'Soylent Ltd', amount: 84000 },
  { name: 'Initech', amount: 72000 },
  { name: 'Umbrella', amount: 65000 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const DEFAULT_WIDGETS = [
  { i: 'kpi-1', x: 0, y: 0, w: 3, h: 3, type: 'kpi', title: 'Total Revenue', value: '$2.4M', isUp: true, change: '+12.5%' },
  { i: 'kpi-2', x: 3, y: 0, w: 3, h: 3, type: 'kpi', title: 'Total Orders', value: '15,234', isUp: true, change: '+8.2%' },
  { i: 'kpi-3', x: 6, y: 0, w: 3, h: 3, type: 'kpi', title: 'Customers', value: '4,892', isUp: true, change: '+5.1%' },
  { i: 'kpi-4', x: 9, y: 0, w: 3, h: 3, type: 'kpi', title: 'Monthly Growth', value: '18.4%', isUp: false, change: '-2.1%' },
  { i: 'chart-1', x: 0, y: 3, w: 8, h: 9, type: 'chart', subType: 'area', title: 'Sales Trend' },
  { i: 'chart-2', x: 8, y: 3, w: 4, h: 9, type: 'chart', subType: 'pie', title: 'Top Customers' },
];

const WidgetContainer = ({ widget, isEditMode, onRemove, children }) => (
  <div className="w-full h-full bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden relative group">
    {isEditMode && (
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onMouseDown={(e) => e.stopPropagation()} onClick={() => onRemove(widget.i)} className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
          <Trash2 size={14} />
        </button>
      </div>
    )}
    {widget.title && (
      <div className={`px-4 pt-4 pb-2 font-bold text-gray-800 dark:text-gray-100 text-sm tracking-wide ${isEditMode ? 'cursor-move' : ''} drag-handle`}>
        {widget.title}
      </div>
    )}
    <div className={`flex-1 p-4 ${!widget.title ? 'pt-4' : 'pt-0'} overflow-hidden`}>
      {children}
    </div>
  </div>
);

export default function DashboardTab({ id }) {
  const [widgets, setWidgets] = useState(DEFAULT_WIDGETS);
  const [isEditMode, setIsEditMode] = useState(false);
  const dashboardRef = useRef(null);

  // Load saved layout on mount
  useEffect(() => {
    const saved = localStorage.getItem(`dashboard-${id}`);
    if (saved) {
      try {
        setWidgets(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load dashboard layout");
      }
    }
  }, [id]);

  const saveLayout = () => {
    localStorage.setItem(`dashboard-${id}`, JSON.stringify(widgets));
    setIsEditMode(false);
  };

  const exportImage = async () => {
    if (dashboardRef.current) {
      try {
        const dataUrl = await toPng(dashboardRef.current, { backgroundColor: '#f8fafc' });
        const link = document.createElement('a');
        link.download = `dashboard-${id}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Failed to export image', err);
      }
    }
  };

  const handleLayoutChange = (layout) => {
    if (!isEditMode) return;
    setWidgets(prev => prev.map(w => {
      const item = layout.find(l => l.i === w.i);
      return item ? { ...w, x: item.x, y: item.y, w: item.w, h: item.h } : w;
    }));
  };

  const addWidget = (type) => {
    const newId = `widget-${Date.now()}`;
    const base = { i: newId, x: 0, y: Infinity };
    let newWidget;
    
    switch(type) {
      case 'kpi': newWidget = { ...base, w: 3, h: 3, type: 'kpi', title: 'New KPI', value: '1,000' }; break;
      case 'chart-bar': newWidget = { ...base, w: 6, h: 8, type: 'chart', subType: 'bar', title: 'New Bar Chart' }; break;
      case 'chart-line': newWidget = { ...base, w: 6, h: 8, type: 'chart', subType: 'line', title: 'New Line Chart' }; break;
      case 'table': newWidget = { ...base, w: 6, h: 8, type: 'table', title: 'Data Table' }; break;
      case 'text': newWidget = { ...base, w: 4, h: 4, type: 'text', title: 'Text Block', text: 'Enter text here...' }; break;
      case 'image': newWidget = { ...base, w: 4, h: 6, type: 'image', title: 'Image' }; break;
      case 'filter': newWidget = { ...base, w: 3, h: 2, type: 'filter', title: 'Filter Control' }; break;
      default: return;
    }
    
    setWidgets([...widgets, newWidget]);
  };

  const removeWidget = (i) => {
    setWidgets(widgets.filter(w => w.i !== i));
  };

  const renderWidgetContent = (widget) => {
    switch (widget.type) {
      case 'kpi':
        return (
          <div className="flex flex-col justify-center h-full">
            <h4 className="text-3xl font-extrabold text-gray-900 dark:text-white">{widget.value}</h4>
            {widget.change && (
              <div className={`flex items-center gap-1 mt-2 text-sm font-bold ${widget.isUp !== false ? 'text-green-500' : 'text-red-500'}`}>
                <TrendingUp size={16} className={widget.isUp === false ? 'rotate-180' : ''} />
                {widget.change}
              </div>
            )}
          </div>
        );
      case 'chart':
        return (
          <ResponsiveContainer width="100%" height="100%">
            {widget.subType === 'area' ? (
              <AreaChart data={salesTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#6b7280'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#6b7280'}} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#1f2937', color: '#fff' }} />
                <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} fill="url(#colorSales)" />
              </AreaChart>
            ) : widget.subType === 'pie' ? (
              <PieChart>
                <Pie data={topCustomersData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={5} dataKey="amount" stroke="none">
                  {topCustomersData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => `$${(v/1000).toFixed(0)}k`} contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#1f2937', color: '#fff' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            ) : widget.subType === 'bar' ? (
              <BarChart data={salesTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#6b7280'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#6b7280'}} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#1f2937', color: '#fff' }} />
                <Bar dataKey="sales" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={salesTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#6b7280'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#6b7280'}} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#1f2937', color: '#fff' }} />
                <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={3} dot={{r:4}} />
              </LineChart>
            )}
          </ResponsiveContainer>
        );
      case 'table':
        return (
          <div className="overflow-auto h-full text-sm">
            <table className="w-full text-left border-collapse">
              <thead><tr className="border-b border-gray-200 dark:border-gray-800 text-gray-500"><th className="pb-2 font-semibold">Month</th><th className="pb-2 font-semibold text-right">Sales</th></tr></thead>
              <tbody>
                {salesTrendData.map((row, i) => (
                  <tr key={i} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-2 text-gray-700 dark:text-gray-300">{row.name}</td>
                    <td className="py-2 text-right font-medium text-gray-900 dark:text-gray-100">${row.sales.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'text':
        return <div className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-wrap leading-relaxed">{widget.text || 'Write your analysis here...'}</div>;
      case 'image':
        return <div className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700"><ImageIcon className="text-gray-400" size={32} /></div>;
      case 'filter':
        return (
          <div className="flex flex-col gap-2">
            <select className="w-full text-sm p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Regions</option>
              <option>North America</option>
              <option>Europe</option>
            </select>
          </div>
        );
      default:
        return <div>Unknown Widget</div>;
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 pb-12">
      
      {/* Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <LayoutDashboard className="text-blue-500" /> Dashboard Builder
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Drag, drop, and resize widgets to create your custom view.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={exportImage} className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm">
            <Download size={16} /> Export PNG
          </button>
          
          {isEditMode ? (
            <button onClick={saveLayout} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm">
              <Check size={16} /> Save Layout
            </button>
          ) : (
            <button onClick={() => setIsEditMode(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm">
              <Edit3 size={16} /> Edit Dashboard
            </button>
          )}
        </div>
      </div>

      {/* Widget Palette (Edit Mode Only) */}
      {isEditMode && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 mb-6 shadow-sm flex flex-wrap gap-3 animate-in slide-in-from-top-4">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center mr-2">Add Widget</span>
          <button onClick={() => addWidget('kpi')} className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 hover:text-blue-600 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            <TrendingUp size={14} /> KPI Card
          </button>
          <button onClick={() => addWidget('chart-bar')} className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 hover:text-blue-600 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            <BarChart3 size={14} /> Bar Chart
          </button>
          <button onClick={() => addWidget('chart-line')} className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 hover:text-blue-600 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            <TrendingUp size={14} /> Line Chart
          </button>
          <button onClick={() => addWidget('table')} className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 hover:text-blue-600 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            <Table size={14} /> Table
          </button>
          <button onClick={() => addWidget('text')} className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 hover:text-blue-600 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            <Type size={14} /> Text
          </button>
          <button onClick={() => addWidget('image')} className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 hover:text-blue-600 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            <ImageIcon size={14} /> Image
          </button>
          <button onClick={() => addWidget('filter')} className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 hover:text-blue-600 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            <Filter size={14} /> Filter
          </button>
        </div>
      )}

      {/* Grid Canvas */}
      <div 
        ref={dashboardRef} 
        className={`flex-1 rounded-2xl ${isEditMode ? 'bg-gray-100/50 dark:bg-gray-950 p-2 border-2 border-dashed border-gray-300 dark:border-gray-700' : ''}`}
      >
        <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: widgets }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={40}
          onLayoutChange={handleLayoutChange}
          isDraggable={isEditMode}
          isResizable={isEditMode}
          draggableHandle=".drag-handle"
          margin={[16, 16]}
        >
          {widgets.map(w => (
            <div key={w.i} data-grid={{ x: w.x, y: w.y, w: w.w, h: w.h, minW: 2, minH: 2 }}>
              <WidgetContainer widget={w} isEditMode={isEditMode} onRemove={removeWidget}>
                {renderWidgetContent(w)}
              </WidgetContainer>
            </div>
          ))}
        </ResponsiveGridLayout>
      </div>

    </div>
  );
}
