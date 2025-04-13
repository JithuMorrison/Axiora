import { toast } from 'react-toastify';
import { differenceInMonths, parseISO, format } from 'date-fns';
import axios from 'axios';

export const checkMOURenewals = async () => {
  const user = 'jithumorrison2210564@ssn.edu.in'
  try {
    const response = await axios.get('http://localhost:5000/sheet-data1');
    // Transform the array of arrays into array of objects
    const allMOU = response.data.values.map(row => ({
      instituteName: row[0] || '',
      startDate: row[1] || '',
      endDate: row[2] || '',
      signedBy: row[3] || '',
      facultyDetails: row[4] || '',
      academicYear: row[5] || '',
      purpose: row[6] || '',
      outcomes: row[7] || '',
      agreementFileId: row[8] || '',
      fileName: row[9] || '',
      createdBy: row[10] || '',
      createdAt: row[11] || ''
    }));

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