import axios from 'axios';

// .env 파일의 API 주소를 불러옵니다.
const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL, // .env에 저장된 주소
    headers: {
      'Accept': 'application/json',
    },
  });
  

export const getOkrData = (page, company_name, new_sorting) => {
    return apiClient.get(`/${page}`, {
        params: {company_name, new_sorting},
    });
};
export const getTotalAIData = (page, company_name, new_sorting) => {
    return apiClient.get(`/prediction/${page}`, {
        params: {company_name, new_sorting},
    });
};
export const getUniqueAIData = (okr_id) => {
    return apiClient.get(`/ai/${okr_id}`);
}
export const postAIData = (okrIds) => {
    return apiClient.post('/ai/', {"okr_ids": okrIds});
}
export const postExcel = (excel) => {
    const formData = new FormData();
    formData.append('excel', excel);
    return apiClient.post('/upload/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}

export default apiClient;