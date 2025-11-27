// TON Smart Contract Checker
const axios = require('axios');

const CONTRACT_ADDRESS = 'EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t';
const BACKEND_URL = 'https://backend-fdhckiobr-pratamas-projects.vercel.app/api';

async function checkTONContract() {
  console.log('🔍 Checking TON Smart Contract Status\n');
  
  try {
    // 1. Check via TON API
    console.log('1️⃣ Checking via TON API...');
    const tonAPI = `https://testnet.toncenter.com/api/v2/getAddressInformation?address=${CONTRACT_ADDRESS}`;
    
    try {
      const tonResponse = await axios.get(tonAPI);
      console.log('✅ TON Network Status:', {
        address: CONTRACT_ADDRESS,
        balance: tonResponse.data.result.balance + ' nanoTON',
        state: tonResponse.data.result.state,
        lastActivity: new Date(tonResponse.data.result.last_transaction_lt * 1000).toLocaleString()
      });
    } catch (error) {
      console.log('⚠️ TON API not accessible, using backend data');
    }
    
    // 2. Check via Backend API
    console.log('\n2️⃣ Checking via Backend API...');
    const backendResponse = await axios.get(`${BACKEND_URL}/contract-status`);
    console.log('✅ Backend Contract Data:', {
      address: backendResponse.data.address,
      network: backendResponse.data.network,
      status: backendResponse.data.status,
      balance: backendResponse.data.balance,
      rewardPool: backendResponse.data.rewardPool,
      totalUsers: backendResponse.data.totalUsers,
      totalDataPoints: backendResponse.data.totalDataPoints,
      rewardRate: backendResponse.data.rewardRate
    });
    
    // 3. Check Recent Transactions
    console.log('\n3️⃣ Checking Recent Activity...');
    const transactionsAPI = `https://testnet.toncenter.com/api/v2/getTransactions?address=${CONTRACT_ADDRESS}&limit=5`;
    
    try {
      const txResponse = await axios.get(transactionsAPI);
      if (txResponse.data.result.length > 0) {
        console.log('✅ Recent Transactions:');
        txResponse.data.result.forEach((tx, index) => {
          console.log(`   ${index + 1}. Hash: ${tx.transaction_id.hash}`);
          console.log(`      Time: ${new Date(tx.utime * 1000).toLocaleString()}`);
          console.log(`      Value: ${tx.in_msg?.value || 0} nanoTON`);
        });
      } else {
        console.log('📝 No recent transactions found');
      }
    } catch (error) {
      console.log('⚠️ Transaction history not available');
    }
    
    // 4. Contract Health Check
    console.log('\n4️⃣ Contract Health Check...');
    const healthScore = calculateHealthScore(backendResponse.data);
    console.log('✅ Contract Health Score:', healthScore);
    
    // 5. Explorer Links
    console.log('\n5️⃣ Explorer Links:');
    console.log(`🔗 TON Testnet Explorer: https://testnet.tonscan.org/address/${CONTRACT_ADDRESS}`);
    console.log(`🔗 Backend API: ${BACKEND_URL}/contract-status`);
    console.log(`🔗 GitHub Repository: https://github.com/pratama404/tair`);
    
  } catch (error) {
    console.error('❌ Error checking contract:', error.message);
  }
}

function calculateHealthScore(contractData) {
  let score = 0;
  let maxScore = 100;
  
  // Status check (30 points)
  if (contractData.status === 'Active') score += 30;
  
  // Balance check (20 points)
  const balance = parseFloat(contractData.balance);
  if (balance > 1) score += 20;
  else if (balance > 0.5) score += 15;
  else if (balance > 0) score += 10;
  
  // Users check (25 points)
  if (contractData.totalUsers > 10) score += 25;
  else if (contractData.totalUsers > 5) score += 20;
  else if (contractData.totalUsers > 0) score += 15;
  
  // Data points check (25 points)
  if (contractData.totalDataPoints > 100) score += 25;
  else if (contractData.totalDataPoints > 50) score += 20;
  else if (contractData.totalDataPoints > 10) score += 15;
  else if (contractData.totalDataPoints > 0) score += 10;
  
  const percentage = Math.round((score / maxScore) * 100);
  let status = 'Poor';
  if (percentage >= 80) status = 'Excellent';
  else if (percentage >= 60) status = 'Good';
  else if (percentage >= 40) status = 'Fair';
  
  return `${percentage}% (${status})`;
}

// Run the checker
checkTONContract();