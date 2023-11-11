import { Avatar, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import React, {  useState, useEffect} from 'react'
import {firebase} from './config';
import './Suggestions.css';
import CloseIcon from "@mui/icons-material/Close";



function Suggestions(props) {
  const [email,setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open,setOpen] = useState(false);
  const [users, setUsers] = useState([]);

  const handleOpen = () =>{
      setOpen(true);
  }

  const handleClose = () =>{
    setOpen(false);
  }

  const SwitchAccount = async(email,password)=>{
      try{
        const user = await firebase.auth().signInWithEmailAndPassword(email,password)
        if (user){
          alert("Login Successfull");
          setOpen(false);
        }else{
          alert("User does not exist")
        }
      }catch(error){
        alert(error.message)
        setOpen(true)
      }
  }

  useEffect(() => {
    const user_unsubscribe = firebase
      .firestore()
      .collection("users")
      .where("email", "!=", props.email)
      .onSnapshot((snapshot) => {
        setUsers(snapshot.docs.map((doc) => doc.data()));
      });

    return () => {
      user_unsubscribe();
    };
  }, [props.email]);

  return (
    <div className="users_wrapper">
      <div className="user_wrapper">
        <div className="user_dets_wrapper">
          <div className="user__image">
            <Avatar></Avatar>
          </div>
          <div className="user__name">
            <div className="username">{props.usern}</div>
            <div className="user_name">{props.username}</div>
          </div>
          <div className="follow__btn">
            <button onClick={() => handleOpen()}>switch</button>
          </div>
        </div>
      </div>
      {users.map((user, index) => (
        <div key={index} className="user_wrapper">
          <div className="user_dets_wrapper">
            <div className="user__image">
              <Avatar></Avatar>
            </div>
            <div className="user__name">
              <div className="username">{user.username}</div>
              <div className="user_name">{user.name}</div>
            </div>
            <div className="follow__btn">
              <button>follow</button>
            </div>
          </div>
        </div>
      ))}

      <div>
        <Dialog open={open} onClose={() => handleClose()}>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", width: 400 }}
          >
            <CloseIcon
              style={{ alignSelf: "flex-end", marginLeft: 10 }}
              onClick={() => handleClose()}
            />
            <DialogTitle
              sx={{ display: "flex", flexDirection: "column", width: "100%" }}
            >
              <img
                src="Logo_Instagram.png"
                alt="logo"
                style={{ width: 150, height: 70, margin: "auto" }}
              />
            </DialogTitle>
            <TextField
              variant="filled"
              autoComplete="off"
              onChange={(val) => setEmail(val.target.value)}
              label="Email"
              type="email"
              margin="dense"
              sx={{ marginBottom: 3 }}
            />
            <TextField
              variant="filled"
              autoComplete="off"
              onChange={(val) => {
                setPassword(val.target.value);
              }}
              label="Password"
              type="password"
            />
          </DialogContent>
          <DialogContent></DialogContent>
          <DialogActions
            sx={{
              display: "flex",
              flexDirection: "column",
              marginTop: -7,
              padding: 5,
            }}
          >
            <button
              onClick={() => {
                SwitchAccount(email, password);
              }}
              className="login_btn"
              style={{
                width: 300,
                backgroundColor: "#00bfff",
                height: 40,
                border: "none",
                borderRadius: "12px",
              }}
            >
              Login
            </button>
            <button
              style={{
                border: "none",
                background: "none",
                marginTop: 10,
                color: "#00bfff",
              }}
            >
              forgot password?
            </button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default Suggestions

