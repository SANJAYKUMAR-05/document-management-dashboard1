import React from 'react';

export default function UploadProgressCard({ file }){
  return (
    <div className="border rounded-md p-3 shadow-sm flex items-center gap-4">
      <div className="flex-1">
        <div className="flex justify-between">
          <div className="font-medium">{file.name}</div>
          <div className="text-sm text-gray-500">{Math.round(file.progress || 0)}%</div>
        </div>
        <div className="h-2 bg-gray-200 rounded mt-2 overflow-hidden">
          <div className="h-full bg-primary-500 transition-all" style={{ width: `${file.progress || 0}%` }} />
        </div>
        <div className="text-xs text-gray-500 mt-1">{(file.size/1024).toFixed(2)} KB • {file.type}</div>
      </div>
      <div className="flex items-center justify-center w-10 h-10">
        {file.status === 'uploading' && <div className="w-5 h-5 border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin" />}
        {file.status === 'success' && <div className="text-green-600 text-xl">✓</div>}
        {file.status === 'error' && <div className="text-red-600 text-xl">✕</div>}
      </div>
    </div>
  );
}
