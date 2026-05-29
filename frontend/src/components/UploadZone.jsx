import React, { useRef } from 'react';

export default function UploadZone({ onFiles }){
  const inputRef = useRef();

  const onDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(file => file.type === 'application/pdf');
    onFiles(files);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e)=>e.preventDefault()}
      onDrop={onDrop}
      className="border-dashed border-2 border-gray-200 rounded-md p-6 text-center hover:border-primary-300 transition cursor-pointer"
    >
      <p className="text-gray-600">Drag & drop PDF files here, or click to select</p>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        multiple
        className="sr-only"
        onChange={(e)=>onFiles(Array.from(e.target.files))}
      />
    </div>
  );
}
