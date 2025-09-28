import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import dotenv from "dotenv";
dotenv.config();
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // validation
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All feilds are required!" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // check if email is valid : regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findOne({ email });
    if (user)
      return res.status(400).json({ message: "Email has already exist" });
    // hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      const savedUser = await newUser.save(); // save it in the database
      generateToken(savedUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });

      // to do :  send a welcome email to the user
      try {
        await sendWelcomeEmail(
          savedUser.email,
          savedUser.fullName,
          process.env.CLIENT_URL
        );
      } catch (error) {
        console.error("faild to send welcome email: ", error);
      }
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller");
    res.status(500).json({ message: "Enternal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if(!email || !password){
    return res.status(400).json({message:"Email and password are required"})
  }


  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });
    // never tell the client which one is not correct

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid Credentials" });

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {

    console.error("error in login controller", error)
    res.status(500).json({message:"Internal Server Error"})
  }
};

export const logout =  (_, res) => {

  res.cookie("jwt","",{maxAge:0}) // jwt same in the utils
  res.status(200).json({message:"Logged out succesffully"})
};
