import React, { useEffect, useState } from 'react';
import { getNumberOfReturns } from '../../../api/api';

function Returns() {
  const [returnsMonth, setReturnsMonth] = useState(0);
  const [returnsYear, setReturnsYear] = useState(0);

  useEffect(() => {
    getNumberOfReturns('2022-01-01', '2022-12-30')
      .then((res) => {
        setReturnsYear(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    getNumberOfReturns('2022-05-01', '2022-05-30')
      .then((res) => {
        setReturnsMonth(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="return-stats-container inner-container">
      <h3 className="title">Zwroty</h3>
      <div className="return-stats-container-inner">
        <div>
          <h3>{returnsMonth}</h3>
          <p>w tym miesiacu</p>
        </div>
        <div>
          <h3>{returnsYear}</h3>
          <p>W tym roku</p>
        </div>
      </div>
    </div>
  );
}

export default Returns;
