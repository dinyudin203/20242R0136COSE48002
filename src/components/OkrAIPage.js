import React from 'react';
import Button from '../Button';

const OkrAIPage = ({ selectedData, onProcessData }) => {
  // 전체 데이터 처리 핸들러
  const handleProcessAll = () => {
    if (onProcessData) {
      onProcessData(selectedData);
    }
  };

  // 개별 데이터 처리 핸들러
  const handleProcessItem = (okr) => {
    if (onProcessData) {
      onProcessData([okr]);
    }
  };

  return (
    <div>
      <h1>AI 적용 페이지</h1>
      {selectedData.length === 0 ? (
        <p>선택된 데이터가 없습니다.</p>
      ) : (
        <div>
          {/* 전체 AI 처리 버튼 */}
          <Button
            onClick={handleProcessAll}
          >
            전체 AI 적용
          </Button>

          <table border="1" style={{ width: '100%', marginTop: '10px' }}>
            <thead>
              <tr>
                <th>No.</th>
                <th>일자</th>
                <th>기업명</th>
                <th>업종</th>
                <th>부서명</th>
                <th>구분(OKR)</th>
                <th>상위/해당목표</th>
                <th>작성 OKR</th>
                <th>AI</th> {/* 버튼 열 */}
              </tr>
            </thead>
            <tbody>
              {selectedData.map((okr, index) => (
                <tr key={index}>
                  <td>{okr.no}</td>
                  <td>{okr.date}</td>
                  <td>{okr.company}</td>
                  <td>{okr.industry}</td>
                  <td>{okr.department}</td>
                  <td>{okr.type}</td>
                  <td>{okr.goal}</td>
                  <td>{okr.okr}</td>
                  <td>
                    {/* 버튼 컴포넌트 사용 */}
                    <Button
                      onClick={() => handleProcessItem(okr)}
                    >
                      AI 적용
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OkrAIPage;
