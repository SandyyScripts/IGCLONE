import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { db, storage } from "./firebase";
import firebase from "firebase";
import "./ImageUpload.css";

function ImageUpload({ username }) {
	const [caption, setCaption] = useState();
	const [progress, setProgress] = useState(0);
	const [image, setImage] = useState();
	function handleChange(e) {
		if (e.target.files[0]) {
			setImage(e.target.files[0]);
		}
	}

	function handleUpload(e) {
		const uploadTask = storage.ref(`images/${image.name}`).put(image);

		uploadTask.on(
			"state_changed",
			(snapshot) => {
				//progress bar
				const progress = Math.round(
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100
				);
				setProgress(progress);
			},
			(error) => {
				console.log(error);
				alert(error.message);
			},
			() => {
				//complete function
				storage
					.ref("images")
					.child(image.name)
					.getDownloadURL()
					.then((url) => {
						//post in db
						db.collection("posts").add({
							timestamp: firebase.firestore.FieldValue.serverTimestamp(),
							caption: caption,
							imageURL: url,
							username: username,
						});
						setProgress(0);
						setCaption("");
						setImage(null);
					});
			}
		);
	}
	return (
		<div className="imageupload">
			{progress > 0 ? <progress className="imageupload-progress" value={progress} max="100" /> : null}
			<input
				type="text"
				placeholder="Enter a caption..."
				value={caption}
				onChange={(e) => setCaption(e.target.value)}
			/>
			<input type="file" onChange={handleChange} />
			<Button onClick={handleUpload}>Upload</Button>
		</div>
	);
}

export default ImageUpload;
