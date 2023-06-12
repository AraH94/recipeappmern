import express from "express";
import mongoose from "mongoose";
import { RecipeModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";

const router = express.Router();

router.get("/", async (req, res) => { // API request that returns all of the recipes that it can find in the database
	try {
		const response = await RecipeModel.find({}); // empty object, it should return all of the documents in that collection
		res.json(response);
	} catch (err) {
		res.json(err);
	}
});

router.post("/", async (req, res) => { // here we create a new recipe
	const recipe = new RecipeModel(req.body); // create a new recipe. Structure of how the model/data would look like
	try {
		const response = await recipe.save(); // 
		res.json(response);
	} catch (err) {
		res.json(err);
	}
});

router.put("/", async (req, res) => { // here we want to save recipes

	try {
		// { userId, recipeId } // userId: to find which user we want to change their saved recipes field, recipeId: to insert into that array
		const recipe = await RecipeModel.findById(req.body.recipeId)
		const user = await UserModel.findById(req.body.userId)
		user.savedRecipes.push(recipe); // we want to add this recipe
		await user.save(); // we want to save this recipe
		res.json({ savedRecipes: user.savedRecipes }); // return back the saved recipes
	} catch (err) {
		res.json(err);
	}
});

router.get("/savedRecipes/ids", async (req, res) => { // a list of all the recipeID's that the user, who's logged into at the moment, has saved
	try {
		const user = await UserModel.findById(req.body.userID)
		res.json({savedRecipes: user?.savedRecipes}); // put a ? since the request might be No
	} catch (err) {
		res.json(err);
	}
});

router.get("/savedRecipes", async (req, res) => { // route to get the saved recipes and not the ID's
	try {
		const user = await UserModel.findById(req.body.userID); // try to get a user
		const savedRecipes = await RecipeModel.find({ // going to find, we're going to query, for saved recipes. When we try to find them, we try to find them by ID
			_id: {$in: user.savedRecipes} // array of recipe ID's. We want to grab the savedRecipes where their _id is inside if this (see code 54) list
		});
		res.json({savedRecipes}); 
	} catch (err) {
		res.json(err);
	}
});


export { router as recipesRouter };

