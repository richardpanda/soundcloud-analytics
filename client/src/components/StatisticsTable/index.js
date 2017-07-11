import React from 'react';

import './style.css';

const StatisticsTable = ({ permalink, statistics }) => (
  <div className="statistics-table-container">
    <table className="statistics-table">
      <caption className="statistics-table-caption">{permalink.toUpperCase()}</caption>
      <thead>
        <tr className="statistics-table-header">
          <th>Date</th>
          <th>Followers</th>
        </tr>
      </thead>
      <tbody>
        {statistics.map(({ id, date, followers }) => (
          <tr key={id}>
            <td>{date}</td>
            <td>{followers.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default StatisticsTable;
