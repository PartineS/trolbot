let chatVisible = false;
let total = 0;
let cartTotal = 0;
let userBalance = 32000; 
let botData = {};
let mizahiData = {};
const DEFAULT_BALANCE = 32000;//sabit bakiye

// bağlantı
const apiBase = window.location.origin.includes('localhost') ? 'http://localhost:5000' : '';
document.addEventListener("DOMContentLoaded", () => {
  updateCartDisplay();
  setupAddToCartButtons();
  loadBotData();
  loadMizahiData();
});

function loadBotData() {
  fetch('/api/botanswers')
    .then(response => response.json())
    .then(data => {
      botData = {};
      data.forEach(item => {
        botData[item.key] = item.responses;
      });
    })
    .catch(error => {
      console.error("Bot yanıt verileri yüklenemedi:", error);
    });
}

function loadMizahiData() {
  fetch('/api/mizahibot')
    .then(response => response.json())
    .then(data => {
      mizahiData = {};
      data.forEach(item => {
        mizahiData[item.key] = item.responses;
      });
    })
    .catch(error => {
      console.error("Mizahi yanıt verileri yüklenemedi:", error);
    });
}

function getCartFromStorage() {
  return JSON.parse(localStorage.getItem('cartItems') || '[]');
}
function setCartToStorage(cart) {
  localStorage.setItem('cartItems', JSON.stringify(cart));
}
function getBalanceFromStorage() {
  // Bakiye: 32.000 TL - sepetteki ürünlerin toplamı
  const cart = getCartFromStorage();
  const spent = cart.reduce((a, b) => a + (b.price || 0), 0);
  return DEFAULT_BALANCE - spent;
}
function setBalanceToStorage(_) {
}

function updateCartDropdown() {
  const cart = getCartFromStorage();
  const total = cart.reduce((a, b) => a + (b.price || 0), 0);
  const balance = getBalanceFromStorage();
  // tüm sayfalarda günceller
  const cartTotalEls = document.querySelectorAll('#cart-total-header');
  const balanceEls = document.querySelectorAll('#header-balance');
  cartTotalEls.forEach(el => el.textContent = (total > 0 ? total.toLocaleString('tr-TR') : '0') + '₺');
  // bakiye & kalan bakiye
  balanceEls.forEach(el => el.textContent = balance.toLocaleString('tr-TR') + '₺');
  if (typeof updateCartDetailPanel === 'function') updateCartDetailPanel();
}

function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (user === "kullanıcı" && pass === "123456EH") { 
    window.location.href = "index.html"; 
  } else {
    document.getElementById("loginError").textContent = "Yanlış kullanıcı girişi!"; 
  }
}

function toggleChat() {
  const chatBody = document.getElementById("chatBody");
  chatVisible = !chatVisible;
  chatBody.style.display = chatVisible ? "flex" : "none";
}

function sendMessage() {
  const userInput = document.getElementById("userInput").value;
  if (userInput.trim() !== "") {
    addMessage(userInput, 'user');
    document.getElementById("userInput").value = "";
    getBotResponse(userInput);
  }
}

function askQuestion(question) {
  addMessage(question, 'user');
  getBotResponse(question);
}

function updateCartDisplay() {
  const cartDisplay = document.getElementById("cart-info");
  if (cartDisplay) {
    cartDisplay.innerHTML = `
      <strong>Sepet:</strong> ${cartTotal.toLocaleString('tr-TR')}₺ |
      <strong>Bakiye:</strong> ${userBalance.toLocaleString('tr-TR')}₺
    `;
  }
}

function completeOrder() {
  alert("Siparişiniz başarıyla tamamlandı. Teşekkür ederiz!");
  total = 0;
  cartTotal = 0;
  document.getElementById('cart-total').textContent = 'Toplam: 0₺';
  document.getElementById('complete-order').style.display = 'none';
  updateCartDisplay();
}

