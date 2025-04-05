import React, { useState, useEffect } from 'react';
import { getAllMOU } from '../../utils/excel';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const MOUList = () => {
  const [mouList, setMouList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMOUData();
  }, []);

  const loadMOUData = () => {
    try {
      const allMOU = getAllMOU();
      setMouList(allMOU);
      setLoading(false);
    } catch (error) {
      toast.error('Error loading MOU data');
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="mou-list">
      <h2>MOU Records</h2>
      {mouList.length === 0 ? (
        <p>No MOU records found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Institute Name</th>
              <th>Duration</th>
              <th>Signed By</th>
              <th>Academic Year</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            {mouList.map((mou, index) => (
              <tr key={index}>
                <td>{mou.instituteName}</td>
                <td>
                  {format(new Date(mou.startDate), 'MMM yyyy')} -{' '}
                  {format(new Date(mou.endDate), 'MMM yyyy')}
                </td>
                <td>{mou.signedBy}</td>
                <td>{mou.academicYear}</td>
                <td>{mou.purpose.substring(0, 50)}...</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MOUList;