var  bcrypt = require("bcryptjs");
const jwt= require('jsonwebtoken');

require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const app = express();


app.use(express.json());

module.exports = app;

const User = require("./model/user");

app.post("/register", async (req, res) => {
	try {
		const { first_name, last_name, email, password } = req.body;
		if (!(email && password && first_name && last_name)) {
		         res.status(400).send("All input is required");
		}
		const oldUser = await User.findOne({ email });
		if (oldUser) {
			return res.status(409).send("User Already Exist. Please Login");
		}
		const salt = await bcrypt.genSalt(10);
		encryptedPassword = await bcrypt.hash(password, salt);
		const user = await User.create({
		          first_name,
		          last_name,
		          email, // sanitize: convert email to lowercase
		          password: encryptedPassword,
		})
		const token = jwt.sign(
		          { user_id: user._id, email },
		          process.env.TOKEN_KEY,
		          {
			          expiresIn: "2h",
			  }
	        );
		user.token = token;
		res.status(201).json(user);

	} catch (err) {
		console.log(err);
	}

});

app.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!(email && password)) {
		          res.status(400).send("All input is required");
		}
		const user = await User.findOne({ email });
		    if (user && (await bcrypt.compare(password, user.password))) {
			          // Create token
			const token = jwt.sign(
				{ user_id: user._id, email },
		                process.env.TOKEN_KEY,
			                {
				                 expiresIn: "2h",
			                 }
			);
			user.token = token;
			res.status(200).json(user);
		    }
		    res.status(400).send("Invalid Credentials");
	} catch (err) {
		console.log(err);
	}

});

const auth = require("./middleware/auth");

app.post("/welcome", auth, (req, res) => {
	  res.status(200).send("Welcome 🙌 ");
});
