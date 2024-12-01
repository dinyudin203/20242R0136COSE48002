import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import '../styles/ExcelImport.css';

const ExcelImportPopup = ({ isVisible, onClose, onExcelImport }) => {
  const [selectedFileName, setSelectedFileName] = useState(''); // 선택된 파일명 상태

  // 엑셀 파일 업로드 처리
  const handleExcelUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFileName(file.name); // 선택된 파일명 설정
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        onExcelImport(jsonData); // 부모 컴포넌트로 데이터 전달
      };
      reader.readAsArrayBuffer(file);
    }
  };

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
        {selectedFileName && (
          <p className="file-name">{selectedFileName}</p>
        )}

        {/* 업로드 및 닫기 버튼 */}
        <div className="actions">
          <button className="upload-button" onClick={onExcelImport}>
            업로드
          </button>
          <button className="close-button" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExcelImportPopup;
