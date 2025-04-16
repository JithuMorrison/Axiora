// EmailForm.js (Frontend - React)
import React, { useState } from 'react';
import axios from 'axios';

const EmailForm = () => {
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    text: '',
  });
  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e) => {
    setEmailData({
      ...emailData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/send-email', emailData);
      setResponseMessage(response.data.message);
    } catch (error) {
      setResponseMessage('Error sending email');
    }
  };

  return (
    <div>
      <h2>Send Email</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="to"
          value={emailData.to}
          onChange={handleChange}
          placeholder="Recipient Email"
          required
        />
        <input
          type="text"
          name="subject"
          value={emailData.subject}
          onChange={handleChange}
          placeholder="Subject"
          required
        />
        <textarea
          name="text"
          value={emailData.text}
          onChange={handleChange}
          placeholder="Message"
          required
        />
        <button type="submit">Send Email</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default EmailForm;
