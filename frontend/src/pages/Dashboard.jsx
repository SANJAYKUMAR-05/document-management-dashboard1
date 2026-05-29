import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DocumentsTable from '../components/DocumentsTable';
import Loader from '../components/Loader';

export default function Dashboard() {

  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/documents');
      setDocs(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const download = (id) => {
    window.open(`/api/documents/download/${id}`, '_blank');
  };

  const remove = async (id) => {
    await axios.delete(`/api/documents/${id}`);
    setDocs(d => d.filter(x => x.id !== id));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Documents
      </h2>

      {loading ? (
        <Loader />
      ) : (
        <DocumentsTable
          documents={docs}
          onDownload={download}
          onDelete={remove}
        />
      )}
    </div>
  );
}