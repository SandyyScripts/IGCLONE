import React, { useState, useEffect } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from "./firebase";
import SendIcon from "@material-ui/icons/Send";
import firebase from "firebase";

function Post({ postId, user, username, caption, imageURL }) {
	const [comments, setComments] = useState([]);
	const [comment, setComment] = useState("");
	useEffect(() => {
		let unsubscribe;
		if (postId) {
			unsubscribe = db
				.collection("posts")
				.doc(postId)
				.collection("comments")
				.orderBy("timestamp", "desc")
				.onSnapshot((snapshot) => {
					setComments(snapshot.docs.map((doc) => doc.data()));
				});
		}
		return () => {
			unsubscribe();
		};
	}, [postId]);
	function postComment(e) {
		e.preventDefault();
		db.collection("posts").doc(postId).collection("comments").add({
			text: comment,
			username: user.displayName,
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
		});
		setComment("");
	}
	return (
		<div className="post">
			<div className="post__header">
				<Avatar
					className="post__avatar"
					alt={username}
					src="/static/images/avatar/1.jpg"
				/>
				<h3>{username}</h3>
			</div>

			<img className="post__image" src={imageURL} alt="Insta_Image" />
			<h4 className="post__text">
				<strong>{username}</strong> {caption}
			</h4>

			<div className="post__comments FixedHeightContainer">
				{comments.map((comment) => (
					<p> 
						<strong>{comment.username}</strong> {comment.text}
					</p>
				))}
			</div>

			{user && (
				<form className="post__commentBox">
					<input
						className="post__input"
						type="text"
						placeholder="Add a comment..."
						value={comment}
						onChange={(e) => setComment(e.target.value)}
					/>
					<button
						className="post__button"
						disabled={!comment}
						type="submit"
						onClick={postComment}
					>
						<SendIcon />
					</button>
				</form>
			)}
		</div>
	);
}

export default Post;
