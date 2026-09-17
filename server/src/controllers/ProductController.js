const Product = require('../models/Product');

exports.list = async (req, res) => {
  const { category, platform } = req.query;
  const filter = { isActive: true };
  if (category) filter.category = category;
  if (platform) filter.platform = platform;
  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(products);
};

exports.getBySlug = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true });
  if (!product) return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
  res.json(product);
};

// Admin/Owner only
exports.create = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

exports.update = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
  res.json(product);
};

exports.remove = async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ message: 'Đã ẩn sản phẩm' });
};
