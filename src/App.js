import React, { useEffect, useState } from 'react'
import {Routes, Route, Link, Navigate} from 'react-router-dom';
import HomePage from './HomePage';
import Register from './components/Register';
import {firebase} from './components/config';
import Login from './components/Login';
import { useNavigate } from 'react-router-dom';


function App() {

  const [userData, setUserData] = useState(null)

  useEffect(()=>{
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser)=>{
      if (authUser){


      const FetchData = async() =>{
        try{
          const useData = await firebase.firestore().collection("users").doc(authUser.uid).get()

          if (useData.exists){
            setUserData(useData.data());
          }else{
            setUserData(null);
            console.log("User Data does not exist.");
          }
        }catch(error){
          console.log("Error in fetching data,"+error);
        }
      }
      FetchData();
    }
    });
    return ()=>{
      unsubscribe()
    }
  },[])

  if (!userData){
    return(
      <Routes>
        <Route path='/' element={<Login/>}/>
      </Routes>
    )
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<HomePage usedata={userData} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App

