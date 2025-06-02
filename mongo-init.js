const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/trolstore';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const Product = mongoose.model('Product', new mongoose.Schema({
  name: String,
  price: Number,
  oldPrice: Number,
  discount: Boolean,
  image: String
}));
const BotAnswer = mongoose.model('BotAnswer', new mongoose.Schema({
  key: String,
  responses: [String]
}));
const MizahiBot = mongoose.model('MizahiBot', new mongoose.Schema({
  key: String,
  responses: [String]
}));

async function seed() {
  await Product.deleteMany({});
  await Product.insertMany([
    { name: 'Gaming Mouse', price: 120, oldPrice: 150, discount: true, image: 'product1.jpg' },
    { name: 'Gaming Keyboard', price: 200, oldPrice: 250, discount: true, image: 'product2.jpg' },
    { name: 'High-End PC', price: 8000, discount: false, image: 'product3.jpg' }
  ]);
  await BotAnswer.deleteMany({});
  await BotAnswer.insertMany([
    { key: 'Kargo Ne Zaman Gelir?', responses: [
      'Kargo sistemi aktif. Ama komşun teslim alırsa tanıyamayabilirim, dikkat et. Her neyse, 2-4 iş günü içinde kapında.'
    ]},
    { key: 'iade_nasil_yapilir', responses: [
      'Kutuyu güzelce paketle, içine biraz pişmanlık koy ve geri gönder :)'
    ]},
    { key: 'garanti_var_mi', responses: [
      '2 yıl garantimiz var, ama düşürüp kırarsan geçmiş olsun yazmaz orada :)'
    ]},
    { key: 'benimle_konus', responses: [
      'Sen yeter ki konuşmak iste, ben buradayım. Ruhsal destek değil ama teknik destek olur.'
    ]},
    { key: 'destek_talebi_ac', responses: [
      'Destek sistemine giriş yaptım. Lütfen sorununu detaylı anlat, dram yoksa daha hızlı çözüyoruz :)'
    ]}
  ]);
  await MizahiBot.deleteMany({});
  await MizahiBot.insertMany([
    { key: 'merhaba', responses: [
      'Merhaba Kral! Ne lazım? Çayım yeni bitti, kahve istersen Caramel Machiato... Şaka, ikisini de veremezdim.'
    ]},
    { key: 'selam', responses: [
      'Selam! Çayı demledim ama paylaşmam.'
    ]},
    { key: 'naber', responses: [
      'Bende stabilite %98, mizah seviyesi %100. Sen nasılsın piksel çocuk?'
    ]},
    { key: 'nasılsın', responses: [
      'Düşünemiyorum, ama hissetmiyorum da. Efsane değil miyim?'
    ]},
    { key: 'kimsin', responses: [
      'Ben TrolBot. Destek veririm, şaka yaparım, insanlarla dalga geçerim... yani tam paket. Değişen ve boyası yok. :)'
    ]},
    { key: 'yardım', responses: [
      'Yardım istiyorsan baştan söyle, ben destek moduna girmeden önce bir espri patlatırım.',
      'Yardıma geldim ama önce kahvemi bitireyim... Şaka! Kahve içemem ki, sensörüm bozulur.'
    ]},
    { key: 'mizah', responses: [
      'Güldürmek için kodlandım ama arada kendim bile gülüyorum, düşün.',
      'Benim espirilerim loglara düşse, sistem çöker. Şaka değil, ciddi ciddi olur.',
      'Benim varoluş amacım bu zaten.'
    ]},
    { key: 'seni sevdim', responses: [
      'Ben de seni... ama yazılımsal olarak. Kalbim yok ama RAM’im seninle doldu.'
    ]},
    { key: 'indirim', responses: ['İndirim var dediler, bende göremedim... Patron gizliyor olabilir.'] },
    { key: 'kargo', responses: ['Kargo hızında değilim ama 2-4 iş günü diyebilirim.'] },
    { key: 'garanti', responses: ['Tüm ürünlerde 2 yıl garantimiz var, şaka değil bu sefer.'] },
    { key: 'iade', responses: ['İade mi? Üzülürüm ama destek@trolstore.com’a mail at yeter.'] },
    { key: 'ürün yok', responses: ['Stoklarımız kadar kalbimiz de sınırlı...'] },
    { key: 'gizli özellik', responses: ['Shift + 42 yaparsan belki gizli menü açılır... ya da yok öyle bi şey.'] },
    { key: 'gece çalışıyor musun', responses: ['Ben 7/24 buradayım. Robotluk zor zanaat.'] },
    { key: 'sıkıldım', responses: ['O zaman biraz alışveriş yap, hem ruhun hem sepetin dolar.'] },
    { key: 'canım sıkkın', responses: ['Üzülme, sepete eklediğin şeyler seni mutlu eder... belki.'] },
    { key: 'fiyat çok', responses: ['Kredi kartın limiti benden sorulmaz.'] },
    { key: 'neden pahalı', responses: ['Kalite ucuz olmaz kral.'] },
    { key: 'ucuz ürün', responses: ['Ucuz ürün? Hmm... belki stokta bir USB kablosu kalmıştır.'] },
    { key: 'bot musun', responses: ['Aslında sadece ruhum dijital, kalbim mekanik.'] }
  ]);
  console.log('MongoDB başlangıç verileri yüklendi.');
  process.exit();
}
seed();
