import React, { useState, useEffect, useCallback } from 'react';
import { getUniqueAIData, getTaskStatus } from '../api/api';
import * as XLSX from 'xlsx'; // xlsx 라이브러리 임포트

const OkrAIPage = ({aiOkrId = [] }) => {
  const [currentData, setCurrentData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [AITaskStatus, setAITaskStatus] = useState(''); // 초기값 설정
  const [completedTasks, setCompletedTasks] = useState([]); // 완료된 task_id 추적

  

  const fetchCurrentData = useCallback(async () => {
    if (currentIndex >= aiOkrId.length) return;
    console.log('aiOkrId:', aiOkrId); 
  
    setLoading(true);
    setError(null);
  
    try {
      const id = aiOkrId[currentIndex].id;
      const response = await getUniqueAIData(id);
      setCurrentData(response.data);
      //setAITaskStatus('fending');
    } catch (err) {
      console.error('데이터 로드 실패:', err);
      setError('데이터 로드 실패');
      setAITaskStatus('error');
    } finally {
      setLoading(false);
      console.log(currentData)
    }
  }, [currentIndex, aiOkrId, setAITaskStatus]);

  useEffect(() => {
    if (aiOkrId.length > 0) {
      fetchCurrentData();
    }
  // 의존성 배열에 필요한 값을 추가
  }, [currentIndex, aiOkrId.length, fetchCurrentData]);
  

  const handleNext = () => {
    if (currentIndex < aiOkrId.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleExport = () => {
    if (!currentData) return;
  
    const baseExportData = {
      'No': currentData.okr_id,
      '일자': aiOkrId[currentIndex].date,
      '기업명': aiOkrId[currentIndex].companyName,
      '부서명': aiOkrId[currentIndex].department,
      '구분': aiOkrId[currentIndex].type,
      '상위/해당목표': currentData.upper_objective || '',
      '작성 OKR': currentData.input_sentence || '',
      '수정 OKR': currentData.revision || '',
      '수정이유': currentData.revision_description || '',
      '가이드라인': currentData.guideline || '',
    };
  
    // // Process predictions based on the index and type
    if (aiOkrId[currentIndex].type === 'Key Result') {
      baseExportData[`align_점수`] ='N/A';
      baseExportData[`align_이유`] = 'N/A';
      baseExportData[`customerValue_점수`] = 'N/A';
      baseExportData[`customerValue_이유`] = 'N/A';
      baseExportData[`connectivity_점수`] = currentData.predictions[0].prediction_score || 'N/A';
      baseExportData[`connectivity_이유`] = currentData.predictions[0].prediction_description || 'N/A';
      baseExportData[`measurability_점수`] = currentData.predictions[1].prediction_score|| 'N/A';
      baseExportData[`measurability_이유`] = currentData.predictions[1].prediction_description || 'N/A';
      baseExportData[`directivity_점수`] = currentData.predictions[2].prediction_score || 'N/A';
      baseExportData[`directivity_이유`] = currentData.predictions[2].prediction_description || 'N/A';
    } else if (aiOkrId[currentIndex].type === 'Objective') {
      baseExportData[`align_점수`] = currentData.predictions[0].prediction_score || 'N/A';
      baseExportData[`align_이유`] = currentData.predictions[0].prediction_description  || 'N/A';
      baseExportData[`customerValue_점수`] = currentData.predictions[1].prediction_score || 'N/A';
      baseExportData[`customerValue_이유`] = currentData.predictions[1].prediction_description || 'N/A';
      baseExportData[`connectivity_점수`] = currentData.predictions[0].prediction_score || 'N/A';
      baseExportData[`connectivity_이유`] = currentData.predictions[0].prediction_description || 'N/A';
      baseExportData[`measurability_점수`] = 'N/A';
      baseExportData[`measurability_이유`] = 'N/A';
      baseExportData[`directivity_점수`] = 'N/A';
      baseExportData[`directivity_이유`] = 'N/A';
    }

    // Convert to Excel
    const worksheet = XLSX.utils.json_to_sheet([baseExportData]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'OKR Data');
    XLSX.writeFile(workbook, `OKR_Data_${aiOkrId[currentIndex].date}.xlsx`);
  };
  


  function FormattedText({ text }) {
    return <div style={{ whiteSpace: 'pre-line', lineHeight: '1.5' }}>{text}</div>;
  }

  // 태스크 상태 가져오기
  const fetchTaskStatus = async (task_id) => {
    try {
      const response = await getTaskStatus(task_id);
      console.log(`태스크 ${task_id} 상태:`, response.data.task_status);

      if (response.data.task_status == 'SUCCESS') {
        setCompletedTasks((prev) => [...prev, task_id]); // 완료된 task_id 추가
        setAITaskStatus('success')
        console.log("AITask:", AITaskStatus)
      } else if (response.data.task_status == 'PENDING') {
        setAITaskStatus('pending');
        console.log("AITask:", AITaskStatus)
      } else {
        setAITaskStatus('error');
      }
    } catch (error) {
      console.error(`태스크 ${task_id} 상태 가져오기 실패:`, error);
      setAITaskStatus('error');
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!Array.isArray(aiOkrId)) {
        console.error('aiOkrId is not an array:', aiOkrId);
        return;
      }
      aiOkrId.forEach((item) => {
        if (!completedTasks.includes(item.task_id)) {
          fetchTaskStatus(item.task_id);
        }
      });
    }, 5000);
  
    return () => clearInterval(intervalId);
  }, [aiOkrId, completedTasks]);
  

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>AI 적용 결과 페이지</h1>
        {/* Export 버튼 */}
        <button
          onClick={handleExport}
          style={{
            padding: '10px 15px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Export
        </button>
      </div>

      {error && <h2>{error}</h2>}
      {!currentData && !loading && <h2>적용된 데이터가 없습니다.</h2>}
      
      {(loading || AITaskStatus == 'pending') && <h2>데이터 AI 적용 중...</h2>}

      {/* 에러 상태 */}
      {AITaskStatus == 'error' && <h2 style={{ color: 'red' }}>AI 모델 처리 중 에러가 발생했습니다.</h2>}


      {/* 데이터 표시 */}
      {currentData && AITaskStatus == 'success'&&(
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
            <strong>기업명:</strong> {aiOkrId[currentIndex].companyName}
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
                    <strong>평가 기준:</strong> {prediction.prediction_type || 'N/A'}
                  </p>
                  <p>
                    <strong>점수:</strong> {prediction.prediction_score || 'N/A'}
                  </p>
                  <p>
                    <strong>날짜:</strong> {prediction.prediction_date
                      ? prediction.prediction_date.split('T')[0]
                      : 'N/A'}
                  </p>
                  <p>
                    <strong>평가 이유:</strong>
                    <FormattedText text={prediction.prediction_description || 'N/A'} />
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
