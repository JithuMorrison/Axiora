import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { checkMOURenewals } from '../utils/notification';

const Notifications = () => {
  useEffect(() => {
    
    // Set up interval to check daily
    const interval = setInterval(() => {
      checkMOURenewals();
    }, 86400000); // 24 hours

    return () => clearInterval(interval);
  }, []);

  return null; // This component doesn't render anything
};

export default Notifications;