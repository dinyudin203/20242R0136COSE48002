import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { postExcel } from '../api/api.js';
import '../styles/ExcelImport.css';

const ExcelImportPopup = ({ isVisible, onClose }) => {
  const [selectedFileName, setSelectedFileName] = useState(null);

  // 엑셀 파일 업로드 처리
  const handleExcelUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.error('파일이 선택되지 않았습니다.');
      return;
    }
  
    try {
      const response = await postExcel(file);
      console.log('서버 응답:', response);
      alert('파일 업로드가 성공적으로 완료되었습니다.');
    } catch (error) {
      alert('파일 업로드에 실패했습니다.');
    }
  }

  // 팝업이 보이지 않으면 null 반환
  if (!isVisible) return null;

  return (
    <div className="overlay">
      <div className="popup">
        {/* 제목과 파일 선택 버튼 */}
        <div className="header-container1">
          <h3 className="header1">엑셀 파일 업로드</h3>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleExcelUpload}
            id="file-upload"
            className="file-input"
          />
          <label htmlFor="file-upload" className="file-button">
            파일 선택
          </label>
        </div>

        {/* 선택된 파일명 표시 */}
        {selectedFileName && <p className="file-name">{selectedFileName}</p>}

        {/* 닫기 버튼 */}
        <div className="actions">
          <button className="close-button" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExcelImportPopup;
