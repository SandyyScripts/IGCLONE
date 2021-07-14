import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import { db, auth } from "./firebase";
import { Modal, Button, Input } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ImageUpload from "./ImageUpload";
import InstagramEmbed from "react-instagram-embed";

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
				const items = [];
				snapshot.forEach((doc) => {
					items.push({ id: doc.id, post: doc.data() });
					// console.log(doc.data())
				});
				setPosts(items);
				// setPosts(
				// 	snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
				// );
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
					{posts.map(({ id, post }) => {
						return (
							<Post
								key={id}
								user={user}
								postId={id}
								username={post.username !== null ? post.username : "Null"}
								caption={post.caption}
								imageURL={post.imageURL}
							/>
						);
					})}
					<InstagramEmbed
						url="https://instagr.am/p/Zw9o4/"
						clientAccessToken="546966769662781|fcb35ff848bbd9cda98ab3e781675e5d"
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
				</div>
				{/* <div className="app__postright">
					
				</div> */}
			</div>

			{user ? (
				<ImageUpload
					username={user.displayName ? user.displayName : username}
				/>
			) : (
				<h3>Sorry you need to SignIn or SignUp to upload</h3>
			)}
		</div>
	);
}

export default App;
