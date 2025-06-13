import type { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.js'; 
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'DRYJDJGDFGDFGDFGJDFGHFDCVDFHHKGFHNBDFBJUYKHJNDRFBHRTNYLYJHMNDFSBSDFBGJNGFVCBDCBFGNUGKMFHGMNFDNFCGN';

// ✅ Signup Controller
export const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email: email.toLowerCase(), password: hashedPassword });
    await newUser.save();

    // ✅ Generate JWT token after successful signup
    const token = jwt.sign({ userId: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });

    // ✅ Return token in response
    return res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error('Signup Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Login Controller
export const login = async (req: Request, res: Response, next: NextFunction) => { 
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    // ✅ Generate JWT token on login
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


//fixed controller