const jwt = require('jsonwebtoken');

// 1. التحقق من تسجيل الدخول
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No Token Provided' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};

// 2. التحقق من الصلاحيات والـ Roles (Admin, Agent, Client)
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access Denied: You do not have permission' });
    }
    next();
  };
};

module.exports = { verifyToken, checkRole };