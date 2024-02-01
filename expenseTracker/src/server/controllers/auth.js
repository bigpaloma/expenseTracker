import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

/*REGISTER USER*/

export const register = async (req, res) => {
    try {
        const {
            username,
            password,
            wallets,
            balance
        } = req.body.user;
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        req.body.user.password = passwordHash
        req.body.user.wallets = [{ name: wallets, balance: balance }]
        console.log(req.body.user)

        const newUser = new User(
            req.body.user
        );
        const savedUser = await newUser.save();
        console.log(savedUser, "savedUser")
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

/** LOGIN USER */
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });
        if (!user) return res.status(400).json({ msg: "User does not exist." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials." });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password
        res.status(500).json({ token, user })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}