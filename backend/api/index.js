// Vercel Serverless Function
const mongoose = require('mongoose');
// TON imports - commented for initial testing
// const { TonClient, WalletContractV4, internal } = require('@ton/ton');
// const { mnemonicToPrivateKey } = require('@ton/crypto');

// Telegram Bot
let bot;
try {
  bot = require('../bot');
} catch (e) {
  console.log('Bot not loaded:', e.message);
}

// MongoDB Connection
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tair', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    cachedDb = connection;
    console.log('MongoDB connected successfully');
    return connection;
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    throw error;
  }
}

// Schemas
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

// Main handler
module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectToDatabase();

    const { url, method } = req;
    console.log(`${method} ${url}`); // Debug log

    // Health check
    if (url === '/api' && method === 'GET') {
      return res.json({ status: 'OK', message: 'T-Air API is running' });
    }

    // Test database connection
    if (url === '/api/test-db' && method === 'GET') {
      try {
        await connectToDatabase();
        
        // Create test user
        const testUser = new User({ 
          telegramId: 999999, 
          sensorId: 'TEST_SENSOR',
          points: 100 
        });
        await testUser.save();
        
        return res.json({ 
          status: 'OK', 
          message: 'Database connected and test user created',
          user: testUser
        });
      } catch (error) {
        return res.status(500).json({ 
          error: 'Database connection failed', 
          details: error.message 
        });
      }
    }

    // Smart Contract Status
    if (url === '/api/contract-status' && method === 'GET') {
      const contractData = {
        address: 'EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t',
        network: 'TON Testnet',
        status: 'Active',
        balance: '1.5 TON',
        rewardPool: '1.2 TON',
        totalUsers: await User.countDocuments(),
        totalDataPoints: await Log.countDocuments(),
        rewardRate: '0.1 TON per 100 points',
        lastUpdate: new Date().toISOString()
      };
      
      return res.json(contractData);
    }

    // Submit sensor data
    if ((url === '/api/submit' || url.includes('/submit')) && method === 'POST') {
      try {
        await connectToDatabase();
        
        const { sensorId, aqi } = req.body;
        
        if (!sensorId || aqi === undefined) {
          return res.status(400).json({ error: 'sensorId and aqi are required' });
        }

        // Save log
        const log = new Log({ sensorId, aqi });
        await log.save();

        // Update user points
        const user = await User.findOne({ sensorId });
        if (user) {
          user.points += 5;
          await user.save();
        }

        return res.json({ 
          success: true, 
          message: 'Data submitted successfully',
          points: user ? user.points : 0
        });
      } catch (error) {
        console.error('Submit error:', error);
        return res.status(500).json({ error: 'Database error', details: error.message });
      }
    }

    // Get user data
    if (url.startsWith('/api/user') && method === 'GET') {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      const telegramId = urlParams.get('telegramId');
      
      if (!telegramId) {
        return res.status(400).json({ error: 'telegramId is required' });
      }

      let user = await User.findOne({ telegramId: parseInt(telegramId) });
      if (!user) {
        user = new User({ telegramId: parseInt(telegramId) });
        await user.save();
      }

      return res.json(user);
    }

    // Connect sensor
    if (url === '/api/connect-sensor' && method === 'POST') {
      const { telegramId, sensorId } = req.body;
      
      let user = await User.findOne({ telegramId: parseInt(telegramId) });
      if (!user) {
        user = new User({ telegramId: parseInt(telegramId) });
      }

      user.sensorId = sensorId;
      await user.save();

      return res.json({ success: true, message: 'Sensor connected successfully' });
    }

    // Claim rewards
    if (url === '/api/claim' && method === 'POST') {
      const { telegramId, walletAddress } = req.body;
      
      const user = await User.findOne({ telegramId: parseInt(telegramId) });
      if (!user || user.points < 100) {
        return res.status(400).json({ error: 'Insufficient points (minimum 100)' });
      }

      try {
        // Send TON reward via smart contract
        const contractAddress = 'EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t';
        const rewardAmount = '0.1'; // TON
        
        // Simulate smart contract interaction
        const txHash = await sendTONReward(walletAddress, rewardAmount, contractAddress);
        
        user.points -= 100;
        await user.save();
        
        return res.json({ 
          success: true, 
          message: 'TON reward sent via smart contract!',
          amount: rewardAmount + ' TON',
          txHash: txHash,
          contract: contractAddress
        });
      } catch (error) {
        console.error('Smart contract error:', error);
        return res.status(500).json({ error: 'Failed to send TON reward via contract' });
      }
    }

    // Telegram webhook - with database
    if ((url === '/api/webhook' || url === '/api/simple-webhook') && method === 'POST') {
      try {
        const { Telegraf } = require('telegraf');
        const simpleBot = new Telegraf(process.env.BOT_TOKEN);
        
        // Use existing database connection
        await connectToDatabase();
        
        simpleBot.start(async (ctx) => {
          const telegramId = ctx.from.id;
          
          let user = await User.findOne({ telegramId });
          if (!user) {
            user = new User({ telegramId });
            await user.save();
          }
          
          const welcomeMsg = `🌬️ Welcome to T-Air!\n\nYour DePIN Air Quality Network\n\n📊 Your Stats:\n• Points: ${user.points}\n• Sensor: ${user.sensorId || 'Not connected'}\n\n🚀 Commands:\n/status - Check stats\n/connect <sensor_id> - Connect sensor\n/addpoints - Add test points\n/claim - Claim rewards`;
          
          ctx.reply(welcomeMsg, {
            reply_markup: {
              inline_keyboard: [[
                { text: '🚀 Open T-Air App', url: 'https://frontend-ejm5kwddc-pratamas-projects.vercel.app' }
              ]]
            }
          });
        });
        
        simpleBot.command('status', async (ctx) => {
          const user = await User.findOne({ telegramId: ctx.from.id }) || { points: 0, sensorId: '' };
          ctx.reply(`📊 Your T-Air Status:\n\n💰 Points: ${user.points}\n🔗 Sensor: ${user.sensorId || 'Not connected'}\n📍 Status: ${user.sensorId ? '🟢 Active' : '🔴 Inactive'}`);
        });
        
        simpleBot.command('connect', async (ctx) => {
          const args = ctx.message.text.split(' ');
          if (args.length < 2) {
            return ctx.reply('Usage: /connect <sensor_id>\nExample: /connect ESP32_01');
          }
          
          const telegramId = ctx.from.id;
          const sensorId = args[1];
          
          await User.findOneAndUpdate(
            { telegramId },
            { sensorId },
            { upsert: true, new: true }
          );
          
          ctx.reply(`✅ Sensor ${sensorId} connected!\n\nYour ESP32 can now send data and earn points.`);
        });
        
        simpleBot.command('addpoints', async (ctx) => {
          const telegramId = ctx.from.id;
          
          const user = await User.findOneAndUpdate(
            { telegramId },
            { $inc: { points: 50 } },
            { upsert: true, new: true }
          );
          
          ctx.reply(`✅ Added 50 points! Total: ${user.points}`);
        });
        
        simpleBot.command('claim', async (ctx) => {
          const telegramId = ctx.from.id;
          const user = await User.findOne({ telegramId });
          
          if (!user || user.points < 100) {
            return ctx.reply('❌ Need 100+ points to claim.\n\nUse /addpoints to get test points!');
          }
          
          user.points -= 100;
          await user.save();
          
          ctx.reply('🎉 Reward claimed!\n\n💰 -100 points\n🪙 +0.1 TON (simulated)');
        });
        
        await simpleBot.handleUpdate(req.body);
        return res.status(200).json({ ok: true });
      } catch (error) {
        console.error('Simple bot error:', error);
        return res.status(200).json({ ok: true });
      }
    }

    return res.status(404).json({ error: 'Not found' });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// TON Smart Contract Reward Function
async function sendTONReward(toAddress, amount, contractAddress) {
  try {
    // Simulate smart contract interaction
    const txHash = 'tx_' + Math.random().toString(36).substr(2, 9);
    
    console.log(`Smart Contract Reward:`);
    console.log(`- Contract: ${contractAddress}`);
    console.log(`- To: ${toAddress}`);
    console.log(`- Amount: ${amount} TON`);
    console.log(`- TX Hash: ${txHash}`);
    
    // In real implementation, this would:
    // 1. Connect to TON network
    // 2. Call smart contract ClaimReward function
    // 3. Send transaction
    // 4. Return actual transaction hash
    
    return txHash;
  } catch (error) {
    console.error('Smart contract error:', error);
    throw error;
  }
}