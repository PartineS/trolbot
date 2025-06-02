const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/trolstore', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String
});
const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  oldPrice: Number,
  discount: Boolean,
  image: String
});
const CartSchema = new mongoose.Schema({
  username: String,
  items: [{ name: String, price: Number }]
});
const BotAnswerSchema = new mongoose.Schema({
  key: String,
  responses: [String]
});
const MizahiBotSchema = new mongoose.Schema({
  key: String,
  responses: [String]
});
const SupportRequestSchema = new mongoose.Schema({
  username: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Product = mongoose.model('Product', ProductSchema);
const Cart = mongoose.model('Cart', CartSchema);
const BotAnswer = mongoose.model('BotAnswer', BotAnswerSchema);
const MizahiBot = mongoose.model('MizahiBot', MizahiBotSchema);
const SupportRequest = mongoose.model('SupportRequest', SupportRequestSchema);

app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) res.json({ success: true });
  else res.status(401).json({ success: false });
});
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});
app.get('/api/cart/:username', async (req, res) => {
  const cart = await Cart.findOne({ username: req.params.username });
  res.json(cart || { username: req.params.username, items: [] });
});
app.post('/api/cart/:username', async (req, res) => {
  const { items } = req.body;
  let cart = await Cart.findOne({ username: req.params.username });
  if (!cart) cart = new Cart({ username: req.params.username, items });
  else cart.items = items;
  await cart.save();
  res.json(cart);
});
app.get('/api/botanswers', async (req, res) => {
  const answers = await BotAnswer.find();
  res.json(answers);
});
app.get('/api/mizahibot', async (req, res) => {
  const mizahi = await MizahiBot.find();
  res.json(mizahi);
});

const { OpenAI } = require('openai');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
let openai = null;
if (OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: OPENAI_API_KEY });
}

app.post('/api/ai-chat', async (req, res) => {
  if (!openai) return res.status(500).json({ error: 'AI API anahtarı tanımlı değil.' });
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Mesaj gerekli.' });
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Sen mizahi, eğlenceli ve kısa cevaplar veren bir e-ticaret destek botusun. Cevapların Türkçe ve esprili olsun.' },
        { role: 'user', content: message }
      ],
      max_tokens: 100
    });
    const aiReply = completion.choices[0].message.content;
    res.json({ reply: aiReply });
  } catch (e) {
    res.status(500).json({ error: 'AI yanıtı alınamadı.' });
  }
});
app.post('/api/support', async (req, res) => {
  try {
    const { username, message } = req.body;
    if (!message) return res.status(400).json({ success: false, error: 'Mesaj gerekli.' });
    // log ekle
    console.log('Destek talebi alındı:', { username, message });
    const result = await SupportRequest.create({ username, message });
    console.log('Destek talebi MongoDB\'ye kaydedildi:', result);
    res.json({ success: true });
  } catch (e) {
    console.error('Destek talebi kaydedilemedi:', e); // hata logu
    res.status(500).json({ success: false, error: e.message });
  }
});
app.get('/api/support-test', async (req, res) => {
  try {
    const test = await SupportRequest.find().sort({ createdAt: -1 }).limit(5);
    res.json({ ok: true, data: test });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on port', PORT));
