import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { postExcel } from '../api/api.js';
import '../styles/ExcelImport.css';

const ExcelImportPopup = ({ isVisible, onClose, onExcelImport }) => {
  const [selectedFileName, setSelectedFileName] = useState(null);

  // 엑셀 파일 업로드 처리
  const handleExcelUpload = (event) => {
    const file = event.target.files[0];
    if (!file){
      console.error("파일이 선택되지 않았습니다.");
      return;
    }
    
    setSelectedFileName(file.name);
    
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        onExcelImport(jsonData);
        
        const formData = new FormData();
        formData.append("file", file);
        
        try {
          const response = await postExcel(formData); // API 호출
          console.log("파일 업로드 성공:", response.data);
        } catch (uploadError) {
          console.error("파일 업로드 실패:", uploadError);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error){
      console.error("엑셀 파일처리 실패", error);
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
