// Simple webhook without database for testing
const { Telegraf } = require('telegraf');

// Bot setup
const bot = new Telegraf(process.env.BOT_TOKEN);

// In-memory storage for testing
const users = {};

// Bot commands
bot.start((ctx) => {
  const telegramId = ctx.from.id;
  
  if (!users[telegramId]) {
    users[telegramId] = { points: 0, sensorId: '' };
  }
  
  const welcomeMsg = `🌬️ Welcome to T-Air!

Your DePIN Air Quality Network

📊 Your Stats:
• Points: ${users[telegramId].points}
• Sensor: ${users[telegramId].sensorId || 'Not connected'}

🚀 Commands:
/status - Check your stats
/connect <sensor_id> - Connect sensor
/addpoints - Add test points
/claim - Claim TON rewards

Start earning by connecting your ESP32 sensor!`;

  ctx.reply(welcomeMsg, {
    reply_markup: {
      inline_keyboard: [[
        { text: '🚀 Open T-Air App', url: 'https://frontend-q3dmnj8zt-pratamas-projects.vercel.app' }
      ]]
    }
  });
});

bot.command('status', (ctx) => {
  const telegramId = ctx.from.id;
  const user = users[telegramId] || { points: 0, sensorId: '' };
  
  const statusMsg = `📊 Your T-Air Status:

💰 Points: ${user.points}
🔗 Sensor: ${user.sensorId || 'Not connected'}
📍 Status: ${user.sensorId ? '🟢 Active' : '🔴 Inactive'}`;
  
  ctx.reply(statusMsg);
});

bot.command('connect', (ctx) => {
  const args = ctx.message.text.split(' ');
  if (args.length < 2) {
    return ctx.reply('Usage: /connect <sensor_id>\nExample: /connect ESP32_01');
  }
  
  const telegramId = ctx.from.id;
  const sensorId = args[1];
  
  if (!users[telegramId]) {
    users[telegramId] = { points: 0, sensorId: '' };
  }
  
  users[telegramId].sensorId = sensorId;
  
  ctx.reply(`✅ Sensor ${sensorId} connected!\n\nYour ESP32 can now send data and earn points.`);
});

bot.command('addpoints', (ctx) => {
  const telegramId = ctx.from.id;
  if (!users[telegramId]) {
    users[telegramId] = { points: 0, sensorId: '' };
  }
  
  users[telegramId].points += 50;
  ctx.reply(`✅ Added 50 points! Total: ${users[telegramId].points}`);
});

bot.command('claim', (ctx) => {
  const telegramId = ctx.from.id;
  const user = users[telegramId] || { points: 0, sensorId: '' };
  
  if (user.points < 100) {
    return ctx.reply('❌ Need 100+ points to claim.\n\nUse /addpoints to get test points!');
  }
  
  users[telegramId].points -= 100;
  
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

// Vercel handler
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      await bot.handleUpdate(req.body);
      return res.status(200).json({ ok: true });
    } catch (error) {
      console.error('Bot error:', error);
      return res.status(200).json({ ok: true });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};