const express = require('express');
const router = express.Router();
const { createProperty, getProperties, deleteProperty } = require('../controllers/propertyController');
const { verifyToken, checkRole } = require('../middleware/auth');

// رؤية كل العقارات (متاحة للجميع)
router.get('/', getProperties);

// إضافة عقار (يحتاج تسجيل دخول + دور agent أو admin)
router.post('/', verifyToken, checkRole(['agent', 'admin']), createProperty);

// حذف عقار (يحتاج تسجيل دخول + دور agent أو admin)
router.delete('/:id', verifyToken, checkRole(['agent', 'admin']), deleteProperty);

module.exports = router;