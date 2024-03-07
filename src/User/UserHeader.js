import React from 'react';
import { BsJustify, BsSearch } from 'react-icons/bs';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function Header({ OpenSidebar }) {
  const { user } = useAuth();
  const savedUserName = localStorage.getItem('userName');
  return (
    <header className='header'>
      <div className='menu-icon'>
        <BsJustify className='icon' onClick={OpenSidebar} />
      </div>
      <div className='header-left'>
        <BsSearch className='icon' />
      </div>
      <div className='header-right'>
        {user ? (
          <Link to={`/User/Profile/${savedUserName}`}>
            Profile
          </Link>
        ) : (
          <>
            <Link to="/User/Registration">
              Registration
            </Link>
            <span className='link-separator'></span>
            <Link to="/User/Login">
              Sign In
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;

