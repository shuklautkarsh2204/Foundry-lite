import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getSources, uploadSource } from '../api/sources';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useState } from 'react';

export default function SourcesPage() {
  const { data, isLoading } = useQuery({ queryKey: ['sources'], queryFn: getSources });
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'text/csv': ['.csv'] },
    onDrop: async ([file]) => {
      setUploading(true); setMsg('');
      try {
        await uploadSource(file);
        await qc.invalidateQueries(['sources']);
        setMsg(`✅ "${file.name}" uploaded successfully!`);
      } catch { setMsg('❌ Upload failed. Make sure backend is running.'); }
      finally { setUploading(false); }
    }
  });

  const sources = data?.data || [];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Datasets</h1>

      {/* Upload Zone */}
      <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer mb-8 transition-all ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}>
        <input {...getInputProps()} />
        <div className="text-4xl mb-3">📁</div>
        {uploading
          ? <p className="text-blue-600 font-medium">Uploading...</p>
          : <p className="text-gray-500">{isDragActive ? 'Drop it here!' : 'Drag & drop a CSV file here, or click to select'}</p>}
        {msg && <p className="mt-3 text-sm font-medium">{msg}</p>}
      </div>

      {/* Dataset List */}
      {isLoading ? <p className="text-gray-400">Loading...</p> : sources.length === 0
        ? <div className="text-center text-gray-400 py-16"><div className="text-5xl mb-4">📭</div><p>No datasets yet. Upload a CSV to get started.</p></div>
        : <div className="grid gap-4">
            {sources.map(s => (
              <div key={s.id} onClick={() => navigate(`/sources/${s.id}`)}
                className="bg-white rounded-xl p-5 shadow hover:shadow-md border border-gray-100 cursor-pointer flex items-center justify-between transition-all hover:-translate-y-0.5">
                <div>
                  <div className="font-semibold text-gray-800 text-lg">📄 {s.filename}</div>
                  <div className="text-sm text-gray-400 mt-1">{s.row_count} rows · Uploaded {new Date(s.uploaded_at).toLocaleDateString()}</div>
                </div>
                <div className="text-blue-500 font-medium text-sm">Explore →</div>
              </div>
            ))}
          </div>}
    </div>
  );
}
