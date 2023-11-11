import React, { useState } from 'react'
import './ImageUpload.css';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

function ImageUpload() {
    const [pic, setPic] = useState();
    const [caption, setCaption] = useState('');

    const handleChange = (e) => {
        setPic(URL.createObjectURL.file[0]);
    }
  return (
    <div className="upload">
      <form>
        <div className="image_area">
          <input
            className="textbox"
            type="text"
            placeholder="Enter caption here"
            style={{ height: "20vh", width: "20vw" }}
          ></input>
          <input type="file" onChange={handleChange} />
        </div>
        <CloudUploadIcon color="secondary"/>
      </form>
    </div>
  );
}

export default ImageUpload

