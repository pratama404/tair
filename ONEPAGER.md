# T-Air: Telegram Air Quality Network

## Problem Statement
Kualitas udara di kota-kota besar Indonesia sangat buruk, namun data pemantauan resmi sangat terbatas (hanya ada di titik tertentu) dan mahal. Masyarakat tidak memiliki akses data real-time yang spesifik di lokasi rumah mereka (hyperlocal).

## Solusi
T-Air adalah jaringan DePIN berbasis komunitas yang memanfaatkan sensor murah (ESP32) dan Telegram untuk memantau kualitas udara. Kami menghilangkan hambatan teknis dengan mengintegrasikan seluruh pengalaman pengguna (monitoring & wallet) langsung di dalam Telegram Mini App, didukung oleh blockchain TON untuk insentif transparan.

## Arsitektur Sederhana

**Device (DeIoT)**: ESP32 + Sensor MQ-135 mengirim data kualitas udara ke Cloud.

**Bridge (Backend)**: Serverless API (Vercel) memvalidasi data & menyimpannya di MongoDB.

**Blockchain (TON)**: Smart Contract (Tact) mencatat kontribusi dan mendistribusikan reward token.

**Interface**: Telegram Mini App untuk visualisasi data dan klaim reward.

## Komponen DePIN & TON

**DeIoT**: Penggunaan sensor fisik terdesentralisasi.

**TON Integration**: Smart Contract menggunakan bahasa Tact, Wallet menggunakan Tonkeeper, UI menggunakan Telegram Mini App.

## Next Steps

- Menambahkan validasi "Proof of Location" menggunakan GPS module
- Marketplace data udara terdesentralisasi untuk peneliti  
- Integrasi notifikasi peringatan dini bencana asap

## Tech Stack
- **Frontend**: React + Telegram Mini App SDK
- **Backend**: Node.js + Express (Vercel Serverless)
- **Database**: MongoDB Atlas
- **Blockchain**: TON (Tact Language)
- **Hardware**: ESP32 + MQ-135 Sensor

## Value Proposition
1. **Hyperlocal Data**: Data kualitas udara spesifik per lokasi
2. **Community Driven**: Dioperasikan oleh komunitas, bukan korporasi
3. **Incentivized**: Pengguna mendapat reward TON untuk kontribusi data
4. **Easy Access**: Semua fitur terintegrasi dalam Telegram
5. **Low Cost**: Menggunakan sensor murah dan infrastruktur existing