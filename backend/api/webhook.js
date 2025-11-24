// Dedicated webhook endpoint for Telegram bot
const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');

// Bot setup
const bot = new Telegraf(process.env.BOT_TOKEN);

// MongoDB schemas
const userSchema = new mongoose.Schema({
  telegramId: { type: Number, required: true, unique: true },
  wallet: { type: String, default: '' },
  sensorId: { type: String, default: '' },
  points: { type: Number, default: 0 }
}, { timestamps: true });

const logSchema = new mongoose.Schema({
  sensorId: { type: String, required: true },
  aqi: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Log = mongoose.models.Log || mongoose.model('Log', logSchema);

// Connect to MongoDB
let cachedDb = null;
async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    cachedDb = connection;
    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Bot commands
bot.start(async (ctx) => {
  try {
    await connectToDatabase();
    const telegramId = ctx.from.id;
    
    let user = await User.findOne({ telegramId });
    if (!user) {
      user = new User({ telegramId });
      await user.save();
    }
  
  const welcomeMsg = `🌬️ Welcome to T-Air!

Your DePIN Air Quality Network

📊 Your Stats:
• Points: ${user.points}
• Sensor: ${user.sensorId || 'Not connected'}

🚀 Commands:
/status - Check your stats
/connect <sensor_id> - Connect sensor
/claim - Claim TON rewards
/app - Open Mini App

Start earning by connecting your ESP32 sensor!`;

    ctx.reply(welcomeMsg, {
      reply_markup: {
        inline_keyboard: [[
          { text: '🚀 Open T-Air App', url: 'https://frontend-q3dmnj8zt-pratamas-projects.vercel.app' }
        ]]
      }
    });
  } catch (error) {
    console.error('Bot start error:', error);
    ctx.reply('🌬️ Welcome to T-Air!\n\nTemporary issue with database. Please try again in a moment.');
  }
});

bot.command('status', async (ctx) => {
  try {
    await connectToDatabase();
    const user = await User.findOne({ telegramId: ctx.from.id });
    if (!user) return ctx.reply('Please use /start first');
    
    const recentLogs = await Log.find({ sensorId: user.sensorId })
      .sort({ timestamp: -1 })
      .limit(3);
    
    let statusMsg = `📊 Your T-Air Status:

💰 Points: ${user.points}
🔗 Sensor: ${user.sensorId || 'Not connected'}
📍 Status: ${user.sensorId ? '🟢 Active' : '🔴 Inactive'}`;

    if (recentLogs.length > 0) {
      statusMsg += `\n\n📈 Recent Readings:`;
      recentLogs.forEach(log => {
        const time = log.timestamp.toLocaleTimeString();
        statusMsg += `\n• AQI ${log.aqi} at ${time}`;
      });
    }
    
    ctx.reply(statusMsg);
  } catch (error) {
    console.error('Status error:', error);
    ctx.reply('❌ Database error. Please try again.');
  }
});

bot.command('connect', async (ctx) => {
  try {
    const args = ctx.message.text.split(' ');
    if (args.length < 2) {
      return ctx.reply('Usage: /connect <sensor_id>\nExample: /connect ESP32_01');
    }
    
    await connectToDatabase();
    const sensorId = args[1];
    await User.findOneAndUpdate(
      { telegramId: ctx.from.id },
      { sensorId },
      { upsert: true, new: true }
    );
    
    ctx.reply(`✅ Sensor ${sensorId} connected!\n\nYour ESP32 can now send data and earn 5 points per reading.`);
  } catch (error) {
    console.error('Connect error:', error);
    ctx.reply('❌ Connection failed. Please try again.');
  }
});

bot.command('claim', async (ctx) => {
  await connectToDatabase();
  const user = await User.findOne({ telegramId: ctx.from.id });
  if (!user || user.points < 100) {
    return ctx.reply('❌ Need 100+ points to claim.\n\nConnect sensor and collect data!');
  }
  
  user.points -= 100;
  await user.save();
  
  ctx.reply('🎉 Reward claimed!\n\n💰 -100 points\n🪙 +0.1 TON (simulated)');
});

bot.command('app', (ctx) => {
  ctx.reply('🚀 Open T-Air Mini App:', {
    reply_markup: {
      inline_keyboard: [[
        { text: '📱 Launch App', url: 'https://frontend-q3dmnj8zt-pratamas-projects.vercel.app' }
      ]]
    }
  });
});

// Vercel serverless function handler
module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      console.log('Webhook received:', req.body);
      await bot.handleUpdate(req.body);
      return res.status(200).json({ ok: true });
    } catch (error) {
      console.error('Bot webhook error:', error);
      return res.status(200).json({ ok: true }); // Always return 200 to Telegram
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}