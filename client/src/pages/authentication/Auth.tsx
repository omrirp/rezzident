import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logoicon2.svg';
import { toast } from 'react-toastify';
import useAccountStore from '../../store/useAccountStore';
import { createAccount, findByCredentials } from '../../services/accountServices';
import { spinner } from '../../utils/elements';

const Auth = () => {
  // ----- Global states -----
  const setAccount = useAccountStore((state) => state.setAccount);
  const navigate = useNavigate();
  // -----

  // ----- Local states -----
  // --- Input states
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');

  // --- UI manipulation states ---
  const [isLoading, setIsLoading] = useState(false);
  //const [errorMsg, setErrorMsg] = useState(null);
  const [isLoginView, setIsLoginView] = useState(true);
  // -----

  const loginHandler = async () => {
    setIsLoading(true);
    if (email !== '' && password !== '') {
      try {
        // Call log in request
        const account = await findByCredentials(email, password);
        // Set the logged in account data to account global state
        setAccount(account);
        setIsLoading(false);
        // Save the account details in the local storage
        localStorage.setItem('loggedInAccount', JSON.stringify(account));
        // Navigate to the main activity of the app
        navigate('/dashboard');
        toast.success(`Welcome back ${account.firstName}`);
      } catch (error) {
        setIsLoading(false);
        toast.error('Invalid credentials, please try again...');
      }
    } else {
      setIsLoading(false);
      toast.error('All inputs are required');
    }
  };

  const signUpHandler = async () => {
    setIsLoading(true);
    if (email !== '' && password !== '' && firstName !== '' && lastName !== '' && password === confirmedPassword) {
      const data = {
        email,
        firstName,
        lastName,
        password,
      };

      try {
        // Call sign up request
        const account = await createAccount(data);
        // Set the created account details to account global state
        setAccount(account);
        setIsLoading(false);
        // Save the account details in the local storage
        localStorage.setItem('loggedInAccount', JSON.stringify(account));
        // Navigate to the main activity of the app
        navigate('/dashboard');
        toast.success(`Glad to have you aboard ${account.firstName}`);
      } catch (error) {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      toast.error('All inputs are required');
    }
  };

  return (
    <div className='row'>
      <div className='col-lg-12' style={{ textAlign: 'center', marginTop: 20 }}>
        <img src={logo} className='logo-login' />
        <p className='logotext'>
          Rezzident <span style={{ fontWeight: '200' }}>management</span>
        </p>
      </div>
      <div className='col-lg-4'></div>
      <div className='col-lg-4 auth-container'>
        {isLoginView ? (
          <>
            <h1 className='page-title'>Welcome back</h1>
            <p className='context-white'>We are happy to see you again, please type your credential details to log in</p>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='form-control'
              placeholder='Email address'
            />
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='form-control'
              placeholder='Password'
            />
            {isLoading ? (
              <>{spinner}</>
            ) : (
              <button onClick={loginHandler} className='btn btn-success'>
                Login
              </button>
            )}
            <button className='btn btn-link' onClick={() => setIsLoginView(false)}>
              Don't have an account yet? <b>Create an account here</b>
            </button>
          </>
        ) : (
          <>
            <h1 className='page-title'>Welcome aboard</h1>
            <p className='context-white'>
              You have come to the right place to manage your real estate assets. Register now to start the journey to organize and manage
              your real estate.
            </p>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='form-control'
              placeholder='Email address'
            />
            <input
              type='text'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className='form-control'
              placeholder='First name'
            />
            <input
              type='text'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className='form-control'
              placeholder='Last name'
            />
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='form-control'
              placeholder='Password'
            />
            <input
              type='password'
              value={confirmedPassword}
              onChange={(e) => setConfirmedPassword(e.target.value)}
              className='form-control'
              placeholder='Confirm Password'
            />
            {isLoading ? (
              <div style={{ width: '100%', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className='spinner-border text-danger' role='status'>
                  <span className='visually-hidden'>Loading...</span>
                </div>
              </div>
            ) : (
              <button onClick={signUpHandler} className='btn btn-success'>
                Sign Up
              </button>
            )}

            <button className='btn btn-link' onClick={() => setIsLoginView(true)}>
              Back to login
            </button>
          </>
        )}
      </div>
      <div className='col-lg-4'></div>
      <div className='col-lg-12' style={{ textAlign: 'center', marginTop: 20 }}>
        <p className='credit'>&copy; Rezzident 2024 | Real Estate Management</p>
      </div>
    </div>
  );
};

export default Auth;
