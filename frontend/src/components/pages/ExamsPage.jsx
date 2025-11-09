// components/ExamsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function ExamsPage() {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [formData, setFormData] = useState({
    courseId: '',
    examName: '',
    examDate: '',
    location: '',
    studyMaterials: []
  });
  const [newMaterial, setNewMaterial] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [examsRes, coursesRes] = await Promise.all([
        axios.get(`${API_URL}/api/exams`, { withCredentials: true }),
        axios.get(`${API_URL}/api/courses`, { withCredentials: true })
      ]);
      
      setExams(examsRes.data);
      setCourses(coursesRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingExam) {
        await axios.put(
          `${API_URL}/api/exams/${editingExam._id}`,
          formData,
          { withCredentials: true }
        );
        alert('✅ Exam updated successfully!');
      } else {
        await axios.post(
          `${API_URL}/api/exams`,
          formData,
          { withCredentials: true }
        );
        alert('✅ Exam created and synced to Google Calendar!');
      }

      setShowModal(false);
      setEditingExam(null);
      resetForm();
      fetchData();
    } catch (error) {
      alert('❌ Error: ' + error.response?.data?.error || error.message);
    }
  };

  const handleEdit = (exam) => {
    setEditingExam(exam);
    setFormData({
      courseId: exam.courseId._id,
      examName: exam.examName,
      examDate: new Date(exam.examDate).toISOString().slice(0, 16),
      location: exam.location || '',
      studyMaterials: exam.studyMaterials || []
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this exam? It will also be removed from Google Calendar.')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/exams/${id}`, {
        withCredentials: true
      });
      alert('✅ Exam deleted successfully!');
      fetchData();
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      courseId: '',
      examName: '',
      examDate: '',
      location: '',
      studyMaterials: []
    });
    setNewMaterial('');
  };

  const addMaterial = () => {
    if (newMaterial.trim()) {
      setFormData({
        ...formData,
        studyMaterials: [...formData.studyMaterials, newMaterial.trim()]
      });
      setNewMaterial('');
    }
  };

  const removeMaterial = (index) => {
    setFormData({
      ...formData,
      studyMaterials: formData.studyMaterials.filter((_, i) => i !== index)
    });
  };

  const getDaysUntil = (examDate) => {
    const now = new Date();
    const exam = new Date(examDate);
    const diffTime = exam - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getCountdownColor = (days) => {
    if (days < 0) return 'text-gray-500';
    if (days <= 3) return 'text-red-600 font-bold';
    if (days <= 7) return 'text-orange-600 font-semibold';
    if (days <= 14) return 'text-yellow-600';
    return 'text-blue-600';
  };

  const getCountdownBadge = (days) => {
    if (days < 0) return { text: 'Selesai', color: 'bg-gray-100 text-gray-800' };
    if (days === 0) return { text: 'HARI INI!', color: 'bg-red-500 text-white' };
    if (days === 1) return { text: 'BESOK!', color: 'bg-orange-500 text-white' };
    return { text: `H-${days}`, color: 'bg-blue-100 text-blue-800' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading exams...</p>
        </div>
      </div>
    );
  }

  // Separate upcoming and past exams
  const now = new Date();
  const upcomingExams = exams.filter(e => new Date(e.examDate) >= now)
    .sort((a, b) => new Date(a.examDate) - new Date(b.examDate));
  const pastExams = exams.filter(e => new Date(e.examDate) < now)
    .sort((a, b) => new Date(b.examDate) - new Date(a.examDate));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎯 Jadwal Ujian
          </h1>
          <p className="text-gray-600">
            Plan your exams and study materials
          </p>
        </div>

        {/* Add Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              setEditingExam(null);
              resetForm();
              setShowModal(true);
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            ➕ Tambah Ujian
          </button>
        </div>

        {/* Upcoming Exams */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">📅 Ujian Mendatang</h2>
          
          {upcomingExams.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <span className="text-6xl mb-4 block">🎉</span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Tidak Ada Ujian Mendatang
              </h3>
              <p className="text-gray-600">
                Enjoy your free time!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingExams.map((exam) => {
                const daysUntil = getDaysUntil(exam.examDate);
                const badge = getCountdownBadge(daysUntil);
                
                return (
                  <div
                    key={exam._id}
                    className="bg-white rounded-lg shadow-lg hover:shadow-xl transition p-6 border-t-4 border-blue-500"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${badge.color}`}>
                        {badge.text}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {exam.examName}
                    </h3>
                    
                    <p className="text-blue-600 font-medium mb-1">
                      📚 {exam.courseId.courseName}
                    </p>
                    
                    <p className="text-sm text-gray-600 mb-1">
                      📅 {new Date(exam.examDate).toLocaleString('id-ID', {
                        dateStyle: 'full',
                        timeStyle: 'short'
                      })}
                    </p>
                    
                    {exam.location && (
                      <p className="text-sm text-gray-600 mb-3">
                        📍 {exam.location}
                      </p>
                    )}
                    
                    {exam.studyMaterials.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Materi Belajar:
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {exam.studyMaterials.slice(0, 3).map((material, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>{material}</span>
                            </li>
                          ))}
                          {exam.studyMaterials.length > 3 && (
                            <li className="text-gray-400">
                              +{exam.studyMaterials.length - 3} more
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                    
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleEdit(exam)}
                        className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(exam._id)}
                        className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Past Exams */}
        {pastExams.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">📜 Ujian Selesai</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Ujian
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Mata Kuliah
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pastExams.map((exam) => (
                    <tr key={exam._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">{exam.examName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-600">{exam.courseId.courseName}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(exam.examDate).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(exam._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-2xl font-bold mb-6">
                {editingExam ? 'Edit Ujian' : 'Tambah Ujian'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mata Kuliah *
                  </label>
                  <select
                    required
                    value={formData.courseId}
                    onChange={(e) =>
                      setFormData({ ...formData, courseId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih Mata Kuliah</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.courseName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Ujian *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.examName}
                    onChange={(e) =>
                      setFormData({ ...formData, examName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="UTS Kalkulus II, UAS Pemrograman Web"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal & Waktu Ujian *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.examDate}
                    onChange={(e) =>
                      setFormData({ ...formData, examDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lokasi Ujian
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Gedung A Ruang 301"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Materi Belajar
                  </label>
                  
                  {formData.studyMaterials.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {formData.studyMaterials.map((material, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-gray-50 p-2 rounded"
                        >
                          <span className="flex-1 text-sm">{material}</span>
                          <button
                            type="button"
                            onClick={() => removeMaterial(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMaterial}
                      onChange={(e) => setNewMaterial(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addMaterial();
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Bab 1-5, Slide PPT 8-14, dll."
                    />
                    <button
                      type="button"
                      onClick={addMaterial}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    {editingExam ? 'Update' : 'Simpan'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingExam(null);
                      resetForm();
                    }}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