function startConversation() {
  addMessage("Tabii! Nasıl yardımcı olabilirim?", 'bot');
}

function openTicket() {
  const ticketResponse = document.getElementById('ticket-response');
  ticketResponse.style.display = 'block';
  ticketResponse.textContent = "✅ Destek kaydı açıldı. En kısa sürede sizinle iletişime geçilecektir.";
}

function addToCart(productName, price) {
  const cart = getCartFromStorage();
  const balance = getBalanceFromStorage();
  if (balance >= price) {
    cart.push({ name: productName, price: price });
    setCartToStorage(cart);
    updateCartDropdown();
    updateCartDetailPanel && updateCartDetailPanel();
    alert(`${productName} sepete eklendi!`);
  } else {
    alert('Yetersiz bakiye!');
  }
}

//clone - clonenode
function setupAddToCartButtons() {
  const buttons = document.querySelectorAll('.add-to-cart');
  buttons.forEach(button => {
    const newBtn = button.cloneNode(true);
    button.parentNode.replaceChild(newBtn, button);
  });
  const freshButtons = document.querySelectorAll('.add-to-cart');
  freshButtons.forEach(button => {
    button.addEventListener('click', () => {
      const price = parseFloat(button.dataset.price);
      const name = button.dataset.name || 'Ürün';
      addToCart(name, price);
    });
  });
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

window.addEventListener('DOMContentLoaded', () => {
  updateCartDropdown();
  setupAddToCartButtons();
  loadBotData();
  loadMizahiData();
  document.body.addEventListener('click', function(e) {
    if (e.target && e.target.closest('.quick-questions button')) {
      const btn = e.target.closest('.quick-questions button');
      let btnText = btn.textContent.trim();

      //Türkçe karakterleri sadeleştirir
      let raw = btnText
        .toLocaleLowerCase('tr-TR')
        .replace(/ç/g, 'c')
        .replace(/ğ/g, 'g')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ş/g, 's')
        .replace(/ü/g, 'u')
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');

      const keyMap = {
        'iade_nasil_yapilir': 'iade_nasil_yapilir',
        'kargo_ne_zaman_gelir': 'Kargo Ne Zaman Gelir?',
        'siparisimi_nasil_iptal_ederim': 'siparisimi_nasil_iptal_ederim',
        'garanti_var_mi': 'garanti_var_mi',
        'benimle_konus': 'benimle_konus',
        'destek_talebi_ac': 'destek_talebi_ac'
      };

      // eşleşen bir anahtar varsa sadece butoncevaplari.json'dan cevap döndürür
      if (keyMap[raw]) {
        addMessage(btnText, 'user');
        const key = keyMap[raw];
        if (botData && botData[key]) {
          const responses = botData[key];
          addMessage(Array.isArray(responses) ? responses[0] : responses, 'bot');
        } else {
          addMessage('Şu anda cevap verilemiyor.', 'bot');
        }
        // eğer destek_talebi_ac ise popup aç (iade ile aynı mantık)
        if (raw === 'destek_talebi_ac') {
          showSiteAlert('Destek talebi açılıyor...', '#2d2dff');
          setTimeout(() => {
            createSupportPopup();
            document.getElementById('support-popup').style.display = 'flex';
            // mesaj kutusu boş kalacak
            document.getElementById('support-popup-msg').value = '';
          }, 900);
        }
        return;
      }

      // "iade nasıl yapılır" butonunu doğru yakalamak için, metni sadeleştirdik(emoji ile çözüldü)
      let normalizedBtn = btnText
        .toLocaleLowerCase('tr-TR')
        .replace(/ç/g, 'c')
        .replace(/ğ/g, 'g')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ş/g, 's')
        .replace(/ü/g, 'u')
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');

      let foundKey = null;
      if (botData && Object.keys(botData).length > 0) {
        for (let key in botData) {
          const normKey = normalizeText(key);
          if (normKey === normalizedBtn) {
            foundKey = key;
            break;
          }
        }
        addMessage(btnText, 'user');
        // destek talep buton
        if (normalizedBtn === 'destek_talebi_ac') {
          showSiteAlert('Destek talebi açılıyor...', '#2d2dff');
          setTimeout(() => {
            createSupportPopup();
            document.getElementById('support-popup').style.display = 'flex';
            // mesaj kutusu boş bırakılacak
            document.getElementById('support-popup-msg').value = '';
          }, 900);
          return;
        }
        // diğer butonlar
        if (foundKey) {
          const responses = botData[foundKey];
          if (Array.isArray(responses)) {
            addMessage(responses[0], 'bot');
          } else {
            addMessage(responses, 'bot');
          }
        } else if (
          normalizedBtn === 'benimle_konus' ||
          normalizedBtn === 'konus' ||
          normalizedBtn === 'merhaba' ||
          normalizedBtn === 'selam'
        ) {
          getMizahiResponse('merhaba');
        } else {
          getMizahiResponse(btnText);
        }
      } else {
        addMessage(btnText, 'user');
        getMizahiResponse(btnText);
      }
    }
    if (e.target && e.target.matches('.user-input button')) {
      submitQuestion();
    }
  });
  document.body.addEventListener('keydown', function(e) {
    if (e.target && e.target.id === 'userQuestion' && e.key === 'Enter') {
      submitQuestion();
    }
  });
  setupCartDetailPanelEvents();
});

