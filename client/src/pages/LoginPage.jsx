
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);


  const {login}=useContext(AuthContext)
  const onSubmitHandler=(event)=>{
    event.preventDefault();
    if(currState==='Sign up' && !isDataSubmitted){
      setIsDataSubmitted(true)
      return;
    }
    login(currState==='Sign up'?'signup':'login',{fullName,email,password,bio})
  }


  return (
    <div className='min-vh-100 d-flex align-items-center justify-content-center' style={{backdropFilter: 'blur(20px)'}}>
      <div className="row w-100 justify-content-center align-items-center">
        <div className="col-md-4 text-center mb-4">
          <div style={{width: 'min(30vw, 250px)', margin: '0 auto'}}>
            <h1 className="display-4">EchoChat</h1>
          </div>
        </div>
        <div className="col-md-6 col-lg-4">
          <form className='border border-secondary p-4 rounded shadow-lg glass-effect' onSubmit={onSubmitHandler}>
            <h2 className='h3 text-white mb-4 d-flex justify-content-between align-items-center'>
              {currState}
              <span className='cursor-pointer'>→</span>
            </h2>
            
            {currState === 'Sign up' && !isDataSubmitted && (
              <input 
                type="text" 
                className='form-control mb-3' 
                placeholder='Full Name' 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required 
              />
            )}
            
            {!isDataSubmitted && (
              <>
                <input 
                  onChange={(e) => setEmail(e.target.value)} 
                  value={email} 
                  type="email" 
                  placeholder='Email Address' 
                  required 
                  className='form-control mb-3'
                />
                <input 
                  onChange={(e) => setPassword(e.target.value)} 
                  value={password} 
                  type="password" 
                  placeholder='Password' 
                  required 
                  className='form-control mb-3'
                />
              </>
            )}
            
            {currState === 'Sign up' && isDataSubmitted && (
              <textarea 
                onChange={(e) => setBio(e.target.value)} 
                value={bio} 
                rows={4} 
                className='form-control mb-3' 
                placeholder='Provide a short bio...' 
                required
              />
            )}
            
            <button type="submit" className='btn btn-primary w-100 mb-3'>
              {currState === 'Sign up' ? "Create Account" : "Login Now"}
            </button>
            
            <div className='d-flex align-items-center gap-2 mb-3'>
              <input type="checkbox" className="form-check-input"/>
              <p className="text-light small mb-0">Agree to the terms of use & privacy policy.</p>
            </div>
            
            <div className='text-center'>
              {currState === 'Sign up' ? (
                <p className='small text-light'>
                  Already have an account? 
                  <span 
                    className='text-primary cursor-pointer ms-1' 
                    onClick={() => setCurrState('Login')}
                  >
                    Login here
                  </span>
                </p>
              ) : (
                <p className='small text-light'>
                  Create an account 
                  <span 
                    className='text-primary cursor-pointer ms-1'
                    onClick={() => setCurrState('Sign up')}
                  >
                    Click here
                  </span>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
