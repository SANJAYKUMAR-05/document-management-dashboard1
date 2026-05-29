import React from 'react';

export default function DocumentsTable({ documents = [], onDownload, onDelete }){
  return (
    <div className="bg-white rounded-md shadow p-4">
      <table className="w-full text-left">
        <thead>
          <tr className="text-sm text-gray-500">
            <th className="py-2">Filename</th>
            <th className="py-2">Size</th>
            <th className="py-2">Uploaded</th>
            <th className="py-2">Status</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map(doc => (
            <tr key={doc.id} className="border-t">
              <td className="py-3">{doc.originalname}</td>
              <td className="py-3">{(doc.filesize/1024).toFixed(2)} KB</td>
              <td className="py-3">{new Date(doc.createdAt).toLocaleString()}</td>
              <td className="py-3">{doc.uploadStatus}</td>
              <td className="py-3">
                <button onClick={()=>onDownload(doc.id)} className="px-3 py-1 bg-primary-500 text-white rounded mr-2">Download</button>
                <button onClick={()=>onDelete(doc.id)} className="px-3 py-1 bg-red-100 text-red-600 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