function addMessage(message, sender) {
  const chatBody = document.getElementById("chatBody");
  if (!chatBody) return;
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);
  messageDiv.innerHTML = `<span class="msg-bubble">${message}</span>`;
  chatBody.appendChild(messageDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function replyBot(question) {
  addMessage(question, 'user');
  if (botData && Object.keys(botData).length > 0) {
    const normalizedQ = normalizeText(question);
    let foundKey = null;
    for (let key in botData) {
      if (normalizeText(key) === normalizedQ) {
        foundKey = key;
        break;
      }
    }
    if (!foundKey) {
      foundKey = Object.keys(botData)[0];
    }
    const responses = botData[foundKey];
    if (Array.isArray(responses)) {
      const randomIndex = Math.floor(Math.random() * responses.length);
      addMessage(responses[randomIndex], 'bot');
    } else {
      addMessage(responses, 'bot');
    }
  } else {
    addMessage('Bot cevap veremiyor, veri yüklenemedi.', 'bot');
  }
}

async function getAIResponse(userMessage) {
  try {
    const apiUrl = (window.location.origin + '/api/ai-chat').replace('file://', 'http://localhost:5000');
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage })
    });
    if (!response.ok) throw new Error('Yapay zeka yanıtı alınamadı: ' + response.status);
    const data = await response.json();
    if (data.reply) {
      addMessage(data.reply, 'bot');
    } else {
      addMessage('Yapay zeka botu şu anda yanıt veremiyor. (Boş yanıt)', 'bot');
    }
  } catch (e) {
    addMessage('Yapay zeka botu şu anda yanıt veremiyor. (' + e.message + ')', 'bot');
  }
}

function getMizahiResponse(question) {
  if (!mizahiData || Object.keys(mizahiData).length === 0) {
    addMessage('Mizahi bot cevap veremiyor, veri yüklenemedi.', 'bot');
    return;
  }
  const normalizedQ = normalizeText(question);
  let foundKey = null;
  for (let key in mizahiData) {
    if (normalizeText(key) === normalizedQ) {
      foundKey = key;
      break;
    }
  }
  if (foundKey) {
    const responses = mizahiData[foundKey];
    if (Array.isArray(responses)) {
      const randomIndex = Math.floor(Math.random() * responses.length);
      addMessage(responses[randomIndex], 'bot');
    } else {
      addMessage(responses, 'bot');
    }
  } else {
    // rastgele mizahi cevap döndürür(ancak key bulunamazsa, ancak hep buluyor)
    const allResponses = [];
    for (let key in mizahiData) {
      if (Array.isArray(mizahiData[key])) {
        allResponses.push(...mizahiData[key]);
      } else if (typeof mizahiData[key] === 'string') {
        allResponses.push(mizahiData[key]);
      }
    }
    if (allResponses.length > 0) {
      const randomIndex = Math.floor(Math.random() * allResponses.length);
      addMessage(allResponses[randomIndex], 'bot');
    } else {
      addMessage('Mizahi cevap bulunamadı.', 'bot');
    }
  }
}

