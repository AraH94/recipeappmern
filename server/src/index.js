import express from 'express'; // serves as a framework to create our API. Serves our front-end to create an API simply wiht node.js (library)
import cors from 'cors'; // allows you to set up the rules between the communication between the front- and back-end (library)
import mongoose from 'mongoose'; // database connection (mongodb) (library)

import {userRouter} from './routes/users.js';

const app = express();

app.use(express.json()); // when you get data from the front-end it will convert it to json
app.use(cors());

app.use("/auth", userRouter);

mongoose.connect("mongodb+srv://arahoedemakers:MERN123@recipes.9vnizkv.mongodb.net/recipes?retryWrites=true&w=majority");

app.listen(3002, () => console.log("SERVER STARTED!")); // tells our API to start listening on port 3002