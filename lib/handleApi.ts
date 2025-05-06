import axios from 'axios';
import instance from './axios';

export const login = async (username: string, password: string) => {
  return await instance.post('/api/auth/login', {
    username,
    password,
  });
};

export const convertToDicom = async (
  file: File,
  name: string,
  patientId: string,
) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', name);
  formData.append('patientId', patientId);
  formData.append(
    'date',
    new Date().toISOString().slice(0, 10).replace(/-/g, ''),
  );
  return await axios.post('/api/convert', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const saveDataImgOrVideo = async (
  file: any,
  fileName: string,
  type = 'CERTIFICATE',
) => {
  const formData = new FormData();
  formData.append('file', file, fileName);
  formData.append('type', type);

  return await instance.post('/api/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
