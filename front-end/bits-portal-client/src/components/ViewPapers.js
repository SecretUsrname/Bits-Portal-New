import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AllPapers = () => {
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPaper, setSelectedPaper] = useState(null);  // State to store the selected paper for modal
    const navigate = useNavigate();

    // Fetch all papers from the API
    useEffect(() => {
        const fetchPapers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/allpapers');
                setPapers(response.data);
            } catch (err) {
                setError('Error fetching papers');
            } finally {
                setLoading(false);
            }
        };

        fetchPapers();
    }, []);

    // Handle row click to show paper details in modal
    const handleRowClick = (paper) => {
        setSelectedPaper(paper);
    };

    // Close modal
    const closeModal = () => {
        setSelectedPaper(null);
    };

    const goback = () => {
        navigate('/home');
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-xl text-gray-500">
                Loading papers...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-xl text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <button
            className="w-auto py-2 px-6 mb-4 bg-red-500 text-white font-semibold rounded-full shadow-lg hover:bg-red-600 transition duration-200 ease-in-out self-end"
            type="button"
            onClick={() => goback()}
            >
            ← Back
            </button>

            <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">All Papers</h1>
            
            <div className="overflow-x-auto shadow-lg rounded-xl mb-6 bg-white">
                <table className="min-w-full bg-white table-auto border-separate border-spacing-2">
                    <thead>
                        <tr className="text-left text-sm font-semibold text-gray-700 bg-indigo-600">
                            <th className="px-6 py-3 text-white">Author</th>
                            <th className="px-6 py-3 text-white">Title</th>
                            <th className="px-6 py-3 text-white">Year</th>
                            <th className="px-6 py-3 text-white">Journal</th>
                            <th className="px-6 py-3 text-white">Volume</th>
                            <th className="px-6 py-3 text-white">pages</th>
                            <th className="px-6 py-3 text-white">DOI</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {papers.length > 0 ? (
                            papers.map((paper) => (
                                <tr
                                    key={paper._id}
                                    className="hover:bg-indigo-50 cursor-pointer transition duration-200 ease-in-out"
                                    onClick={() => handleRowClick(paper)}  // On row click, show paper details
                                >
                                    <td className="px-6 py-4 text-sm text-gray-700 border-b">{paper.author}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700 border-b">{paper.title}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700 border-b">{paper.year}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700 border-b">{paper.journal}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700 border-b">{paper.volume}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700 border-b">{paper.pages}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800 border-b">{paper.DOI}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">No papers available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal to show detailed paper information */}
            {selectedPaper && (
                <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-8 rounded-xl shadow-2xl w-11/12 md:w-2/3 lg:w-1/2">
                        <h2 className="text-3xl font-semibold text-gray-900 mb-6">Paper Details</h2>
                        <div className="space-y-4">
                            <p><strong className="text-gray-600">DOI:</strong> <span className="text-gray-800">{selectedPaper.DOI}</span></p>
                            <p><strong className="text-gray-600">Title:</strong> <span className="text-gray-800">{selectedPaper.title}</span></p>
                            <p><strong className="text-gray-600">Author:</strong> <span className="text-gray-800">{selectedPaper.author}</span></p>
                            <p><strong className="text-gray-600">Publisher:</strong> <span className="text-gray-800">{selectedPaper.publisher}</span></p>
                            <p><strong className="text-gray-600">Year:</strong> <span className="text-gray-800">{selectedPaper.year}</span></p>
                            <p><strong className="text-gray-600">Journal:</strong> <span className="text-gray-800">{selectedPaper.journal}</span></p>
                            <p><strong className="text-gray-600">Volume:</strong> <span className="text-gray-800">{selectedPaper.volume}</span></p>
                            <p><strong className="text-gray-600">Pages:</strong> <span className="text-gray-800">{selectedPaper.pages}</span></p>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition duration-200"
                                onClick={closeModal}  // Close the modal
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllPapers;