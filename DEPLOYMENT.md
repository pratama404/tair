# 🚀 T-Air Deployment Guide

## 📋 Pre-requisites

1. **MongoDB Atlas Account**
   - Create cluster
   - Get connection string
   - Whitelist IP: 0.0.0.0/0

2. **Telegram Bot**
   - Create bot via @BotFather
   - Get bot token
   - Setup webhook (after backend deployment)

3. **TON Wallet**
   - Create wallet
   - Get mnemonic phrase
   - Fund with testnet TON

4. **Vercel Account**
   - Connect GitHub repository
   - Setup environment variables

## 🔧 Step-by-Step Deployment

### 1. Backend Deployment

```bash
cd backend
npm install
vercel --prod
```

**Set Environment Variables di Vercel:**
- `MONGODB_URI`: Your MongoDB connection string
- `BOT_TOKEN`: Your Telegram bot token
- `MNEMONIC`: Your TON wallet mnemonic

### 2. Frontend Deployment

```bash
cd frontend
# Update API_BASE in src/App.jsx with backend URL
npm install
npm run build
vercel --prod
```

### 3. Telegram Bot Setup

1. Get backend URL from Vercel
2. Set webhook:
```bash
curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=<BACKEND_URL>/api/webhook"
```

3. Set Mini App URL in @BotFather:
   - `/mybots` → Select bot → Bot Settings → Menu Button
   - URL: Your frontend Vercel URL

### 4. ESP32 Configuration

1. Update `firmware/sensor.ino`:
```cpp
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverURL = "https://your-backend-url.vercel.app/api/submit";
```

2. Flash to ESP32

### 5. Testing

1. **API Test**: `curl https://your-backend-url.vercel.app/api`
2. **Frontend Test**: Open frontend URL
3. **Bot Test**: Send `/start` to your bot
4. **ESP32 Test**: Check serial monitor for HTTP 200

## 🐛 Troubleshooting

### Common Issues

1. **Vercel Function Timeout**
   - Check MongoDB connection
   - Verify environment variables

2. **CORS Errors**
   - Ensure CORS headers in API
   - Check frontend API_BASE URL

3. **ESP32 Connection Failed**
   - Verify WiFi credentials
   - Check server URL
   - Test with curl first

4. **Telegram Bot Not Responding**
   - Verify bot token
   - Check webhook URL
   - Test API endpoints manually

### Debug Commands

```bash
# Test API health
curl https://your-backend-url.vercel.app/api

# Test sensor submission
curl -X POST https://your-backend-url.vercel.app/api/submit \
  -H "Content-Type: application/json" \
  -d '{"sensorId":"ESP32_01","aqi":50}'

# Check Vercel logs
vercel logs
```

## 📊 Monitoring

- **Vercel Dashboard**: Function logs and metrics
- **MongoDB Atlas**: Database connections and queries
- **Telegram Bot**: Message logs via @BotFather
- **ESP32**: Serial monitor for sensor readings

## 🔄 Updates

To update deployment:

1. **Backend**: `vercel --prod` in backend folder
2. **Frontend**: `npm run build && vercel --prod` in frontend folder
3. **ESP32**: Re-flash firmware with new URLs