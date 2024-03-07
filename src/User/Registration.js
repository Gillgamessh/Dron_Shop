import { useState } from 'react';
import Swal from 'sweetalert2';
import './style/Autorization.css';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Form() {
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const { userRegister } = useAuth();
  const history = useHistory();

  const handleName = (e) => {
    setName(e.target.value);
    setSubmitted(false);
  };

  const handleLastname = (e) => {
    setLastname(e.target.value);
    setSubmitted(false);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setSubmitted(false);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setSubmitted(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name === '' || lastname === '' || email === '' || password === '') {
      setError(true);
      showErrorAlert();
    } else {
      setSubmitted(true);
      setError(false);

      try {
        const registerSuccess = await userRegister(name, lastname, email, password);

        if (registerSuccess) {
          const { email, firstName } = registerSuccess;
          showSuccessAlert();
          history.push(`/User/Profile/${firstName}`); 
        } else {
          showErrorAlert();
        }
      } catch (error) {
        console.error('Error sending data:', error);
        showErrorAlert();
      }
    }
  };

  const showSuccessAlert = () => {
    Swal.fire({
      title: 'Registration Successful!',
      text: `User ${name} successfully registered.`,
      icon: 'success',
    });
  };

  const showErrorAlert = () => {
    Swal.fire({
      title: 'Error!',
      text: 'Something went wrong. Please try again.',
      icon: 'error',
    });
  };
  
    return (
      <div className="form">
        <form>
          <h1>Registration</h1>
          <input
            placeholder="firstname"
            onChange={handleName}
            className="input"
            value={name}
            type="text"
          />
          <input
            placeholder="lastname"
            onChange={handleLastname}
            className="input"
            value={lastname}
            type="text"
          />
          <input
            placeholder="email"
            onChange={handleEmail}
            className="input"
            value={email}
            type="email"
          />
          <input
            placeholder="password"
            onChange={handlePassword}
            className="input"
            value={password}
            type="password"
          />
          <div className="btn-container">
          <button onClick={handleSubmit} className="btn" type="submit">
            Submit
          </button>       
          <Link to="/User/Login">
          <button className="btn" >Sign In</button>
          </Link>
          </div>
        </form>
      </div>
    );
  }