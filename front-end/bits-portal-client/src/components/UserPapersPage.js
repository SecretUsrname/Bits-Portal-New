// src/components/UserPapersPage.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { usePaper } from '../context/PaperContext';

const UserPapersPage = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('id');
  const navigator = useNavigate();
  const {pid} = usePaper();

  const handleDelete = (paperId) => {
    axios.delete(`http://localhost:3000/paper/${paperId}`)
        .then(response => {
            console.log(response);
            alert(response.data.message); // Show success message
        })
        .catch(error => {
            alert('Error deleting paper');
            console.log('Error deleting Paper:', error);
        });
  };

  const goback = () => {
    navigator('/');
  } 

  const tagUsers = (id) => {
    pid(id);
    navigator('/tag/users');
  }

  useEffect(() => {
    // Fetch all papers for the user
    const fetchPapers = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/user/${userId}/papers`);
        setPapers(response.data);
      } catch (err) {
        setError("No papers");
      } finally {
        setLoading(false);
      }
    };
    fetchPapers();
  }, [userId]);

  if (loading) return <p>Loading papers...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 bg-gradient-to-br from-blue-400 to-indigo-500 min-h-screen flex flex-col items-center text-gray-100">
        <div className="w-full max-w-4xl">
            <button
            className="w-auto py-2 px-6 mb-4 bg-red-500 text-white font-semibold rounded-full shadow-lg hover:bg-red-600 transition duration-200 ease-in-out self-end"
            type="button"
            onClick={() => goback()}
            >
            ← Back
            </button>
            
            <h1 className="text-4xl font-bold mb-8 text-center">Your Published Papers</h1>

            {papers.length > 0 ? (
            <div className="space-y-6">
                {papers.map((paper) => (
                  <div key={paper._id} className="p-6 bg-white text-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                    <h2 className="text-2xl font-bold mb-2 text-gray-700">{paper.title}</h2>
                    <p className="text-md mb-1"><strong className="text-gray-600">Author(s):</strong> {paper.author}</p>
                    <p className="text-md mb-1"><strong className="text-gray-600">DOI:</strong> {paper.DOI}</p>
                    <p className="text-md mb-1"><strong className="text-gray-600">Publisher:</strong> {paper.publisher}</p>
                    <p className="text-md mb-1"><strong className="text-gray-600">Year:</strong> {paper.year}</p>
                    <p className="text-md mb-1"><strong className="text-gray-600">Journal:</strong> {paper.journal}</p>
                    <p className="text-md mb-1"><strong className="text-gray-600">Volume:</strong> {paper.volume}</p>
                    <p className="text-md mb-1"><strong className="text-gray-600">Pages:</strong> {paper.pages}</p>
                    <div className="mt-4 flex justify-end">
                    <button
                      className="py-2 px-5 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition duration-200"
                      type="button"
                      onClick={() => tagUsers(paper._id)}
                    >
                      Tag
                    </button>
                    <button
                      onClick={() => handleDelete(paper._id)}
                      className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 ease-in-out"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                ))}
            </div>
            ) : (
            <p className="text-center text-xl font-medium mt-8">No Papers Published Yet.</p>
            )}
        </div>
    </div>
  );
};

export default UserPapersPage;
