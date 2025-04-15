import { toast } from 'react-toastify';
import { differenceInMonths, parseISO, format } from 'date-fns';
import axios from 'axios';

export const checkMOURenewals = async () => {
  const user = 'jithumorrison2210564@ssn.edu.in'
  try {
    if (localStorage.getItem('moudetails')) {
      const data = localStorage.getItem('moudetails');
      const allMOU = JSON.parse(data);

      const currentDate = new Date();
      
      allMOU.forEach(mou => {
        if (!mou.endDate) return; // Skip if no end date
        
        try {
          const endDate = parseISO(mou.endDate);
          const monthsRemaining = differenceInMonths(endDate, currentDate);
          
          if (monthsRemaining <= 1 && monthsRemaining >= 0) {
            toast.warning(
              `MOU with ${mou.instituteName} expires on ${format(endDate, 'MMM d, yyyy')}`,
              { autoClose: 10000 }
            );
          }
        } catch (error) {
          console.error('Error processing MOU:', mou.instituteName, error);
        }
      });
    }
  } catch (error) {
    console.error('Error fetching MOU data:', error);
    toast.error('Failed to check MOU renewals');
  }
};

export const showNewMOUNotification = (instituteName) => {
  toast.success(
    `New MOU added with ${instituteName}`,
    { 
      icon: '🎉',
      autoClose: 5000
    }
  );
};

// Set up automatic renewal checks (every 24 hours)
const setupRenewalChecks = () => {
  // Initial check
  checkMOURenewals();
  
  // Set up periodic checks
  setInterval(checkMOURenewals, 24 * 60 * 60 * 1000); // 24 hours
};

// Start the automatic checks when this module loads
setupRenewalChecks();