// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreatePaperWithUser from './components/CreatePaperWithUser';
import ViewUsers from './components/ViewUsers';
import ViewPapers from './components/ViewPapers';
import SignIn from './components/SignInPage';
import UserPapers from './components/UserPapers';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
        <Routes>
          <Route path="/create/paper" element={<CreatePaperWithUser />} />
          <Route path="/users" element={<ViewUsers />} /> {/* Updated here */}
          <Route path="/papers" element={<ViewPapers/>} />
          <Route path="/signin" element={<SignIn/>} />
          <Route path="/user/papers" element={<UserPapers/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;