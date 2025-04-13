import React, { useState } from 'react';
import axios from 'axios';

const PdfManager = () => {
  const [file, setFile] = useState(null);
  const [docName, setDocName] = useState('');
  const [downloadName, setDownloadName] = useState('');

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleNameChange = (e) => setDocName(e.target.value);
  const handleDownloadNameChange = (e) => setDownloadName(e.target.value);

  const handleUpload = async () => {
    if (!file || !docName) {
      alert('Please select a PDF and enter a name');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', docName);

    try {
      const res = await axios.post('http://localhost:5000/upload-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(`✅ Uploaded: ${res.data.name}`);
    } catch (err) {
      console.error(err);
      alert('❌ Upload failed');
    }
  };

  const handleDownload = async () => {
    if (!downloadName) {
      alert('Please enter a document name to download');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/get-pdf/${downloadName}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', downloadName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert('❌ Download failed');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>📤 Upload PDF to Google Drive</h2>
      <input
        type="text"
        placeholder="Document Name"
        value={docName}
        onChange={handleNameChange}
      />
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      <hr />

      <h2>📥 Download PDF from Google Drive</h2>
      <input
        type="text"
        placeholder="Document Name to Download"
        value={downloadName}
        onChange={handleDownloadNameChange}
      />
      <button onClick={handleDownload}>Download</button>
    </div>
  );
};

export default PdfManager;
