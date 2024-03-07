import { useState } from 'react';
import './style/Autorization.css';
import Swal from 'sweetalert2';
import { Link , useHistory} from 'react-router-dom';
import { useAuth } from '../AuthContext';


export default function Form() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const { userLogin } = useAuth(); 
  const history = useHistory();

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
    if (email === '' || password === '') {
      setError(true);
    } else {
      setSubmitted(true);
      setError(false);

      try {
        const loginSuccess = await userLogin(email, password);

        if (loginSuccess) {
          const { email, firstName } = loginSuccess;
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
      title: 'Login Successful!',
      text: 'You have successfully logged in.',
      icon: 'success',
    });
  };

  const showErrorAlert = () => {
    Swal.fire({
      title: 'Error!',
      text: 'Invalid email or password. Please try again.',
      icon: 'error',
    });
  };
    return (
        <div className="form">
            <form>
                <h1>Login</h1>
                <input placeholder='email' onChange={handleEmail} className="input"
                    value={email} type="email" />
                <input placeholder = 'password' onChange={handlePassword} className="input"
                    value={password} type="password" />
                <div className="btn-container">
                <button onClick={handleSubmit} className="btn"
                        type="submit">
                    Submit
                </button>
                <Link to="/User/Registration">
                    <button className="btn">Registration</button>
                    </Link>
                </div>
            </form>
        </div>
    );
}
