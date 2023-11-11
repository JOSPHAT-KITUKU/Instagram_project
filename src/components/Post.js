import React, { useState, useEffect } from "react";
import { Avatar, Badge, Input } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SendIcon from "@mui/icons-material/Send";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";

import {firebase} from './config';
import './Post.css';

function Post(props) {
  const [open, setOpen] = useState(false);
  const [comment,setComment] = useState("");

  const [likedPost, setLikedPost] = useState(false);
  const [timeAgo, setTimeAgo] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleComment = async(comment) =>{
    try{
      const comment_contents = {
        post_id:props.post_id,
        user_email:props.user_email,
        user_name:props.user_username,
        comment:comment,
        timestamp:firebase.firestore.FieldValue.serverTimestamp()
      }
      await firebase.firestore().collection("comments").add(comment_contents)
      setComment("");
    }catch(error){
      console.log("Unable to post a comment error!!!"+error)
      alert("Unable to Comment"+error.message);
    }
  }




  const likeClick = async() => {
    try{
      setLikedPost(!likedPost);
      const liked = await firebase
        .firestore()
        .collection("likes")
        .where("user_email", "==", props.user_email)
        .where("post_id", "==", props.post_id)
        .get()

      if (liked.empty){
        const likeData = {
          username:props.user_username,
          user_email:props.user_email,
          post_id: props.post_id,
          timestamp:firebase.firestore.FieldValue.serverTimestamp()
        };
        await firebase.firestore().collection("likes").add(likeData);
      }else{
       await firebase.firestore().collection("likes").doc(liked.docs[0].id).delete();
      }
    }catch(error){
      alert("Not liked due "+error.message)
    }
  };
  useEffect(()=>{
    document.addEventListener('keydown', clickedKey,true);
  })

  const clickedKey = (e) =>{

    if (e.key.toLowerCase() === 'enter' && comment.length > 0){
      setPostEvent(true);
    }
  }
  //setting color when like exists
  useEffect(()=>{
    const fetchlikes = async() =>{
      try{
        const liked = await firebase.firestore().collection("likes")
        .where("user_email", "==", props.user_email)
        .where("post_id","==",props.post_id)
        .get()

        if (liked.docs.length !== 0){
          setLikedPost(true);
        }

      }catch(error){
        console.log("Error in Fecthing likes for color management " + error)
      }
    }

    fetchlikes()
  },[props.user_email,props.post_id])


  //fetching and calculating timestamps of a post
 useEffect(() => {
   if (props.timestamp) {
     let timestamp;
     if (props.timestamp.toDate) {
       // Convert Firestore Timestamp to JavaScript Date
       timestamp = props.timestamp.toDate();
     } else if (typeof props.timestamp === "string") {
       // Parse string timestamp (e.g., "2023-01-01T12:00:00Z")
       timestamp = new Date(props.timestamp);
     } else if (props.timestamp instanceof Date) {
       // Already a Date object
       timestamp = props.timestamp;
     } else {
       console.error("Unsupported timestamp format");
       return;
     }

     // Calculate the time difference
     const now = new Date();
     const diff = now - timestamp;

     // Convert the time difference to a user-friendly string
     const minutes = Math.floor(diff / 60000);
     if (minutes < 1) {
       setTimeAgo("Just now");
     } else if (minutes < 60) {
       setTimeAgo(`${minutes} min ago`);
     } else {
       const hours = Math.floor(minutes / 60);
       if (hours < 24) {
         setTimeAgo(`${hours} hr ago`);
       } else {
         const days = Math.floor(hours / 24);
         setTimeAgo(`${days} d ago`);
       }
     }
   }
 }, [props.timestamp]);

  return (
    <div>
      <div className="post">
        <div className="top">
          <div className="user_det">
            <div style={{ marginRight: "10px" }}>
              <Avatar color="primary" alt="U">
                {props.username[0]}
              </Avatar>
            </div>
            <strong>
              <div className="post__username">{props.username}</div>
            </strong>
            <div className="post__timestamp">{timeAgo}</div>
          </div>
          <div className="">
            <MoreHorizIcon />
          </div>
        </div>

        <img
          src={props.imag}
          alt="post made not loaded"
          className="post__image"
        />

        <div className="like_bts">
          <div className="lft_btn">
            <div>
              <Badge color="secondary" badgeContent={0}>
                {likedPost ? (
                  <FavoriteIcon
                    color="error"
                    onClick={() => {
                      likeClick();
                    }}
                  />
                ) : (
                  <FavoriteBorderOutlinedIcon
                    color="primary"
                    onClick={() => {
                      likeClick();
                    }}
                  />
                )}
              </Badge>
            </div>
            <div>
              <ModeCommentOutlinedIcon
                color="action"
                onClick={() => {
                  handleClickOpen();
                }}
              />
            </div>
            <div>
              <SendIcon color="action"  />
            </div>
          </div>
          <div className="rgt_btn">
            <BookmarkBorderOutlinedIcon color="action" />
          </div>
        </div>
        <div className="post__likes">
          <p>
            <strong>{props.likes}</strong> likes
          </p>
        </div>
        <div className="post__comment">
          <strong>{props.username}</strong>: {props.comment}
        </div>
        {Object.keys(props.commentsData).map((postId) => (
          <div key={postId} className="comments__fetched">
            {props.commentsData[props.post_id].map((comm) => (
              <div key={props.post_id} className="comment_dt">
                {comm.data.comment}
                {comm.data.user_name}
              </div>

            ))}
          </div>
        ))}
        <div className="comment_inpt">
          <Input
            sx={{ width: "100%" }}
            value={comment}
            placeholder="Add comment here"
            onChange={(comment) => {
              setComment(comment.target.value);
            }}
          ></Input>
          <button
            id="post"
            className="post_comment_btn"
            onClick={() => {
              handleComment(comment);
            }}
          >
            Post
          </button>
        </div>
      </div>

      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth
          maxWidth="md"
          dividers
        >
          <DialogContent>
            <div className="comment_wrapper">
              <div className="comment_img">
                <img
                  src={props.imag}
                  alt="post"
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
              <div className="comment_dets__">
                <div className="user_prof">
                  <p>username</p>
                </div>
                <div className="comments__">
                  <p>I have comment this pic</p>
                  <p>I have comment this pic</p>
                </div>
                <div className="comment__">
                  <input
                    className="textarea__"
                    type="text"
                    placeholder="Type your comment here"
                  />
                  <button className="post_btn__">Post</button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default Post;
