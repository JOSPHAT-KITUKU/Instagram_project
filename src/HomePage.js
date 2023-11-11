
import './HomePage.css';
import React, { useEffect, useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import AddCircle from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import ExploreIcon from "@mui/icons-material/Explore";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import MessageIcon from "@mui/icons-material/Message";
import LogoutIcon from "@mui/icons-material/Logout";
import MarkUnreadChatAltIcon from "@mui/icons-material/MarkUnreadChatAlt";
import {
  Alert,
  AlertTitle,
  Avatar,
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EmojiPicker from "emoji-picker-react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";

import { firebase } from "./components/config";
import Post from "./components/Post";
import Suggestions from "./components/Suggestions";
import { useNavigate } from "react-router-dom";

function HomePage(props) {
  const [showAlert, setShowAlert] = useState(false);
  const [likes, setLikes] = useState(0);
  const [posts, setPost] = useState([]);
  const [open, setOpen] = useState(false);
  const [openemojis, setOpenEmojis] = useState(false);
  const [imag, setImage] = useState("");
  const [textareaText, setTextaraText] = useState("");
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [fetchedComents, setFetchedComments] = useState([]);

  useEffect(()=>{
    if (props.usedata){
      setUserData(
        { name: props.usedata.name, username: props.usedata.username,email:props.usedata.email}
      );

    }else{
       setUserData({
         name: null,
         username: null,
       });
    }
  },[props.usedata])


  const handleEmojiClick = (emoji) => {
    // Add the emoji to the textarea
    setTextaraText((prevText) => prevText + emoji.emoji);

    // Close the emoji picker dialog
    setOpenEmojis(false);
  };

  const handleTextChange = (e) => {
    setTextaraText(e.target.value);
  };

  const handleClickOpen = () => {
      setOpen(true);
  };

  const handleClickOpenEmojis = () => {
    setOpenEmojis(true);
  };

  const handleCloseEmoji = () => {
    setOpenEmojis(false);
  };


  const handlePost = async () => {
    setOpen(false);
    if (imag && textareaText) {

      const storageRef = firebase.storage().ref();
      const imageRef = storageRef.child(`images/${imag.name}`);
      await imageRef.put(imag);

      // 2. Get the download URL of the uploaded image
      const imageUrl = await imageRef.getDownloadURL();

      // 3. Post data to Firebase Firestore
      const newPost = {
        username: props.usedata.username, // Replace with the actual username
        ImageUrl: imageUrl,
        caption: textareaText,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      };

      // Replace 'posts' with your Firestore collection name
      await firebase.firestore().collection("posts").add(newPost);
    }

    setImage("");
    setTextaraText("");
  };
  const handleClose = () =>{
    setOpen(false);
  }
  // eslint-disable-next-line
  const handleClick = () => {
    setLikes(likes + 1);
  };

  useEffect(() => {}, [likes]);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("posts")
      .onSnapshot((snapshot) => {
        setPost(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });

    return () => {
      unsubscribe(); // Unsubscribe the snapshot listener when the component unmounts
    };
  }, []);

//fetching likes

useEffect(() => {
  const likesListener = firebase.firestore().collection("likes");

  const unsubscribe = posts.map(({ id }) => {
    return likesListener.where("post_id", "==", id).onSnapshot((snapshot) => {
      const likesCount = snapshot.size;
      setLikes((prevCounts) => ({ ...prevCounts, [id]: likesCount }));
    });
  });

  return () => {
    // Unsubscribe from all like count listeners
    unsubscribe.forEach((unsub) => unsub());
  };
}, [posts]);

//fecthing comments for individual post
useEffect(() => {
  const commsListener = firebase.firestore().collection("comments");

  const unsubscribe = posts.map(({ id }) => {
    return commsListener.where("post_id", "==", id).onSnapshot((snapshot) => {
      const commentData = snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      setFetchedComments((prevCounts) => ({
        ...prevCounts,
        [id]: commentData,
      }));
    });
  });

  return () => {
    // Unsubscribe from all like count listeners
    unsubscribe.forEach((unsub) => unsub());
  };
}, [posts]);

console.log(fetchedComents);
  return (
    <div className="Homepg">
      <div className="sidenav_btn_wrp">
        <img
          src="./Logo_Instagram.png"
          alt="Logo"
          style={{ width: 150, height: 70, marginTop: -80, marginBottom: 30 }}
        ></img>
        <div
          className="sidenav_btn_wrapper"
          onClick={() => {
            navigate("/home");
          }}
        >
          <div className="sidenav_icon">
            <HomeIcon
              color="primary"
              onClick={() => {
                navigate("/home");
              }}
            />
          </div>
          <div className="sidenav_btn">
            <button>Home</button>
          </div>
        </div>
        <div className="sidenav_btn_wrapper" onClick={() => setShowAlert(true)}>
          <div className="sidenav_icon">
            <SearchIcon color="primary" />
          </div>
          <div className="sidenav_btn">
            <button>Search</button>
          </div>
        </div>
        <div className="sidenav_btn_wrapper" onClick={() => setShowAlert(true)}>
          <div className="sidenav_icon">
            <ExploreIcon color="primary" />
          </div>
          <div className="sidenav_btn">
            <button>Explore</button>
          </div>
        </div>
        <div className="sidenav_btn_wrapper" onClick={() => setShowAlert(true)}>
          <div className="sidenav_icon">
            <VideoLibraryIcon color="primary" />
          </div>
          <div className="sidenav_btn">
            <button>Reels</button>
          </div>
        </div>
        <div className="sidenav_btn_wrapper" onClick={() => setShowAlert(true)}>
          <div className="sidenav_icon">
            <MessageIcon color="primary" />
          </div>
          <div className="sidenav_btn">
            <button>Messages</button>
          </div>
        </div>
        <div className="sidenav_btn_wrapper" onClick={() => setShowAlert(true)}>
          <div className="sidenav_icon">
            <Badge color="error" badgeContent="1">
              <MarkUnreadChatAltIcon color="primary" />
            </Badge>
          </div>
          <div className="sidenav_btn">
            <button>Notifications</button>
          </div>
        </div>
        {props.usedata ? (
          <div
            className="sidenav_btn_wrapper"
            onClick={() => handleClickOpen()}
          >
            <div className="sidenav_icon">
              <AddCircle color="primary" />
            </div>
            <div className="sidenav_btn">
              <button onClick={() => handleClickOpen}>Create</button>
            </div>
          </div>
        ) : (
          <div className="sidenav_btn_wrapper">
            <div className="sidenav_icon">
              <AddCircle color="primary" />
            </div>
            <div className="sidenav_btn">
              <button onClick={() => alert("Login to Post")}>Create</button>
            </div>
          </div>
        )}
        <div className="sidenav_btn_wrapper" onClick={() => setShowAlert(true)}>
          <div className="sidenav_icon">
            <Avatar></Avatar>
          </div>
          <div className="sidenav_btn">
            <button>Profile</button>
          </div>
        </div>
        <div className="sidenav_menubtn_wrapper">
          <div className="sidenav_icon">
            <MenuIcon color="primary" />
          </div>
          <div className="sidenav_btn">
            <button
              onClick={() => {setIsActive(!isActive)}}
            >
              More
            </button>
          </div>
        </div>
        {
          isActive?(

              <div className='popup__menu' >
                <div className='logout_btn'>
                  <div className='popup_icon'>
                      <LogoutIcon color='error' fontSize='small'/>
                  </div>
                  <div className='popup_btn'>
                    <button onClick={()=>{firebase.auth().signOut();
                    navigate("/");}}>Logout</button>
                  </div>
                </div>
              </div>
          ):(
            null
          )

        }
      </div>
      <div className="posts">
        {showAlert && (
          <Alert severity="success" onClose={() => setShowAlert(false)}>
            <AlertTitle>Home Button</AlertTitle>
            This is a Home alert.
          </Alert>
        )}

        <div>
          <Dialog open={open} onClose={handlePost} dividers>
            <DialogContent dividers style={{ display: "flex" }}>
              <div
                style={{
                  flex: 1,
                  height: 350,
                  width: 350,
                  alignContent: "center",
                  objectFit: "contain",
                  justifyContent: "center",
                }}
              >
                {imag ? (
                  <img
                    src={URL.createObjectURL(imag)}
                    alt="post"
                    style={{ width: 300, height: 300, marginTop: 20 }}
                  />
                ) : (
                  <div
                    onClick={() => {
                      document.querySelector(".img-upload").click();
                    }}
                    style={{
                      display: "flex",
                      alignContent: "center",
                      justifyContent: "center",
                      width: 300,
                      marginTop: 20,
                      height: 300,
                      border: "2px dashed lightgrey",
                    }}
                  >
                    <input
                      type="file"
                      className="img-upload"
                      onChange={(e) => setImage(e.target.files[0])}
                      hidden
                    />
                    <CloudUploadIcon
                      color="primary"
                      sx={{ margin: "auto" }}
                      fontSize="large"
                      onClick={() =>
                        document.querySelector(".img-upload").click()
                      }
                    />
                  </div>
                )}
              </div>
              <div style={{ flex: 2, marginLeft: "20px" }}>
                <textarea
                  className="txtarea"
                  value={textareaText}
                  placeholder="Type your caption here"
                  style={{
                    marginTop: 20,
                    minHeight: 300,
                    minWidth: 220,
                    border: "none",
                    fontFamily: "My Soul",
                    zIndex: 1,
                  }}
                  onChange={handleTextChange}
                ></textarea>
                <span>
                  <EmojiEmotionsIcon
                    onClick={handleClickOpenEmojis}
                    color="warning"
                    sx={{
                      marginTop: 37,
                      marginLeft: -5,
                      zIndex: 2,
                      position: "absolute",
                    }}
                  />
                </span>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button color="primary" onClick={handlePost}>
                Post
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        <div style={{ width: 100, height: 100 }}>
          <Dialog open={openemojis} onClose={handleCloseEmoji}>
            <DialogContent>
              <EmojiPicker
                height={300}
                width={400}
                onEmojiClick={handleEmojiClick}
              />
            </DialogContent>
          </Dialog>
        </div>
        {posts.map(({ id, post },index) => (
          <Post
            key={id}
            post_id={id}
            username={post.username}
            imag={post.ImageUrl}
            timestamp={post.timestamp}
            comment={post.caption}
            user_email={userData.email}
            likes={likes[id] || 0}
            user_username={userData.username}
            commentsData={fetchedComents}
          ></Post>
        ))}
      </div>
      <div className="suggests">
        <Suggestions
          username={userData.name}
          usern={userData.username}
          email={props.usedata.email}
        />
      </div>
    </div>
  );
}

export default HomePage;

