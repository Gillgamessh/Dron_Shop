import React, { createContext, useContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const logout = () => {
    ClearStorage();
    setUser(null);
    
  };
  const ClearStorage = () =>{
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
  };
  const adminLogin = async (username, password) => {
    try {
      const response = await fetch(`http://localhost:5114/api/Admin/${username}/${password}`);
      const data = await response.json();

      if (response.ok) {
        setUser({ username, role: 'admin' });
        return true;
      } else {
        console.error('Error:', data);
        return false;
      }
    } catch (error) {
      console.error('Error sending data:', error);
      return false;
    }
  };

  const userLogin = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5114/api/Users/LoginUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      ClearStorage();
      if (response.ok) {
        const userData = await response.json();
        console.log("Get data", userData);
        localStorage.setItem('userName', userData.firstName);
        localStorage.setItem('userEmail', userData.Email);
        setUser(userData);
        return userData;
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData);
        return false;
      }
    } catch (error) {
      console.error('Error sending data:', error);
      return false;
    }
  };
  const userRegister = async (firstName, lastName, email, password) => {
    try {
      const response = await fetch('http://localhost:5114/api/Users/RegisterUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });
      ClearStorage();
      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem('userName', userData.firstName);
        localStorage.setItem('userEmail', userData.Email);
        setUser({ email: userData.email, role: 'user' });
        return true;
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData);
        return false;
      }
    } catch (error) {
      console.error('Error sending data:', error);
      return false;
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, adminLogin, userLogin, userRegister, logout  }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};