import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SheetForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [sheetData, setSheetData] = useState([]);

  const fetchData = async () => {
    const res = await axios.get('http://localhost:5000/sheet-data');
    setSheetData(res.data.values);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post('http://localhost:5000/append', {
      values: [formData.name, formData.email],
    });
    fetchData(); // Refresh
  };

  return (
    <div>
      <h2>Google Sheet Entry</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <button type="submit">Add</button>
      </form>

      <h3>Sheet Data:</h3>
      <table border="1">
        <tbody>
          {sheetData.map((row, idx) => (
            <tr key={idx}>
              {row.map((cell, i) => <td key={i}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SheetForm;
