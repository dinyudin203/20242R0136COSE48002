import React from 'react';
import { companyData } from '../data/data';

const OkrInfoPage = () => (
  <div>
    <h1>OKR 기업정보 페이지</h1>
    <div>
      <label>기업명: </label>
      <select>
        <option>모든 기업</option>
        {companyData.map((company) => (
          <option key={company.no}>{company.name}</option>
        ))}
      </select>
      <label>연도: </label>
      <select>
        <option>2023</option>
      </select>
    </div>
    <table border="1" style={{ width: '50%', marginTop: '10px' }}>
      <thead>
        <tr>
          <th>No.</th>
          <th>기업명</th>
          <th>연도</th>
        </tr>
      </thead>
      <tbody>
        {companyData.map((company) => (
          <tr key={company.no}>
            <td>{company.no}</td>
            <td>{company.name}</td>
            <td>{company.year}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default OkrInfoPage;
