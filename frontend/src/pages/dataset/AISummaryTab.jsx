import { useQuery } from '@tanstack/react-query';
import { getAIContext } from '../../api/sources';

export default function AISummaryTab({ id }) {
  const { data: aiData, isLoading } = useQuery({ 
    queryKey: ['ai-context', id], 
    queryFn: () => getAIContext(id) 
  });
  
  const context = aiData?.data;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow border border-gray-100 dark:border-gray-800">
      <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-6 text-lg flex items-center gap-2">
        <span className="text-xl">🤖</span> AI Generated Context
      </h3>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
        </div>
      ) : !context ? (
        <div className="text-gray-500 dark:text-gray-400 py-4">No AI context available for this dataset.</div>
      ) : (
        <div className="prose dark:prose-invert max-w-none text-sm text-gray-700 dark:text-gray-300">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-100 dark:border-blue-900/50 mb-6">
            <h4 className="text-blue-800 dark:text-blue-300 font-semibold mb-2">Automated Insights</h4>
            <p className="leading-relaxed">
              {context.summary || "This dataset has been analyzed by GraphForge AI. It contains structural and statistical information that suggests it is used for business intelligence."}
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-800">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Suggested Use Cases</h4>
            <ul className="list-disc pl-5 space-y-2">
              {context.use_cases ? context.use_cases.map((uc, i) => <li key={i}>{uc}</li>) : (
                <>
                  <li>Data visualization and reporting dashboard integration</li>
                  <li>Machine learning model training for predictive analytics</li>
                  <li>Cross-referencing with master data systems</li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
