# TrolBot Sunucusunu PowerShell'den Başlatma

1. **PowerShell'i açın**  
   Başlat menüsüne "PowerShell" yazıp açabilirsiniz.

2. **Proje klasörüne geçin**
   ```powershell
   cd "C:\Users\parti\Desktop\TrolBot"
   ```

3. **Sunucuyu başlatın** İLK MONGO COMPASS'da CONNECT YAPILMALI, YOKSA PORT BAĞLANTISI YAPILAMAZ
   ```powershell
   node server.js
   ```

4. **Şunu görmelisiniz:**
   ```
   Server running on port 5000
   ```

5. **MongoDB servisi de açık olmalı.**  
   (MongoDB Compass veya komut satırından kontrol edebilirsiniz.)

6. **Tarayıcıdan test edin:**  
   [http://localhost:5000](http://localhost:5000)

---
Herhangi bir hata alırsanız, terminaldeki hata mesajını kontrol edin.

# Destek Talebi Özeti

**Amaç:**  
Kullanıcı, sitede "destek talebi aç" butonuna basınca veya chat'e "iade" yazınca bir destek talebi popup'ı açılır.  
Kullanıcı mesajını yazar ve "Gönder" butonuna basar.  
Bu mesaj, sunucuya POST isteğiyle `/api/support` endpoint'ine gönderilir ve MongoDB'de `supportrequests` koleksiyonuna kaydedilir.

**Adımlar:**
1. Kullanıcı popup'a mesajını yazar ve gönderir.
2. İstemci (JavaScript) fetch ile `/api/support` endpoint'ine POST isteği atar.
3. Sunucu bu isteği alır, MongoDB'ye kaydeder ve başarılıysa cevap döner.
4. Kullanıcıya "Talebiniz başarıyla gönderildi" mesajı gösterilir.
5. (Opsiyonel) MongoDB Compass ile bu talepler görüntülenebilir.

## Destek Talebi MongoDB'de Nereye Kaydoluyor?

Destek talepleri MongoDB'de şu koleksiyona kaydolur:

- **Veritabanı:** `trolstore`
- **Koleksiyon:** `supportrequests`

MongoDB Compass ile:
1. `trolstore` veritabanını seçin.
2. Sol menüde `supportrequests` koleksiyonunu göreceksiniz.
3. Burada her destek talebi bir belge (document) olarak saklanır.

Her belge örneği:
```json
{
  "_id": "665c7e5c2c8b2e1a7e8c1234",
  "username": "anonim",
  "message": "İade talebi: Ürün bozuk geldi.",
  "createdAt": "2024-06-03T20:15:56.123Z",
  "__v": 0
}
```
