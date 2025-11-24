import "@stdlib/deploy";

// Messages for contract interaction
message ClaimReward {
    user: Address;
    amount: Int as coins;
    sensorId: String;
}

message AdminDeposit {
    amount: Int as coins;
}

message DataSubmission {
    sensorId: String;
    aqi: Int;
    timestamp: Int;
}

// User data structure
struct UserData {
    totalPoints: Int;
    totalClaims: Int;
    lastClaimTime: Int;
    sensorId: String;
}

contract AirRewards with Deployable {
    owner: Address;
    totalRewards: Int as coins = 0;
    totalUsers: Int = 0;
    totalDataPoints: Int = 0;
    
    // User mapping (simplified for demo)
    users: map<Address, UserData>;
    
    init(owner: Address) {
        self.owner = owner;
    }
    
    // Admin deposits TON for rewards
    receive(msg: AdminDeposit) {
        require(sender() == self.owner, "Only owner can deposit");
        self.totalRewards = self.totalRewards + msg.amount;
    }
    
    // Record data submission (called by backend)
    receive(msg: DataSubmission) {
        require(sender() == self.owner, "Only backend can submit data");
        self.totalDataPoints = self.totalDataPoints + 1;
        
        // This would update user points in real implementation
        // For now, just track total submissions
    }
    
    // Claim reward for user
    receive(msg: ClaimReward) {
        require(sender() == self.owner, "Only backend can trigger claims");
        require(self.totalRewards >= msg.amount, "Insufficient reward pool");
        require(msg.amount > 0, "Invalid reward amount");
        
        self.totalRewards = self.totalRewards - msg.amount;
        
        // Update user data
        let userData: UserData = self.users.get(msg.user) ?: UserData{
            totalPoints: 0,
            totalClaims: 0,
            lastClaimTime: 0,
            sensorId: msg.sensorId
        };
        
        userData.totalClaims = userData.totalClaims + 1;
        userData.lastClaimTime = now();
        self.users.set(msg.user, userData);
        
        // Send TON to user
        send(SendParameters{
            to: msg.user,
            value: msg.amount,
            mode: SendIgnoreErrors,
            body: "T-Air DePIN Reward - Thank you for contributing air quality data!".asComment()
        });
    }
    
    // Get contract balance
    get fun balance(): Int {
        return myBalance();
    }
    
    // Get reward pool
    get fun rewardPool(): Int {
        return self.totalRewards;
    }
    
    // Get total users
    get fun totalUsers(): Int {
        return self.totalUsers;
    }
    
    // Get total data points collected
    get fun totalDataPoints(): Int {
        return self.totalDataPoints;
    }
    
    // Get user data
    get fun getUserData(user: Address): UserData? {
        return self.users.get(user);
    }
    
    // Calculate reward rate (TON per 100 points)
    get fun rewardRate(): String {
        return "0.1 TON per 100 points";
    }
}