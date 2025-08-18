import axios from 'axios';

export const listStudentsInClass = async (classId, token) => {
  return axios.get(`/api/classes/students/${classId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addStudentsToClass = async (classId, studentIds, token) => {
  return axios.put(
    `/api/classes/students/${classId}`,
    { studentIds },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const removeStudentFromClass = async (classId, studentId, token) => {
  return axios.delete(`/api/classes/students/${classId}/${studentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