function submitQuestion() {
  const input = document.getElementById('userQuestion');
  if (!input) return;
  const question = input.value.trim();
  if (question) {
    addMessage(question, 'user');
    // eğer "iade" yazıldıysa destek popup aç ve chate cevap döndür
    if (normalizeText(question).includes('iade')) {
      showSiteAlert('Destek talebi açılıyor...', '#2d2dff');
      setTimeout(() => {
        createSupportPopup();
        document.getElementById('support-popup').style.display = 'flex';
        document.getElementById('support-popup-msg').value = 'İade talebi: ' + question;
      }, 900);
      addMessage('Destek talebi açıldı, lütfen detayları yazınız.', 'bot');
      input.value = '';
      return;
    }
    getMizahiResponse(question);
    input.value = '';
  }
}

// sepet detay kısım
function showCartDetailPanel() {
  ensureCartDetailPanel();
  updateCartDetailPanel();
  document.getElementById('cart-detail-backdrop').style.display = 'block';
  document.getElementById('cart-detail-panel').style.display = 'block';
}
function hideCartDetailPanel() {
  document.getElementById('cart-detail-backdrop').style.display = 'none';
  document.getElementById('cart-detail-panel').style.display = 'none';
}
function updateCartDetailPanel() {
  ensureCartDetailPanel();
  const cart = getCartFromStorage();
  const list = document.getElementById('cart-detail-list');
  const totalEl = document.getElementById('cart-detail-total');
  if (!list || !totalEl) return;
  list.innerHTML = '';
  if (cart.length === 0) {
    document.getElementById('cart-detail-empty').style.display = 'block';
    totalEl.textContent = '';
    return;
  }
  document.getElementById('cart-detail-empty').style.display = 'none';
  let total = 0;
  cart.forEach((item, idx) => {
    total += item.price;
    const li = document.createElement('li');
    li.innerHTML = `<span class="cart-item-name">${item.name}</span>
      <span class="cart-item-price">${item.price.toLocaleString('tr-TR')}₺</span>
      <button class="cart-item-remove" data-idx="${idx}">✖</button>`;
    list.appendChild(li);
  });
  totalEl.textContent = 'Toplam: ' + total.toLocaleString('tr-TR') + '₺';
}

// sepet detay paneli için gerekli HTML ve eventleri 
function ensureCartDetailPanel() {
  if (!document.getElementById('cart-detail-panel')) {
    document.body.insertAdjacentHTML('beforeend', `
      <div id="cart-detail-backdrop" style="display:none;"></div>
      <div id="cart-detail-panel" style="display:none;">
        <button id="cart-detail-close" title="Kapat">×</button>
        <h3>Sepet Detayı</h3>
        <ul class="cart-detail-list" id="cart-detail-list"></ul>
        <div id="cart-detail-empty" style="display:none;">Sepetiniz boş.</div>
        <div id="cart-detail-total"></div>
      </div>
    `);
  }
  // eventler
  const backdrop = document.getElementById('cart-detail-backdrop');
  const closeBtn = document.getElementById('cart-detail-close');
  const list = document.getElementById('cart-detail-list');
  if (backdrop) backdrop.onclick = hideCartDetailPanel;
  if (closeBtn) closeBtn.onclick = hideCartDetailPanel;
  if (list) {
    list.onclick = function(e) {
      if (e.target && e.target.classList.contains('cart-item-remove')) {
        const idx = parseInt(e.target.dataset.idx, 10);
        let cart = getCartFromStorage();
        cart.splice(idx, 1);
        setCartToStorage(cart);
        updateCartDropdown();
        updateCartDetailPanel();
      }
    };
  }
  // sepet ikonuna tıklama
  const cartPanel = document.getElementById('cart-summary-panel');
  if (cartPanel) {
    cartPanel.style.cursor = 'pointer';
    cartPanel.onclick = function(e) {
      if (
        e.target.id === 'cart-total-header' ||
        e.target.closest('#cart-summary-panel')
      ) {
        showCartDetailPanel();
      }
    };
  }
}

