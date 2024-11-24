import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ViewAllUsers() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [newUser, setNewUser] = useState({ name: '', email: '' });
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();

    // Fetch users when the component mounts
    useEffect(() => {
        axios.get('http://localhost:3000/allUsers')
            .then(response => {
                setUsers(response.data); // Set the fetched users to state
            })
            .catch(error => {
                setError('Error fetching users');
                console.error('Error fetching users:', error);
            });
    }, []); // Empty dependency array means this effect runs once after the first render

    const goback = () => {
        navigate('/home');
    }

    // Handle deleting a user
    const handleDelete = (userId) => {
        axios.delete(`http://localhost:3000/user/${userId}`)
            .then(response => {
                alert(response.data.message); // Show success message
                setUsers(users.filter(user => user._id !== userId)); // Remove deleted user from list
            })
            .catch(error => {
                alert('Error deleting user');
                console.error('Error deleting user:', error);
            });
    };

    // Handle adding a new user
    const handleAddUser = (e) => {
        e.preventDefault(); // Prevent form submission
        if (!newUser.name || !newUser.email) {
            alert('Please provide both name and email');
            return;
        }

        axios.post('http://localhost:3000/user', newUser)
            .then(response => {
                setUsers([...users, response.data]); // Add new user to the list
                setNewUser({ name: '', email: '' }); // Reset form fields
                setSuccessMessage('User added successfully!');
                setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
            })
            .catch(error => {
                alert('Error adding user');
                console.error('Error adding user:', error);
            });
    };

    // Handle form field change for new user
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleRowClick = (user) => {
        setSelectedUser(user);
    };

    const closeModal = () => {
        setSelectedUser(null);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto bg-gradient-to-r from-indigo-500 to-blue-400 text-white rounded-lg shadow-xl">
            <button
            className="w-auto py-2 px-6 mb-4 bg-red-500 text-white font-semibold rounded-full shadow-lg hover:bg-red-600 transition duration-200 ease-in-out self-end"
            type="button"
            onClick={() => goback()}
            >
            ← Back
            </button>
            <h1 className="text-4xl font-extrabold text-center mb-8">View All Users</h1>

            {/* Success Message */}
            {successMessage && (
                <div className="bg-green-500 text-white py-2 px-4 mb-4 rounded-md shadow-md text-center">
                    {successMessage}
                </div>
            )}

            {/* Error Message */}
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

           {/* Add User Form */}
            <div className="mb-8 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-3xl font-semibold text-gray-700 mb-4">Add New User</h2>
                <form onSubmit={handleAddUser} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter name"
                        value={newUser.name}
                        onChange={handleInputChange}
                        className="w-full py-3 px-5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none text-black"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        value={newUser.email}
                        onChange={handleInputChange}
                        className="w-full py-3 px-5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none text-black"
                    />
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 focus:outline-none transition duration-300 ease-in-out"
                    >
                        Add User
                    </button>
                </form>
            </div>


            {/* Users Table */}
            {users.length === 0 ? (
                <p className="text-center text-lg text-gray-300">No users found.</p>
            ) : (
                <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                    <table className="min-w-full table-auto text-gray-800">
                        <thead className="bg-indigo-600 text-white">
                            <tr>
                                <th className="py-3 px-6 text-left">Name</th>
                                <th className="py-3 px-6 text-left">Email</th>
                                <th className="py-3 px-6 text-left">Actions</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id} className="hover:bg-gray-50 transition duration-300 ease-in-out" onClick={() => handleRowClick(user)}>
                                    <td className="py-3 px-6">{user.name}</td>
                                    <td className="py-3 px-6">{user.email}</td>
                                    <td className="py-3 px-6 text-center">
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 ease-in-out"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {selectedUser && (
                <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-8 rounded-xl shadow-2xl w-11/12 md:w-2/3 lg:w-1/2">
                        <h2 className="text-3xl font-semibold text-gray-900 mb-6">User Details</h2>
                        <div className="space-y-4">
                            <p><strong className="text-gray-600">Name:</strong> <span className="text-gray-800">{selectedUser.name}</span></p>
                            <p><strong className="text-gray-600">Email:</strong> <span className="text-gray-800">{selectedUser.email}</span></p>
                            <p><strong className="text-gray-600">DOIs:</strong></p>
                            <div className="text-gray-800">
                            {selectedUser.DOI.map((doi, index) => (
                                <p key={index}>{doi}</p>
                            ))}
                            </div>
                            <p><strong className="text-gray-600">Tagged DOIs:</strong></p>
                            <div className="text-gray-800">
                            {selectedUser.tagged_DOI.map((doi, index) => (
                                <p key={index}>{doi}</p>
                            ))}
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition duration-200"
                                onClick={closeModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewAllUsers;
