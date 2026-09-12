const Property = require('../models/property');

// 1. إضافة عقار جديد (لـ Agent و Admin فقط)
exports.createProperty = async (req, res) => {
  try {
    const { title, description, price, location, category } = req.body;

    const property = new Property({
      title,
      description,
      price,
      location,
      category,
      agent: req.user.id // يأخذ ID الوكيل التلقائي من الـ Token
    });

    await property.save();
    res.status(201).json({ message: 'Property created successfully', property });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. عرض جميع العقارات
exports.getProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate('agent', 'name email');
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. حذف عقار (صاحب العقار أو Admin فقط)
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    // التأكد إن اللي جاي يحذف هو صاحب العقار أو Admin
    if (property.agent.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }

    await property.deleteOne();
    res.json({ message: 'Property deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};