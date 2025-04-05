import { toast } from 'react-toastify';
import { differenceInMonths, parseISO, format } from 'date-fns';
import { getAllMOU } from './excelHandler';

export const checkMOURenewals = () => {
  const allMOU = getAllMOU();
  const currentDate = new Date();
  
  allMOU.forEach(mou => {
    const endDate = parseISO(mou.endDate);
    const monthsRemaining = differenceInMonths(endDate, currentDate);
    
    if (monthsRemaining <= 1) {
      toast.warning(`MOU with ${mou.instituteName} expires soon (${format(endDate, 'MMM d, yyyy')})`);
    }
  });
};

export const showNewMOUNotification = (instituteName) => {
  toast.success(`New MOU added with ${instituteName}`);
};