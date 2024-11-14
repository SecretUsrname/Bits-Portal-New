import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserTag, FaWindowRestore } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Tag = () => {
    const navigate = useNavigate();
    const id = localStorage.getItem('id');
    const [userlist, setuserlist] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [currentdoi, setcurrentdoi] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const filteredUsers = userlist.filter(user =>
        user.name.toLowerCase().includes(searchText.toLowerCase())
    );
    useEffect(() => {            
            const pid = localStorage.getItem('pid')
            axios.get(`http://localhost:3000/paper/${pid}`)
                .then(response => {
                  const paper = response.data;
                  console.log(paper)
                  setcurrentdoi(paper.DOI);
                })
                .catch(error => {
                  console.error('Error fetching users:', error);
                });
    }, [])

    const TagUser = () => {
        for (const user of selectedUsers){
            if(!user.DOI.includes(currentdoi) && !user.tagged_DOI.includes(currentdoi)) {
                const encodedDoi = encodeURIComponent(currentdoi);
                axios.post(`http://localhost:3000/paper/tag/${encodedDoi}/${user.email}`)
                .then(response => {
                  alert(`${user.name} has been tagged.`)
                })
                .catch(error => {
                  console.error('Error Taggin user:', error);
                });
            }
            else{
              alert(`${user.name} is already tagged.`)
            }
        }
        navigate('/user/papers');
    }

    const handleTagUser = (user) => {
        if (!selectedUsers.includes(user)) {
          setSelectedUsers([...selectedUsers, user]);
        }
        setSearchText(''); // Clear search after tagging
    };

    const handleRemoveUser = (userToRemove) => {
        setSelectedUsers(selectedUsers.filter(user => user !== userToRemove));
    };

    useEffect(() => {
        axios.get('http://localhost:3000/alluser')
            .then(response => {
                const users = response.data;
                const updatedUserList = users.filter(user => user._id !== id);
                setuserlist(updatedUserList);              
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    }, []);

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
          <h1 className="text-2xl font-semibold mb-4">Tag Users</h1>
    
          {/* Search Bar */}
          <div className="relative mb-4">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search for users..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
            />
            <FaUserTag className="absolute right-4 top-2 text-gray-400" />
            
            {/* Dropdown with user suggestions */}
            {searchText && (
              <ul className="absolute w-full bg-white border border-gray-200 rounded-lg mt-2 max-h-40 overflow-y-auto z-10">
                {filteredUsers.map((user) => (
                  <li
                    key={user.id}
                    onClick={() => handleTagUser(user)}
                    className="px-4 py-2 hover:bg-indigo-100 cursor-pointer"
                  >
                    {user.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
    
          {/* Display Selected Users */}
          <div className="mb-4">
            <h2 className="text-lg font-medium mb-2">Tagged Users</h2>
            {selectedUsers.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <span
                    key={user.id}
                    className="flex items-center bg-indigo-500 text-white px-3 py-1 rounded-full text-sm"
                  >
                    {user.name}
                    <button
                      onClick={() => handleRemoveUser(user)}
                      className="ml-2 bg-red-600 text-white px-1 rounded-full focus:outline-none"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No users tagged yet.</p>
            )}
          </div>
    
          {/* Save Button */}
          <button
            className="w-full bg-indigo-500 text-white py-2 rounded-lg mt-4 hover:bg-indigo-600 transition-colors"
            onClick={TagUser}
          >
            Save Tags
          </button>
        </div>
    );

};

export default Tag;
