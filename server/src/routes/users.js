import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserModel } from '../models/Users.js';

const router = express.Router();

router.post("/register", async (req, res) => { // req: used for getting data from whoever made the api request, res: send data to whoever made the api request
	const { username, password } = req.body;
	const user = await UserModel.findOne({ username }); // making a request to the UserModel collection

	if (user) {
		return res.json({ message: "Username already exists!" });
	}

	const hashedPassword = await bcrypt.hash(password, 10); // number influences the hashing process of the password
	const newUser = new UserModel({ username, password: hashedPassword });
	await newUser.save();

	res.json({ message: "User Registered Successfully!" });

	res.json(user);
});

router.post("/login", async (req, res) => {
	const { username, password } = req.body;
	const user = await UserModel.findOne({ username });

	if (!user) { // if we don't find the user, than the account doesn't exist
		return res.json({ message: "Username does not exist!" });
	}

	const isPasswordValid = await bcrypt.compare(password, user.password); // to compare hashed password that the user entered

	if (!isPasswordValid) {
		return res.json({ message: "Invalid Username or Password!" });
	}

	const token = jwt.sign({ id: user._id }, "secret"); // secret: used to verify if the user is really authenticated
	res.json({ token, userID: user._id });
});

export { router as userRouter };

// When we make an API request, we want to authenticate the token that you have. We do this by creating a middleware, which is a function that will run before each request. It will verify if your token you're sending from the front-end matches the token that you should be sending. In this case the middleware will be the token
export const verifyToken = (req, res, next) => { // next will be used to authorize the request to continue
	const token = req.headers.authorization; // in the front-end we have to send the header with the authorization key
	if (token) {
		jwt.verify(token, "secret", (err) => { // this "secret" has to match the "secret" at line 37
			if (err) return res.sendStatus(403); // 403 status = this user is not authorized. If the token is wrong
			next(); // if there are no errors then we should allow the user to continue with their request
		})
	} else {
		res.sendStatus(401); // if we don't send a token from the front-end we're sending back a 401
	}
};

// import express from "express";
// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcrypt';
// import {UserModel} from "../models/Users.js";

// const router = express.Router();

// router.post("/register",async(req,res) => {
//     const {username, password} = req.body;
//     const user = await UserModel.findOne({username})
//     if(user) {
//         return res.json({message: "User already exists!"})
//     }
//     const hashedPassword = await bcrypt.hash(password,10);
//     const newUser = new UserModel({username, password:hashedPassword});
//     await newUser.save();
//     res.json({message: "User Registered Successfully"})

//     res.json(user)
// })

// router.post("/login",async(req,res) => {
//     const {username, password} = req.body;
//     const user = await UserModel.findOne({username})
//     if(!user) {
//         return res.json({message: "User Doesn't Exist!"})
//     }
   
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if(!isPasswordValid) {
//         return res.json({message: "Username or Password is incorrect!"})
//     }
//     const token = jwt.sign({id: user._id},"secret");
//     res.json({token, userID: user._id})
// })


// export {router as userRouter}


// export const verifyToken = (req,res,next) => {
//    const token = req.headers.authorization; 
//    if(token) {
//        jwt.verify(token,"secret",(err)=>{
//         if (err) return res.sendStatus(403);
//         next();
//        }) 
//    }else {
//     res.sendStatus(401);
//    }
// }