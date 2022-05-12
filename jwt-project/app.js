var bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

module.exports = app;

const User = require("./model/user");
const Game = require("./model/game");

app.post("/register", async (req, res) => {
    try {
        const {first_name, last_name, email, password} = req.body;
        if (!(email && password && first_name && last_name)) {
            res.status(400).send("All input is required");
        }
        const oldUser = await User.findOne({email});
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
            personnages: {}
        })
        const token = jwt.sign(
            {user_id: user._id, email},
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
        const {email, password} = req.body;
        if (!(email && password)) {
            res.status(400).send("All input is required");
        }
        const user = await User.findOne({email});
        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign(
                {user_id: user._id, email},
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
const e = require("express");

app.post("/createperso", auth, async (req, res) => {
    try {
        const {perso} = req.body
        const decoded = jwt.verify(req.headers["x-access-token"], process.env.TOKEN_KEY)
        const email = decoded.email
        const user = await User.findOne({email})
        const nom = perso.nom.toString()
        user.personnages.set(nom, perso)
        user.save()
        res.status(201).send("perso créé")
    } catch (e) {
        console.log(e.message)
    }
})

app.post("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome");
});

app.get("/allperso", auth, async (req, res) => {
    try {
        const decoded = jwt.verify(req.headers["x-access-token"], process.env.TOKEN_KEY)
        const email = decoded.email
        const user = await User.findOne({email})
        res.status(200).send(user.personnages)
    } catch (e) {
        console.log(e.message)
    }
})

app.post("/creategame", auth, async (req, res) => {
    try {
        const {titre} = req.body
        const decoded = jwt.verify(req.headers["x-access-token"], process.env.TOKEN_KEY)
        const id = decoded.user_id
        const game = await Game.create({
            titre,
        })
        game.participants.push(id)
        game.save()
        res.status(200).json(game);
    } catch (e) {
        console.log(e)
    }
})

app.get("/allgames", auth, async (req, res) => {
    const games = await Game.find()
    res.status(200).send(games)
})

app.get("/onegame", auth, async (req, res) => {
    try {
        const id = req.query['0']
        const game = await Game.findById(id)
        res.status(200).send(game)
    } catch (e) {
        console.log(e)
    }
})

app.post("/joingame", auth, async (req, res) => {
    try {
        console.log(req)
        const id = req.query['0']
        participant = req.body.participant
        const game = await Game.findById(id)
        game.participants.push(participant)
        game.save()
        res.status(200).send(game)
    } catch (e) {
        console.log(e)
    }
})
