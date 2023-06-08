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
});

router.post("/login", async (req, res) => {
	const { username, password } = req.body;
	const user = await UserModel.findOne({ username });

	if (!user) { // if we don't find the user, than the account doesn't exist
		return res.json({ message: "Username does not exist!" });
	}

	const isPasswordValid = await bcrypt.compare(password, user.password); // to compare hasshed password that the user entered

	if (!isPasswordValid) {
		return res.json({ message: "Invalid Username or Password!" });
	}

	const token = jwt.sign({ id: user._id }, "secret"); // secret: used to verify if the user is really authenticated
	res.json({ token, userID: user._id });
});

export { router as userRouter };