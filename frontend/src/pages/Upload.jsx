import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import UploadZone from '../components/UploadZone';
import UploadProgressCard from '../components/UploadProgressCard';
import { SocketContext } from '../App';
import toast from 'react-hot-toast';

export default function Upload(){
  const [files, setFiles] = useState([]);
  const socket = useContext(SocketContext);

  useEffect(()=>{
    socket.on('upload_progress', (data) => {
      setFiles(prev => prev.map(f => f.id === data.id ? { ...f, progress: data.progress } : f));
    });
    socket.on('upload_started', (data) => {
      setFiles(prev => prev.map(f => f.name === data.name ? { ...f, status: 'uploading' } : f));
    });
    socket.on('upload_completed', (data) => {
      setFiles(prev => prev.map(f => f.name === data.name ? { ...f, status: 'success', progress: 100 } : f));
      toast.success(`${data.name} uploaded`);
    });
    socket.on('upload_failed', (data) => {
      toast.error(`Upload failed: ${data.error}`);
    });
    return () => {
      socket.off('upload_progress');
      socket.off('upload_started');
      socket.off('upload_completed');
      socket.off('upload_failed');
    };
  }, [socket]);

  const handleFiles = (picked) => {
    const additions = [];
    picked.forEach((file) => {
      if (file.type !== 'application/pdf') {
        toast.error(`${file.name} is not a PDF`);
        return;
      }
      if (file.size > 10485760) {
        toast.error(`${file.name} exceeds 10 MB`);
        return;
      }
      additions.push({ id: null, file, name: file.name, size: file.size, type: file.type, progress: 0, status: 'queued' });
    });
    if (additions.length) setFiles(prev => [...prev, ...additions]);
  };

  const uploadAll = async () => {
    if (files.length === 0) return toast.error('No files to upload');

    const form = new FormData();
    files.forEach(f => form.append('files', f.file));

    try {
      await axios.post('/api/documents/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          socket.emit('client_upload_progress', { progress: percent });
        }
      });
      toast.success('Upload request completed');
      setFiles(prev => prev.map(f => ({ ...f, status: 'processing' })));
    } catch (err) {
      const error = err.response?.data?.message || 'Upload failed';
      toast.error(error);
      setFiles(prev => prev.map(f => ({ ...f, status: 'error' })));
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Upload Documents</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <UploadZone onFiles={handleFiles} />
          <div className="mt-4 space-y-3">
            {files.map((f, idx) => (
              <UploadProgressCard key={idx} file={f} />
            ))}
          </div>
          <div className="mt-4">
            <button onClick={uploadAll} className="px-4 py-2 bg-primary-500 text-white rounded">Start Upload</button>
          </div>
        </div>
        <div>
          <div className="bg-white rounded shadow p-4">
            <h3 className="font-semibold mb-2">Queue</h3>
            <div className="text-sm text-gray-600">{files.length} files</div>
          </div>
        </div>
      </div>
    </div>
  );
}