// sayfa yenilemede sepet güncelle
ensureCartDetailPanel();
updateCartDropdown();
setupAddToCartButtons();

function showSiteAlert(msg, color = "#2d2dff") {
  let alertDiv = document.getElementById('site-alert');
  if (!alertDiv) {
    alertDiv = document.createElement('div');
    alertDiv.id = 'site-alert';
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '50%';
    alertDiv.style.left = '50%';
    alertDiv.style.transform = 'translate(-50%, -50%)';
    alertDiv.style.background = color;
    alertDiv.style.color = '#fff';
    alertDiv.style.padding = '22px 38px';
    alertDiv.style.borderRadius = '16px';
    alertDiv.style.fontSize = '19px';
    alertDiv.style.zIndex = '10050';
    alertDiv.style.boxShadow = '0 4px 32px #000b';
    alertDiv.style.textAlign = 'center';
    alertDiv.style.fontWeight = 'bold';
    alertDiv.style.letterSpacing = '0.5px';
    document.body.appendChild(alertDiv);
  }
  alertDiv.textContent = msg;
  alertDiv.style.display = 'block';
  setTimeout(() => {
    alertDiv.style.display = 'none';
  }, 1800);
}

// destek talebi popup pencere ekle
function createSupportPopup() {
  let popup = document.getElementById('support-popup');
  if (popup) {
    popup.style.display = 'flex';
    return;
  }
  popup = document.createElement('div');
  popup.id = 'support-popup';
  popup.style.position = 'fixed';
  popup.style.top = '50%';
  popup.style.left = '50%';
  popup.style.transform = 'translate(-50%, -50%)';
  popup.style.width = '410px';
  popup.style.maxWidth = '96vw';
  popup.style.background = 'linear-gradient(135deg, #2323ff 80%, #2d2dff 100%)';
  popup.style.color = '#fff';
  popup.style.borderRadius = '22px';
  popup.style.boxShadow = '0 8px 40px #000c';
  popup.style.zIndex = '10020';
  popup.style.padding = '0';
  popup.style.display = 'flex';
  popup.style.flexDirection = 'column';
  popup.style.alignItems = 'stretch';
  popup.innerHTML = `
    <div style="background:transparent;border-radius:22px 22px 0 0;height:62px;display:flex;align-items:center;justify-content:space-between;padding:0 32px 0 32px;font-weight:700;font-size:20px;box-shadow:0 2px 8px #0002;letter-spacing:0.2px;">
      <span>Destek Talebi Oluştur</span>
      <button id="support-popup-close" style="background:none;border:none;color:#fff;font-size:30px;cursor:pointer;transition:color 0.18s;">×</button>
    </div>
    <div style="background:#23234a;border-radius:0 0 22px 22px;padding:28px 32px 24px 32px;display:flex;flex-direction:column;gap:18px;">
      <div style="font-size:15px;color:#bfcaff;margin-bottom:-8px;">Lütfen talebinizi detaylıca yazınız. İade için sipariş ve ürün bilgisini de ekleyin.</div>
      <textarea id="support-popup-msg" placeholder="Destek talebinizi buraya yazın..." style="width:100%;height:90px;border-radius:12px;border:none;padding:12px;font-size:16px;resize:none;background:#18191c;color:#fff;box-shadow:0 2px 8px #0002;outline:none;"></textarea>
      <button id="support-popup-send" style="width:100%;background:linear-gradient(90deg,#2d2dff 60%,#3a7fff 100%);color:#fff;font-weight:600;border:none;border-radius:12px;padding:13px 0;font-size:17px;cursor:pointer;transition:background 0.18s;box-shadow:0 2px 8px #0002;">Gönder</button>
      <div id="support-popup-info" style="margin-top:4px;font-size:15px;color:#7fff4f;display:none;text-align:center;"></div>
    </div>
  `;
  document.body.appendChild(popup);

  document.getElementById('support-popup-close').onclick = () => {
    popup.style.display = 'none';
  };
  document.getElementById('support-popup-send').onclick = async () => {
    const msg = document.getElementById('support-popup-msg').value.trim();
    const infoDiv = document.getElementById('support-popup-info');
    if (!msg) {
      infoDiv.style.display = 'block';
      infoDiv.style.color = '#ff4d4d';
      infoDiv.textContent = 'Lütfen mesajınızı yazın.';
      return;
    }
    let username = localStorage.getItem('currentUser') || 'anonim';
    try {
      const resp = await fetch(apiBase + '/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, message: msg })
      });
      if (resp.ok) {
        infoDiv.style.display = 'block';
        infoDiv.style.color = '#7fff4f';
        infoDiv.textContent = 'Talebiniz iletildi!';
        document.getElementById('support-popup-msg').value = '';
        setTimeout(() => {
          popup.style.display = 'none';
          showSiteAlert('Destek talebiniz başarıyla gönderildi, size dönüş yapılmasını bekleyin.', '#2d2dff');
        }, 1000);
      } else {
        const data = await resp.json();
        infoDiv.style.display = 'block';
        infoDiv.style.color = '#ff4d4d';
        infoDiv.textContent = data.error || 'Bir hata oluştu!';
        console.error('Destek talebi gönderilemedi:', data.error);
      }
    } catch (err) {
      infoDiv.style.display = 'block';
      infoDiv.style.color = '#ff4d4d';
      infoDiv.textContent = 'Sunucuya ulaşılamadı!';
      console.error('Sunucuya ulaşılamadı:', err);
    }
  };
}

