import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Header from './User/UserHeader';
import Sidebar from './User/UserSidebar';
import Login from './User/Login';
import Registration from './User/Registration';
import Info from './User/UserHome';
import Card from './User/Product';
import Admins from './Administrator/AdminApp';
import HeaderA from './Administrator/Header';
import SidebarA from './Administrator/Sidebar';
import HomeA from './Administrator/Home';
import AddProduct from './Administrator/ProductAdd';
import Order from './User/Order';
import ProfilePage from './User/Profile';
import ModifyProd from './Administrator/ProductModify';

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const UserRoutes = () => (
    <div className='grid-container'>
      <Header  OpenSidebar={OpenSidebar}/>
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <Switch>
        <Route path="/User/UserHome" component={Info} />
        <Route path="/User/Product" component={Card} />
        <Route path="/User/Login" component={Login} />
        <Route path="/User/Order" component={Order} />
        <Route path="/User/Profile/:name" component={ProfilePage} />
        <Route path="/User/Registration" component={Registration} />
        <Redirect from="/User" to="/User/UserHome" />
      </Switch>
    </div>
  );

  const AdminRoutes = () => (
    <div className='grid-container'>
      <HeaderA OpenSidebar={OpenSidebar} />
      <SidebarA openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <Switch>
        <Route path="/Administrators" component={Admins} />
        <Route path="/Admin/ProductAdd" component={AddProduct} />
        <Route path="/Admin/ProductModify" component={ModifyProd} />
        <Route path="/Admin/Home" component={HomeA} />
        <Redirect from="/Admin" to="/Admin/Home" />
      </Switch>
    </div>
  );

  return (
    <Router basename="/">
      <AuthProvider>
        <Switch>
          <Route path="/User" component={UserRoutes} />
          <Route path="/Admin" component={AdminRoutes} />
          <Redirect from="/" to="/User" />
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;