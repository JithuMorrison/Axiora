import React, { useState } from 'react';
import { filterMOU, exportToExcel } from '../../utils/excel';
import { toast } from 'react-toastify';

const MOUDownload = () => {
  const [filters, setFilters] = useState({
    academicYear: '',
    instituteName: '',
    facultyName: '',
    duration: ''
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleDownload = () => {
    const filteredData = filterMOU(filters);
    if (filteredData.length === 0) {
      toast.warning('No records match your filters');
      return;
    }
    exportToExcel(filteredData, `MOU_Data_${new Date().toISOString().split('T')[0]}`);
    toast.success('Download started');
  };

  return (
    <div className="mou-download">
      <h2>Download MOU Data</h2>
      <div className="filter-section">
        <div className="form-group">
          <label>Academic Year</label>
          <input
            type="text"
            name="academicYear"
            value={filters.academicYear}
            onChange={handleFilterChange}
          />
        </div>
        <div className="form-group">
          <label>Institute Name</label>
          <input
            type="text"
            name="instituteName"
            value={filters.instituteName}
            onChange={handleFilterChange}
          />
        </div>
        <div className="form-group">
          <label>Faculty Name</label>
          <input
            type="text"
            name="facultyName"
            value={filters.facultyName}
            onChange={handleFilterChange}
          />
        </div>
        <div className="form-group">
          <label>Duration (e.g., "2023")</label>
          <input
            type="text"
            name="duration"
            value={filters.duration}
            onChange={handleFilterChange}
          />
        </div>
        <button onClick={handleDownload} className="download-btn">
          Download Filtered Data
        </button>
      </div>
    </div>
  );
};

export default MOUDownload;