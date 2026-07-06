import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

export const getSources = () => api.get('/sources');
export const uploadSource = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/sources/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getSource = (id) => api.get(`/sources/${id}`);
export const getPreview = (id) => api.get(`/sources/${id}/preview`);
export const getProfile = (id) => api.get(`/sources/${id}/profile`);
export const getQuality = (id) => api.get(`/sources/${id}/quality-report`);
export const getMetrics = (id) => api.get(`/sources/${id}/metrics`);
export const getOntology = (id) => api.post(`/sources/${id}/ontology/generate`);
export const getLineage = (id) => api.get(`/sources/${id}/lineage`);

export const filterRows = (id, column, value) => api.post(`/sources/${id}/filter`, { column, value });
export const sortData = (id, column, ascending) => api.post(`/sources/${id}/sort`, { column, ascending });
export const aggregateData = (id, group_by, target_column, operation) => api.post(`/sources/${id}/aggregate`, { group_by, target_column, operation });
export const selectCols = (id, columns) => api.post(`/sources/${id}/select-columns`, { columns });

export const getGraph = (id) => api.get(`/sources/${id}/graph`);
export const discoverRels = (id1, id2) => api.post('/relationships/discover', { dataset1_id: id1, dataset2_id: id2 });
export const getAIContext = (id) => api.get(`/sources/${id}/ai-context`);
