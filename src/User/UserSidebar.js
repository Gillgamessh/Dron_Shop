import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import {
  BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill,
  BsListCheck, BsMenuButtonWide, BsFillGearFill, BsPersonCircle, BsHouse
} from 'react-icons/bs';

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const { user } = useAuth();
  const savedUserName = localStorage.getItem('userName');
  return (
    <aside id="User_sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className='sidebar-title'>
        <div className='sidebar-brand'>
          Dron_Contract.Shop
        </div>
        <span className='icon close_icon' onClick={OpenSidebar}>X</span>
      </div>

      <ul className='sidebar-list'>
        <li className='sidebar-list-item-user'>
          <Link to="/User/UserHome">
            <BsHouse className='icon' /> Main
          </Link>
        </li>
        <li className='sidebar-list-item-user'>
          <Link to="/User/Product">
            <BsMenuButtonWide className='icon' /> Products
          </Link>
        </li>
        <li className='sidebar-list-item-user'>
        {user ? (
            <Link to={`/User/Profile/${savedUserName}`}>
              <BsPersonCircle className='icon' /> Profile
            </Link>
          ) : (
            <Link to="/User/Login">
              <BsPersonCircle className='icon' /> Account
            </Link>
          )}
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;