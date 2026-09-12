const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// إنشاء حساب جديد (Register)
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // فحص هل الإيميل موجود سابقاً؟
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    // تشفير كلمة السر
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // إنشاء المستخدم
    user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'client' // التلقائي عميل
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// تسجيل الدخول (Login)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // التأكد من وجود المستخدم
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid Email or Password' });

    // مطابقة كلمة السر
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Email or Password' });

    // إنشاء Token للوفاء بالتسجيل
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};