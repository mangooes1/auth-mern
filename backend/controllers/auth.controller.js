import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "../utils/generateVerificationCode.js";

export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }

    const userAlreadyExists = await User.findOne({ email });

    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPasword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationToken();

    const user = new User({
      email,
      password: hashedPasword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, //24hrs
    });

    await user.save();

    generateTokenAndSetCokkie(res,user._id);  
    res.status(201).json({
        success:true,
        message:"User Created successfully",
        user: {
           ...user,_doc,
           password: undefined
        }
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  res.send("login route");
};

export const logout = async (req, res) => {
  res.send("logout route");
};
