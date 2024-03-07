import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Profile = () => {
  const { logout } = useAuth();
  const { name } = useParams();
  const savedUserEmail = localStorage.getItem('userEmail');
  console.log(savedUserEmail);
  return (
    <div className="form">
      <h2>Hello, {name}!</h2>
      <p>Email: {savedUserEmail}</p>
      <Link to="/User/Login">
        <button className="btn" onClick={logout}>
          Log out
        </button>
      </Link>
    </div>
  );
};

export default Profile;
