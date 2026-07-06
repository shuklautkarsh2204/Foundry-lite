import { useQuery } from '@tanstack/react-query';
import { getSources } from '../api/sources';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const { data } = useQuery({ queryKey: ['sources'], queryFn: getSources });
  const navigate = useNavigate();
  const count = data?.data?.length || 0;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Foundry Lite</h1>
      <p className="text-gray-500 mb-8">Upload your business data and get AI-powered insights instantly.</p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Datasets Uploaded', value: count, color: 'blue' },
          { label: 'AI Ready', value: 'Yes', color: 'green' },
          { label: 'Cost', value: '₹0', color: 'purple' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`bg-white rounded-xl p-6 shadow border-l-4 border-${color}-500`}>
            <div className="text-2xl font-bold text-gray-800">{value}</div>
            <div className="text-sm text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => navigate('/sources')}
          className="bg-blue-600 text-white rounded-xl p-6 text-left hover:bg-blue-700 transition shadow">
          <div className="text-xl font-bold mb-1">📂 Upload Dataset</div>
          <div className="text-blue-200 text-sm">Upload CSV files and explore your data</div>
        </button>
        <button onClick={() => navigate('/ai')}
          className="bg-purple-600 text-white rounded-xl p-6 text-left hover:bg-purple-700 transition shadow">
          <div className="text-xl font-bold mb-1">🤖 Ask AI</div>
          <div className="text-purple-200 text-sm">Ask questions about your business data</div>
        </button>
        <button onClick={() => navigate('/relationships')}
          className="bg-green-600 text-white rounded-xl p-6 text-left hover:bg-green-700 transition shadow">
          <div className="text-xl font-bold mb-1">🔗 Find Relationships</div>
          <div className="text-green-200 text-sm">Discover connections between datasets</div>
        </button>
        <div className="bg-white rounded-xl p-6 border border-dashed border-gray-300">
          <div className="text-xl font-bold mb-1 text-gray-500">📊 How It Works</div>
          <ol className="text-sm text-gray-400 space-y-1 mt-2">
            <li>1. Upload your CSV files</li>
            <li>2. Explore profiles & quality</li>
            <li>3. Discover relationships</li>
            <li>4. Ask AI questions</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
