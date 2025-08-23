const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Signup Controller
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role, membersCount, distanceFromCollege,foodPreference } = req.body;

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });
    if ((role === "student" || role === "staff") && !foodPreference) {
      return res.status(400).json({
        message: "Food preference is required for students and staff"
      });
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // prepare user data
    const userData = { name, email, password: hashedPassword, role,foodPreference };
    if (role === "ngo") {
      userData.membersCount = membersCount;
      userData.distanceFromCollege = distanceFromCollege;
    }
    if (role === "student"|| role === "staff") {
      userData.foodPreference = foodPreference;
    }
    // create user
    const newUser = await User.create(userData);
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Create user object without password
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      foodPreference: newUser.foodPreference,
      membersCount: newUser.membersCount,
      distanceFromCollege: newUser.distanceFromCollege,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt
    };

    res.status(201).json({ 
      message: "User registered successfully", 
      user: userResponse,
      token 
    });
    
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

// Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Create user object without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      foodPreference: user.foodPreference,
      membersCount: user.membersCount,
      distanceFromCollege: user.distanceFromCollege,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.json({ 
      message: "Login successful", 
      token, 
      user: userResponse 
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// Logout Controller
exports.logout = async (req, res) => {
  try {
    // In a stateless JWT setup, the client handles token removal
    // The server can't invalidate JWT tokens, but we can log the logout
    res.json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ message: "Logout failed", error: err.message });
  }
};
