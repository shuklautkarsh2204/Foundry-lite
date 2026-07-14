import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Download, Share2, FileDown, MoreHorizontal } from 'lucide-react';
import { getSource, getPreview, getMetrics } from '../api/sources';

// Import Tabs
import OverviewTab from './dataset/OverviewTab';
import SchemaTab from './dataset/SchemaTab';
import PreviewTab from './dataset/PreviewTab';
import StatisticsTab from './dataset/StatisticsTab';
import TransformationsTab from './dataset/TransformationsTab';
import RelationshipsTab from './dataset/RelationshipsTab';
import LineageTab from './dataset/LineageTab';
import OntologyTab from './dataset/OntologyTab';
import KnowledgeGraphTab from './dataset/KnowledgeGraphTab';
import AISummaryTab from './dataset/AISummaryTab';
import VersionHistoryTab from './dataset/VersionHistoryTab';
import DataQualityTab from './dataset/DataQualityTab';
import DashboardTab from './dataset/DashboardTab';
import InsightsTab from './dataset/InsightsTab';

const TABS = [
  'Overview',
  'Dashboard',
  'Insights',
  'Schema',
  'Preview',
  'Statistics',
  'Data Quality',
  'Transformations',
  'Relationships',
  'Lineage',
  'Ontology',
  'Knowledge Graph',
  'AI Summary',
  'Version History'
];

export default function DatasetPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('Overview');

  // Fetch core data needed across tabs
  const { data: srcData, isLoading: srcLoading } = useQuery({ queryKey: ['source', id], queryFn: () => getSource(id) });
  const { data: previewData } = useQuery({ queryKey: ['preview', id], queryFn: () => getPreview(id) });
  const { data: metricsData } = useQuery({ queryKey: ['metrics', id], queryFn: () => getMetrics(id) });

  const source = srcData?.data;
  const rows = previewData?.data?.preview || [];
  const columns = source?.columns || [];
  const metrics = metricsData?.data;

  if (srcLoading || !source) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
        Loading dataset information...
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview': return <OverviewTab source={source} metrics={metrics} />;
      case 'Dashboard': return <DashboardTab id={id} />;
      case 'Insights': return <InsightsTab id={id} />;
      case 'Schema': return <SchemaTab id={id} columns={columns} />;
      case 'Preview': return <PreviewTab columns={columns} rows={rows} />;
      case 'Statistics': return <StatisticsTab id={id} />;
      case 'Data Quality': return <DataQualityTab id={id} />;
      case 'Transformations': return <TransformationsTab id={id} columns={columns} />;
      case 'Relationships': return <RelationshipsTab id={id} />;
      case 'Lineage': return <LineageTab id={id} />;
      case 'Ontology': return <OntologyTab id={id} columns={columns} />;
      case 'Knowledge Graph': return <KnowledgeGraphTab id={id} />;
      case 'AI Summary': return <AISummaryTab id={id} />;
      case 'Version History': return <VersionHistoryTab source={source} />;
      default: return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">📄 {source.filename}</h1>
            <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs px-2.5 py-1 rounded-full font-medium">Dataset</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            Dataset ID: {source.id} &bull; {metrics?.row_count ?? source.row_count ?? 0} rows &bull; {columns.length} columns
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">
            <Download size={16} /> Download
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">
            <FileDown size={16} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm border border-transparent">
            <Share2 size={16} /> Share
          </button>
          <button className="flex items-center justify-center p-2 bg-white dark:bg-gray-900 text-gray-500 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* Horizontally Scrollable Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-800 mb-6 -mx-6 px-6 sm:mx-0 sm:px-0">
        <nav className="flex space-x-1 overflow-x-auto no-scrollbar pb-px">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600 dark:text-blue-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content Area */}
      <div className="flex-1 overflow-y-auto pb-8">
        {renderTabContent()}
      </div>
    </div>
  );
}

