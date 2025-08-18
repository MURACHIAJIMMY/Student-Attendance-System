import axios from 'axios';

export const listStudentsInClass = async (classId, token) => {
  return axios.get(`/api/classes/${classId}/students`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addStudentsToClass = async (classId, studentIds, token) => {
  return axios.put(
    `/api/classes/${classId}/students`,
    { students: studentIds }, // ✅ match backend param name
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const removeStudentFromClass = async (classId, studentId, admNo, token) => {
  return axios.delete(`/api/classes/${classId}/students/${studentId}`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { admNo }, // ✅ required by backend
  });
};
