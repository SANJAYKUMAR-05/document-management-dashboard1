import React from 'react';

export default function UploadProgressCard({ file }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-md bg-white flex items-center gap-4 hover:shadow-lg transition-shadow">
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <div className="font-semibold text-gray-800">
            {file.name}
          </div>
          <div className="text-sm font-medium text-blue-700">
            {Math.round(file.progress || 0)}%
          </div>
        </div>

        <div className="h-3 bg-gray-200 rounded-full mt-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-700 transition-all duration-300"
            style={{ width: `${file.progress || 0}%` }}
          />
        </div>

        <div className="text-xs text-gray-500 mt-2">
          {(file.size / 1024).toFixed(2)} KB • {file.type}
        </div>
      </div>

      <div className="flex items-center justify-center w-10 h-10">
        {file.status === 'uploading' && (
          <div className="w-6 h-6 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin" />
        )}

        {file.status === 'success' && (
          <div className="text-blue-600 text-2xl font-bold">✓</div>
        )}

        {file.status === 'error' && (
          <div className="text-red-600 text-2xl font-bold">✕</div>
        )}
      </div>
    </div>
  );
}