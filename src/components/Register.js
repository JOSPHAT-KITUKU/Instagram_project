import React from 'react'
import { useNavigate } from 'react-router-dom';
import './Register.css'


function Register() {
  const navigate = useNavigate();
  return (
    <div className="register_outer">
      <button onClick={()=>{navigate("/")}}>Logout</button>
    </div>
  );
}

export default Register

