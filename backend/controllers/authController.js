const User = require('../models/User');
const jwt = require('jsonwebtoken');
const seedChapters = require('../utils/seedChapters');

const generateToken = (id, role) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is missing');
  }
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

const getFileUrl = (req, file) => {
  if (!file) return '';
  if (file.path.startsWith('http://') || file.path.startsWith('https://')) {
    return file.path;
  }
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}/uploads/${file.filename}`;
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, class: className } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'student',
      phone,
      class: className
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        class: user.class,
        avatar: user.avatar
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.adminRegister = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    const adminSecret = req.headers['x-admin-secret-key'] || req.body.adminSecretKey;
    if (!process.env.ADMIN_SECRET_KEY || adminSecret !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({ message: 'Forbidden: Invalid or missing Admin Secret Key' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'admin'
    });

    // Seed chapters immediately for this admin
    // await seedChapters(user._id);

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        class: user.class,
        avatar: user.avatar
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, class: className, password } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (className !== undefined) user.class = className;
    if (password) user.password = password;

    await user.save();

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      class: user.class,
      avatar: user.avatar
    });
  } catch (error) {
    next(error);
  }
};

exports.updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.avatar = getFileUrl(req, req.file);
    await user.save();

    res.json({ avatar: user.avatar });
  } catch (error) {
    next(error);
  }
};

exports.getTeacherProfile = async (req, res, next) => {
  try {
    const teacher = await User.findOne({ role: 'admin' }).select('name email phone avatar');
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher profile not found' });
    }
    res.json(teacher);
  } catch (error) {
    next(error);
  }
};