// sayfa başında giriş kontrolü yapacak (login.html hariç)
// ana dizin ("/" veya "/index.html") veya başka bir sayfa açıldığında login.html'e yönlendirir
(function() {
  const path = window.location.pathname.replace(/\\/g, '/');
  const isLogin = path.endsWith('login.html');
  const isRoot = path === '/' || path.endsWith('/index.html') || path === '/index.html';
  // eğer login.html'de değilsek ve giriş yapılmamışsa, login.html'e yönlendirir
  if (!isLogin && !localStorage.getItem('currentUser')) {
    window.location.href = 'login.html';
  }
  // ana dizin veya index.html ise ve giriş yapılmamışsa, login.html'e yönlendirecek
  if (isRoot && !localStorage.getItem('currentUser')) {
    window.location.href = 'login.html';
  }
})();

// çıkış butonu ekle ve çalıştır
document.addEventListener('DOMContentLoaded', function() {
  // sadece giriş yapılmışsa ve login.html'de değilsek göster
  const isLogin = window.location.pathname.replace(/\\/g, '/').endsWith('login.html');
  if (localStorage.getItem('currentUser') && !isLogin) {
    const nav = document.querySelector('header nav');
    if (nav && !document.getElementById('logout-btn')) {
      const logoutBtn = document.createElement('a');
      logoutBtn.href = "#";
      logoutBtn.id = "logout-btn";
      logoutBtn.textContent = "Çıkış Yap";
      logoutBtn.style.marginLeft = "10px";
      logoutBtn.onclick = function(e) {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
      };
      nav.appendChild(logoutBtn);
    }
  }
});
