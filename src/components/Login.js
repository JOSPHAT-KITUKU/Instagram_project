import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { TextField } from "@mui/material";
import {firebase} from "./config";

 function Login() {
   const navigate = useNavigate();
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");

   const LoggingIn = async(email,password) =>{
    try{
        const user = await firebase.auth().signInWithEmailAndPassword(email,password)

        if (user){
            alert("Login Successful")
            navigate("/home")
        }else{
            alert("Wrong Details Entered")
            navigate("/");
        }
    }catch(error){
        navigate("/");
        console.log("Errors in Logging in, "+error)
    }
   }
   return (
     <div className="register_outer">
       <div className="image_wrappers">
         <div className="image_back">
           <img
             src="phone.png"
             alt="phone"
             style={{ width: 500, height: 500 }}
           />
         </div>

         <div className="image_front">
           <img
             src="phone_chat.png"
             alt="phone"
             style={{ width: 500, height: 500 }}
           />
         </div>
       </div>
       <div className="form1">
         <div className="reg_logo">
           <img src="Logo_instagram.png" alt="logo" />
         </div>
         <TextField
           label="email"
           variant="filled"
           autoComplete="off"
           onChange={(email)=>setEmail(email.target.value)}
           sx={{ width: "300px", height: "50px", marginBottom: "20px" }}
         ></TextField>
         <TextField
           label="password"
           variant="filled"
           autoComplete="off"
           type="password"
           onChange={(password)=>setPassword(password.target.value)}
           sx={{ width: "300px", height: "50px", marginBottom: "20px" }}
         ></TextField>
         <button
           className="reg_login"
           onClick={()=>LoggingIn(email,password)}
         >
           Sign in
         </button>
         <div className="div_lines">
           <hr className="line1"></hr>
           <p className="line_text">OR</p>
           <hr className="line1"></hr>
         </div>
         <div className="phone_login">
           <button>Click here to login with a phone</button>
           <button>Forgot Password</button>
         </div>

         <div className="create_account">
           <p>Don't have an account?</p>
           <button>Sign Up</button>
         </div>
       </div>
     </div>
   );
 }

 export default Login

