# Firebase Kurulum Rehberi - CryptoBuddy

Bu rehber, CryptoBuddy uygulamasını Firebase ile yapılandırmanız için adım adım talimatlar içerir.

## 1. Firebase Projesi Oluşturma

1. [Firebase Console](https://console.firebase.google.com/)'a gidin.
2. "Proje Ekle" butonuna tıklayın.
3. Projenize bir ad verin (örn. "CryptoBuddy").
4. Google Analytics'i etkinleştirip etkinleştirmemeyi seçin (isteğe bağlı).
5. "Proje Oluştur" düğmesine tıklayın.

## 2. Web Uygulaması Ekleme

1. Proje panelinde, açılış ekranından veya sol taraftaki menüdeki ayarlar ikonundan "Web Uygulaması Ekle"yi seçin.
2. Uygulamanıza bir takma ad verin (örn. "cryptobuddyweb").
3. "Firebase Hosting'i de bu uygulamada ayarla" seçeneğini işaretleyin (isteğe bağlı).
4. "Uygulama Kaydet" düğmesine tıklayın.
5. Firebase, size uygulamanızın yapılandırma bilgilerini gösterecektir. Bu bilgileri `.env` dosyanıza eklemeniz gerekecek.

## 3. Kimlik Doğrulama Ayarları

1. Sol menüdeki "Authentication" (Kimlik Doğrulama) bölümüne gidin.
2. "Get Started" (Başlayın) düğmesine tıklayın.
3. Etkinleştirmek istediğiniz oturum açma yöntemlerini seçin:
   - Email/Password (E-posta/Şifre)
   - Google
   - Diğer sağlayıcılar (isteğe bağlı)
4. Her yöntem için "Enable" (Etkinleştir) seçeneğini işaretleyin ve gerekli yapılandırmaları tamamlayın.

## 4. Firestore Database Oluşturma

1. Sol menüdeki "Firestore Database" bölümüne gidin.
2. "Create Database" (Veritabanı Oluştur) düğmesine tıklayın.
3. Başlangıç modunu seçin (test için "Start in test mode" (Test modunda başla) seçebilirsiniz).
4. Veritabanınız için bir konum seçin (genellikle size en yakın bölge önerilir).
5. "Next" (İleri) ve ardından "Enable" (Etkinleştir) düğmesine tıklayın.

## 5. Güvenlik Kuralları

Projenin canlı sürümünde, Firestore güvenlik kurallarını yapılandırmanız önemlidir. Temel kurallar aşağıdaki gibidir:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Kullanıcılar sadece kendi verilerini okuyabilir ve yazabilir
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Kullanıcılar kendi işlemlerini yönetebilir
    match /users/{userId}/transactions/{transactionId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 6. .env Dosyasını Yapılandırma

1. `example.env` dosyasını `.env` olarak kopyalayın.
2. Firebase konsolundan aldığınız yapılandırma bilgilerini `.env` dosyasına ekleyin:

```
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

## 7. Uygulamayı Başlatma

1. Tüm bağımlılıkları yükleyin: `npm install`
2. Uygulamayı başlatın: `npm start`
3. Tarayıcınızda `http://localhost:3000` adresine giderek uygulamanızı görüntüleyin.

## 8. Firebase ile İlgili Sorun Giderme

- **Kimlik Doğrulama Sorunları**: Firebase konsolundaki Authentication logs'u kontrol edin.
- **Firestore İşlem Sorunları**: Rules kısmını doğru yapılandırdığınızdan emin olun ve Firebase konsolundaki veritabanı günlüklerini inceleyin.
- **CORS Hataları**: Firebase projesi ayarlarında CORS yapılandırmasını kontrol edin.
- **API Anahtarı Sorunları**: API anahtarınızın doğru olduğundan ve kısıtlamalarının uygun şekilde yapılandırıldığından emin olun.

## Kaynaklar

- [Firebase Belgeleri](https://firebase.google.com/docs)
- [Firebase JavaScript SDK Referansı](https://firebase.google.com/docs/reference/js)
- [Firestore Güvenlik Kuralları](https://firebase.google.com/docs/firestore/security/get-started) 