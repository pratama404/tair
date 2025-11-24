// Telegram Bot for T-Air
const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');

// Bot setup
const bot = new Telegraf(process.env.BOT_TOKEN);

// MongoDB schemas (same as API)
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
mongoose.connect(process.env.MONGODB_URI);

// Bot commands
bot.start(async (ctx) => {
  const telegramId = ctx.from.id;
  
  // Create or get user
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

  // Add Mini App button
  ctx.reply(welcomeMsg, {
    reply_markup: {
      inline_keyboard: [[
        { text: '🚀 Open T-Air App', web_app: { url: 'https://frontend-q3dmnj8zt-pratamas-projects.vercel.app' }}
      ]]
    }
  });
});

bot.command('status', async (ctx) => {
  const user = await User.findOne({ telegramId: ctx.from.id });
  if (!user) return ctx.reply('Please use /start first');
  
  const recentLogs = await Log.find({ sensorId: user.sensorId })
    .sort({ timestamp: -1 })
    .limit(5);
  
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
});

bot.command('connect', async (ctx) => {
  const args = ctx.message.text.split(' ');
  if (args.length < 2) {
    return ctx.reply('Usage: /connect <sensor_id>\nExample: /connect ESP32_01');
  }
  
  const sensorId = args[1];
  const user = await User.findOneAndUpdate(
    { telegramId: ctx.from.id },
    { sensorId },
    { upsert: true, new: true }
  );
  
  ctx.reply(`✅ Sensor ${sensorId} connected successfully!\n\nYour ESP32 can now send data and you'll earn 5 points per reading.`);
});

bot.command('claim', async (ctx) => {
  const user = await User.findOne({ telegramId: ctx.from.id });
  if (!user || user.points < 100) {
    return ctx.reply('❌ You need at least 100 points to claim rewards.\n\nConnect your sensor and collect data to earn points!');
  }
  
  // Simulate reward claim
  user.points -= 100;
  await user.save();
  
  ctx.reply('🎉 Reward claimed successfully!\n\n💰 -100 points\n🪙 +0.1 TON (simulated)\n\nRewards will be sent to your connected wallet.');
});

bot.command('app', (ctx) => {
  ctx.reply('🚀 Open T-Air Mini App:', {
    reply_markup: {
      inline_keyboard: [[
        { text: '📱 Launch App', web_app: { url: 'https://frontend-q3dmnj8zt-pratamas-projects.vercel.app' }}
      ]]
    }
  });
});

// Handle errors
bot.catch((err, ctx) => {
  console.error('Bot error:', err);
  ctx.reply('❌ Something went wrong. Please try again.');
});

module.exports = bot;