import React, { useState, useEffect } from 'react';
import Button from '../Button';
import { getUniqueAIData } from '../api/api';

const OkrAIPage = ({ setAITaskStatus, aiOkrId = {} }) => {
  const [currentData, setCurrentData] = useState(null); // 현재 데이터를 저장
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 인덱스
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  // 현재 인덱스의 데이터를 로드
  const fetchCurrentData = async () => {
    if (currentIndex >= aiOkrId.length) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const id = aiOkrId[currentIndex].id;
      const response = await getUniqueAIData(id);
      setCurrentData(response.data); // 현재 데이터를 업데이트
      setAITaskStatus('success');
    } catch (err) {
      console.error('데이터 로드 실패:', err);
      setError('데이터 로드 실패');
      setAITaskStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // 첫 번째 데이터 로드
  useEffect(() => {
    if (aiOkrId.length > 0) {
      fetchCurrentData();
    }
  }, [currentIndex]);

  // 다음 데이터로 이동
  const handleNext = () => {
    if (currentIndex < aiOkrId.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // 이전 데이터로 이동
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  function FormattedText({ text }) {
    return <div style={{ whiteSpace: 'pre-line', lineHeight: '1.5' }}>{text}</div>;
  }

  return (
    <div className="page-container">
      <h1>AI 적용 결과 페이지</h1>

      {/* 로딩 상태 */}
      {loading && <h2>데이터 로딩 중...</h2>}

      {/* 에러 상태 */}
      {error && <h2>{error}</h2>}

      {/* 데이터가 없을 경우 */}
      {!currentData && !loading && (
        <h2 style={{ textAlign: 'left', marginTop: '40px', color: '#555' }}>
          적용된 데이터가 없습니다.
        </h2>
      )}

      {/* 데이터 표시 */}
      {currentData && (
        <div
          style={{
            border: '1px solid #ccc',
            borderRadius: '10px',
            padding: '10px',
            marginTop: '10px',
          }}
        >
          <h3>OKR Data</h3>
          <p>
            <strong>No:</strong> {currentData.okr_id}
          </p>
          <p>
            <strong>일자:</strong> {aiOkrId[currentIndex].date}
          </p>
          <p>
            <strong>기업명:</strong> {aiOkrId[currentIndex].company}
          </p>
          <p>
            <strong>업종:</strong> {aiOkrId[currentIndex].industry}
          </p>
          <p>
            <strong>부서명:</strong> {aiOkrId[currentIndex].department}
          </p>
          <p>
            <strong>구분(OKR):</strong> {aiOkrId[currentIndex].type}
          </p>
          <p>
            <strong>상위/해당목표:</strong> {currentData.upper_objective}
          </p>
          <p>
            <strong>작성 OKR:</strong> {currentData.input_sentence}
          </p>
          <h3>Guideline</h3>
          <p>
            <strong>가이드라인:</strong>
            <FormattedText text={currentData.guideline} />
          </p>
          <h3>Revision</h3>
          <p>
            <strong>수정된 OKR:</strong> {currentData.revision}
          </p>
          <p>
            <strong>수정한 이유:</strong> {currentData.revision_description}
          </p>

          {/* 모든 Predictions 표시 */}
          {currentData.predictions && currentData.predictions.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h3>Evaluation</h3>
              {currentData.predictions.map((prediction, index) => (
                <div
                  key={index}
                  style={{
                    borderBottom: '1px solid #ccc',
                    marginBottom: '10px',
                    paddingBottom: '10px',
                  }}
                >
                  <p>
                    <strong>평가 기준:</strong> {prediction.prediction_type}
                  </p>
                  <p>
                    <strong>점수:</strong> {prediction.prediction_score}
                  </p>
                  <p>
                    <strong>날짜:</strong> {prediction.prediction_date.split('T')[0]}
                  </p>
                  <p>
                    <strong>평가 이유:</strong>
                    <FormattedText text={prediction.prediction_description} />
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 데이터 네비게이션 버튼 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '20px',
          gap: '10px',
        }}
      >
        <button
          disabled={!currentData || currentIndex === 0 || loading}
          onClick={handlePrevious}
          style={{
            padding: '5px 10px',
            backgroundColor: !currentData || currentIndex === 0 || loading ? '#ccc' : '#007bff',
            color: 'white',
            cursor: !currentData || currentIndex === 0 || loading ? 'not-allowed' : 'pointer',
          }}
        >
          이전
        </button>
        <span>
          {aiOkrId.length === 0
            ? '0 / 0'
            : `${currentIndex + 1} / ${aiOkrId.length}`}
        </span>
        <button
          disabled={!currentData || currentIndex === aiOkrId.length - 1 || loading}
          onClick={handleNext}
          style={{
            padding: '5px 10px',
            backgroundColor:
              !currentData || currentIndex === aiOkrId.length - 1 || loading
                ? '#ccc'
                : '#007bff',
            color: 'white',
            cursor:
              !currentData || currentIndex === aiOkrId.length - 1 || loading
                ? 'not-allowed'
                : 'pointer',
          }}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default OkrAIPage;
