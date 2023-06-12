import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "recipes" }], // array of recipes that you save
});

export const UserModel = mongoose.model("users", UserSchema); // this users is the same collection name as mongodb compass