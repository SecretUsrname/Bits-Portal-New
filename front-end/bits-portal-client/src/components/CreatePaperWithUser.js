import React, { useState } from 'react';
import axios from 'axios';

const CreatePaperWithUser = () => {
  const [userId, setUserId] = useState('');
  const [userIdSubmitted, setUserIdSubmitted] = useState(false);
  const [paperDetails, setPaperDetails] = useState({
    title: '',
    author: '',
    DOI: '',
    publisher: '',
    year: '',
    journal: ''
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaperDetails({
      ...paperDetails,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUserIdSubmit = (e) => {
    e.preventDefault();
    if (userId) {
      setUserIdSubmitted(true);
    } else {
      setMessage("Please enter a user ID.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:3000/${userId}/paper`, paperDetails);
      setMessage('Paper created successfully!');
      setPaperDetails({
        title: '',
        author: '',
        DOI: '',
        publisher: '',
        year: '',
        journal: ''
      });
    } catch (error) {
      setMessage('Error creating paper: ' + error.response?.data?.message);
    }
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const uploadedPaper = response.data;

      setPaperDetails({
        title: uploadedPaper.title || '',
        author: uploadedPaper.author || '',
        DOI: uploadedPaper.DOI || '',
        publisher: uploadedPaper.publisher || '',
        year: uploadedPaper.year || '',
        journal: uploadedPaper.journal || ''
      });
      setMessage('File processed successfully! Review and submit paper.');

    } catch (error) {
      setMessage('Error processing file: ' + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">Create Paper</h2>

        {!userIdSubmitted ? (
          <form onSubmit={handleUserIdSubmit} className="flex flex-col items-center">
            <input
              type="text"
              placeholder="Enter User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Submit User ID
            </button>
          </form>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-gray-700 mt-4">User ID: {userId}</h3>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mt-4">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={paperDetails.title}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="author"
                placeholder="Author"
                value={paperDetails.author}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="DOI"
                placeholder="DOI"
                value={paperDetails.DOI}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="publisher"
                placeholder="Publisher"
                value={paperDetails.publisher}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                name="year"
                placeholder="Year"
                value={paperDetails.year}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="journal"
                placeholder="Journal"
                value={paperDetails.journal}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
                Create Paper
              </button>
            </form>

            <hr className="my-6" />

            <h3 className="text-lg font-semibold text-gray-700">Or Upload a File to Create Paper</h3>
            <form onSubmit={handleFileSubmit} className="flex flex-col items-center mt-4">
              <input
                type="file"
                onChange={handleFileChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              />
              <button type="submit" className="w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600">
                Upload File
              </button>
            </form>
          </>
        )}

        {message && <p className="text-center mt-4 text-red-600">{message}</p>}
      </div>
    </div>
  );
};

export default CreatePaperWithUser;
