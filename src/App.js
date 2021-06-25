import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import { db, auth } from "./firebase";
import { Modal, Button, Input } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ImageUpload from "./ImageUpload";
// import InstagramEmbed from "react-instagram-embed";

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
	};
}

const useStyles = makeStyles((theme) => ({
	paper: {
		position: "absolute",
		width: 400,
		backgroundColor: theme.palette.background.paper,
		border: "2px solid #000",
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
}));

function App() {
	const classes = useStyles();
	const [modalStyle] = useState(getModalStyle);
	const [posts, setPosts] = useState([]);
	const [open, setOpen] = useState(false);
	const [openSignin, setOpenSignin] = useState(false);
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [user, setUser] = useState(null);
	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((authUser) => {
			if (authUser) {
				//User is logged in
				console.log(authUser);
				setUser(authUser);
			} else {
				// user logged out
				setUser(null);
			}
		});
		return () => {
			// perform some cleanup actions...
			unsubscribe();
		};
	}, [user, username]);

	useEffect(() => {
		db.collection("posts")
			.orderBy("timestamp", "desc")
			.onSnapshot((snapshot) => {
				const temp = [];
				snapshot.forEach((doc) => {
					temp.push({ id: doc.id, post: doc.data() });
				});
				console.log(temp);
					setPosts(temp);
			});
	}, []);
	function signUp(e) {
		e.preventDefault();
		auth
			.createUserWithEmailAndPassword(email, password)
			.then((authuser) => {
				return authuser.user.updateProfile({
					displayName: username,
				});
			})
			.catch((error) => alert(error.message));
		setOpen(false);
	}
	function signIn(e) {
		e.preventDefault();
		auth
			.signInWithEmailAndPassword(email, password)
			.catch((error) => alert(error.message));
		setOpenSignin(false);
	}
	console.log(user);
	return (
		<div className="App">
			<Modal open={open} onClose={() => setOpen(false)}>
				<div className={classes.paper} style={modalStyle}>
					<form className="app__signup">
						<center>
							<img
								className="app__headerImage"
								src="http://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
								alt="Instagram-logo"
							/>
						</center>
						<Input
							placeholder="Username"
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
						<Input
							placeholder="Email"
							type="text"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<Input
							placeholder="Password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<Button type="submit" onClick={signUp}>
							Sign Up
						</Button>
					</form>
				</div>
			</Modal>
			<Modal open={openSignin} onClose={() => setOpenSignin(false)}>
				<div className={classes.paper} style={modalStyle}>
					<form className="app__signup">
						<center>
							<img
								className="app__headerImage"
								src="http://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
								alt="Instagram-logo"
							/>
						</center>
						<Input
							placeholder="Email"
							type="text"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<Input
							placeholder="Password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<Button type="submit" onClick={signIn}>
							Sign In
						</Button>
					</form>
				</div>
			</Modal>
			<div className="app__header">
				<img
					className="app__headerImage"
					src="http://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
					alt="Instagram-logo"
				/>
				{user ? (
					<Button onClick={() => auth.signOut()}>Log Out</Button>
				) : (
					<div className="app__loginContainer">
						<Button onClick={() => setOpenSignin(true)}>Sign In</Button>
						<Button onClick={() => setOpen(true)}>Sign Up</Button>
					</div>
				)}
			</div>

			<div className="app__posts">
				<div className="app__postleft">
					{posts.map(({ id, post }) => (
						<Post
							key={id}
							user={user}
							postId={id}
							username={post.username}
							caption={post.caption}
							imageURL={post.imageURL}
						/>
					))}
				</div>
				{/* <div className="app__postright">
					<InstagramEmbed
						url="https://www.instagram.com/p/CQgkIXtNnPQ/"
						maxWidth={320}
						hideCaption={false}
						containerTagName="div"
						protocol=""
						injectScript
						onLoading={() => {}}
						onSuccess={() => {}}
						onAfterRender={() => {}}
						onFailure={() => {}}
					/>
				</div> */}
			</div>

			{user ? (
				<ImageUpload username={user.displayName} />
			) : (
				<h3>Sorry you need to login to upload</h3>
			)}
		</div>
	);
}

export default App;
//npm i react-instagram-embed
