import React from 'react';

const StatisticsTable = ({ permalink, statistics }) => (
    <table>
      <caption>{permalink.toUpperCase()}</caption>
      <thead>
        <tr>
          <th>Date</th>
          <th>Followers</th>
        </tr>
      </thead>
      <tbody>
        {statistics.map(({ id, date, followers }) => (
          <tr key={id}>
            <td>{date}</td>
            <td>{followers}</td>
          </tr>
        ))}
      </tbody>
    </table>
);

export default StatisticsTable;
