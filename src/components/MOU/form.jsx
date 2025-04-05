import React, { useState, useEffect } from 'react';
import { addMOU } from '../../utils/excelHandler';
import { showNewMOUNotification } from '../../utils/notifications';
import { toast } from 'react-toastify';

const MOUForm = ({ user }) => {
  const [formData, setFormData] = useState({
    instituteName: '',
    startDate: '',
    endDate: '',
    signedBy: user?.name || '',
    facultyDetails: '',
    academicYear: '',
    purpose: '',
    outcomes: '',
    agreementFile: null,
    createdBy: user?.email || '',
    createdAt: new Date().toISOString()
  });

  useEffect(() => {
    // Check for renewals when component mounts
    const interval = setInterval(() => {
      checkMOURenewals();
    }, 86400000); // Check daily

    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.instituteName || !formData.startDate || !formData.endDate) {
      toast.error('Please fill all required fields');
      return;
    }

    // Add MOU to Excel
    addMOU(formData);
    showNewMOUNotification(formData.instituteName);
    toast.success('MOU added successfully!');
    
    // Reset form
    setFormData({
      instituteName: '',
      startDate: '',
      endDate: '',
      signedBy: user?.name || '',
      facultyDetails: '',
      academicYear: '',
      purpose: '',
      outcomes: '',
      agreementFile: null,
      createdBy: user?.email || '',
      createdAt: new Date().toISOString()
    });
  };

  return (
    <div className="mou-form">
      <h2>Add New MOU</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Industry/Institute Name *</label>
          <input
            type="text"
            name="instituteName"
            value={formData.instituteName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Start Date *</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>End Date *</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Signed By (Faculty Name) *</label>
          <input
            type="text"
            name="signedBy"
            value={formData.signedBy}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Faculty Details</label>
          <textarea
            name="facultyDetails"
            value={formData.facultyDetails}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Academic Year</label>
          <input
            type="text"
            name="academicYear"
            value={formData.academicYear}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Purpose of MOU</label>
          <textarea
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Expected Outcomes</label>
          <textarea
            name="outcomes"
            value={formData.outcomes}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Signed Agreement Document</label>
          <input
            type="file"
            name="agreementFile"
            onChange={handleChange}
            accept=".pdf,.doc,.docx"
          />
        </div>

        <button type="submit" className="submit-btn">Submit MOU</button>
      </form>
    </div>
  );
};

export default MOUForm;