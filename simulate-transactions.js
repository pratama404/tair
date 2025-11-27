// Simulate Smart Contract Transactions
const axios = require('axios');

const BACKEND_URL = 'https://backend-fdhckiobr-pratamas-projects.vercel.app/api';

async function simulateTransactions() {
  console.log('🎭 Simulating Smart Contract Transactions\n');
  
  const testUsers = [
    { id: 111111, sensor: 'ESP32_DEMO_01', wallet: 'EQBvW8Z5huBkMJYdnfAEM5JqTNkuWX3diqYENkWsIL0XggGG' },
    { id: 222222, sensor: 'ESP32_DEMO_02', wallet: 'EQC5zVduGnW8l8YVdnfAEM5JqTNkuWX3diqYENkWsIL0XggHH' },
    { id: 333333, sensor: 'ESP32_DEMO_03', wallet: 'EQD6zVduGnW8l8YVdnfAEM5JqTNkuWX3diqYENkWsIL0XggII' }
  ];
  
  try {
    // 1. Setup test users
    console.log('1️⃣ Setting up test users...');
    for (const user of testUsers) {
      await axios.post(`${BACKEND_URL}/connect-sensor`, {
        telegramId: user.id,
        sensorId: user.sensor
      });
      console.log(`   ✅ User ${user.id} connected sensor ${user.sensor}`);
    }
    
    // 2. Simulate data submissions
    console.log('\n2️⃣ Simulating sensor data submissions...');
    for (let i = 0; i < 30; i++) {
      const randomUser = testUsers[Math.floor(Math.random() * testUsers.length)];
      const randomAQI = Math.floor(Math.random() * 200) + 50;
      
      const response = await axios.post(`${BACKEND_URL}/submit`, {
        sensorId: randomUser.sensor,
        aqi: randomAQI
      });
      
      console.log(`   📊 ${randomUser.sensor}: AQI ${randomAQI} → ${response.data.points} points`);
      
      // Small delay to simulate real-time data
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // 3. Check user points and simulate claims
    console.log('\n3️⃣ Checking points and simulating reward claims...');
    for (const user of testUsers) {
      const userData = await axios.get(`${BACKEND_URL}/user?telegramId=${user.id}`);
      console.log(`   👤 User ${user.id}: ${userData.data.points} points`);
      
      if (userData.data.points >= 100) {
        console.log(`   🎁 Claiming reward for user ${user.id}...`);
        
        const claimResponse = await axios.post(`${BACKEND_URL}/claim`, {
          telegramId: user.id,
          walletAddress: user.wallet
        });
        
        console.log(`   ✅ Smart Contract Transaction:`, {
          success: claimResponse.data.success,
          amount: claimResponse.data.amount,
          txHash: claimResponse.data.txHash,
          contract: claimResponse.data.contract
        });
      }
    }
    
    // 4. Final contract status
    console.log('\n4️⃣ Final contract status...');
    const finalStatus = await axios.get(`${BACKEND_URL}/contract-status`);
    console.log('✅ Contract Summary:', {
      totalUsers: finalStatus.data.totalUsers,
      totalDataPoints: finalStatus.data.totalDataPoints,
      rewardPool: finalStatus.data.rewardPool,
      lastUpdate: finalStatus.data.lastUpdate
    });
    
    console.log('\n🎉 Transaction simulation complete!');
    console.log('\n🔗 Check contract status:');
    console.log(`   node check-contract.js`);
    console.log(`   node monitor-contract.js`);
    
  } catch (error) {
    console.error('❌ Simulation error:', error.response?.data || error.message);
  }
}

simulateTransactions();