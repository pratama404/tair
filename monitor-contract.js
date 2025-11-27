// Real-time TON Contract Monitor
const axios = require('axios');

const CONTRACT_ADDRESS = 'EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t';
const BACKEND_URL = 'https://backend-fdhckiobr-pratamas-projects.vercel.app/api';

let previousData = null;

async function monitorContract() {
  console.clear();
  console.log('📊 T-Air Smart Contract Real-time Monitor');
  console.log('=' .repeat(50));
  console.log(`Contract: ${CONTRACT_ADDRESS}`);
  console.log(`Time: ${new Date().toLocaleString()}`);
  console.log('=' .repeat(50));
  
  try {
    // Get current contract status
    const response = await axios.get(`${BACKEND_URL}/contract-status`);
    const currentData = response.data;
    
    // Display current status
    console.log('\n📈 Current Status:');
    console.log(`   Network: ${currentData.network}`);
    console.log(`   Status: ${currentData.status}`);
    console.log(`   Balance: ${currentData.balance}`);
    console.log(`   Reward Pool: ${currentData.rewardPool}`);
    console.log(`   Total Users: ${currentData.totalUsers}`);
    console.log(`   Total Data Points: ${currentData.totalDataPoints}`);
    console.log(`   Reward Rate: ${currentData.rewardRate}`);
    
    // Show changes if previous data exists
    if (previousData) {
      console.log('\n🔄 Changes since last check:');
      
      const userChange = currentData.totalUsers - previousData.totalUsers;
      const dataChange = currentData.totalDataPoints - previousData.totalDataPoints;
      
      if (userChange !== 0) {
        console.log(`   👥 Users: ${userChange > 0 ? '+' : ''}${userChange}`);
      }
      
      if (dataChange !== 0) {
        console.log(`   📊 Data Points: ${dataChange > 0 ? '+' : ''}${dataChange}`);
      }
      
      if (userChange === 0 && dataChange === 0) {
        console.log('   📝 No changes detected');
      }
    }
    
    // Activity indicators
    console.log('\n🚦 Activity Indicators:');
    console.log(`   Data Collection: ${currentData.totalDataPoints > 0 ? '🟢 Active' : '🔴 Inactive'}`);
    console.log(`   User Growth: ${currentData.totalUsers > 0 ? '🟢 Growing' : '🔴 No Users'}`);
    console.log(`   Reward System: ${currentData.rewardPool !== '0 TON' ? '🟢 Funded' : '🔴 Empty'}`);
    
    // Quick stats
    const avgDataPerUser = currentData.totalUsers > 0 ? 
      Math.round(currentData.totalDataPoints / currentData.totalUsers) : 0;
    
    console.log('\n📊 Quick Stats:');
    console.log(`   Avg Data per User: ${avgDataPerUser} points`);
    console.log(`   Potential Rewards: ${Math.floor(currentData.totalDataPoints / 20)} claims available`);
    
    // Explorer links
    console.log('\n🔗 Quick Links:');
    console.log(`   TON Explorer: https://testnet.tonscan.org/address/${CONTRACT_ADDRESS}`);
    console.log(`   Backend API: ${BACKEND_URL}/contract-status`);
    
    previousData = currentData;
    
  } catch (error) {
    console.error('\n❌ Error monitoring contract:', error.message);
  }
  
  console.log('\n⏱️ Next update in 30 seconds... (Ctrl+C to stop)');
}

// Start monitoring
console.log('🚀 Starting T-Air Contract Monitor...\n');
monitorContract();

// Update every 30 seconds
setInterval(monitorContract, 30000);