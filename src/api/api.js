import axios from 'axios';

// .env 파일의 API 주소를 불러옵니다.
const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL, // .env에 저장된 주소
    headers: {
      'Accept': 'application/json',
    },
  });
  

export const getOkrData = (page, company_name, new_sorting) => {
    const params = {
        ...(company_name && { company_name }), // company_name이 있으면 추가
        ...(new_sorting && { new_sorting })       // page_size가 있으면 추가
    };

    return apiClient.get(`/${page}`, { params });
}
export const getTotalAIData = (page, company_name, new_sorting, page_size) => {
    return apiClient.get(`/prediction/${page}`, {
        params: {company_name, new_sorting, page_size},
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
export const getCompanyData = (page, company_name, page_size) => {
    const params = {
        ...(company_name && { company_name }), // company_name이 있으면 추가
        ...(page_size && { page_size })       // page_size가 있으면 추가
    };

    return apiClient.get(`/company/${page}`, { params });
}

export default apiClient;