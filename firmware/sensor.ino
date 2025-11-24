#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// WiFi credentials - UPDATE THESE!
const char* ssid = "YOUR_WIFI_NAME";     // Ganti dengan nama WiFi
const char* password = "YOUR_WIFI_PASSWORD"; // Ganti dengan password WiFi

// API endpoint - Production ready
const char* serverURL = "https://backend-972ieecg0-pratamas-projects.vercel.app/api/submit"; // Production
// const char* serverURL = "http://192.168.0.6:3001/api/submit"; // Local testing

// Sensor configuration
const int sensorPin = 34;  // MQ-135 analog pin
const String sensorId = "ESP32_01";  // Unique sensor ID

// Timing
unsigned long lastReading = 0;
const unsigned long readingInterval = 30000; // 30 seconds

void setup() {
  Serial.begin(115200);
  
  // Initialize sensor pin
  pinMode(sensorPin, INPUT);
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println();
  Serial.println("WiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // Check if it's time for a new reading
  if (millis() - lastReading >= readingInterval) {
    readAndSendData();
    lastReading = millis();
  }
  
  delay(1000);
}

void readAndSendData() {
  // Read sensor value
  int sensorValue = analogRead(sensorPin);
  
  // Convert to AQI (simplified calculation)
  // In real implementation, use proper MQ-135 calibration
  int aqi = map(sensorValue, 0, 4095, 0, 500);
  
  Serial.print("Sensor Value: ");
  Serial.print(sensorValue);
  Serial.print(" | AQI: ");
  Serial.println(aqi);
  
  // Send data to server
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverURL);
    http.addHeader("Content-Type", "application/json");
    http.setTimeout(10000); // 10 second timeout
    http.setConnectTimeout(5000); // 5 second connect timeout
    
    // Create JSON payload
    DynamicJsonDocument doc(1024);
    doc["sensorId"] = sensorId;
    doc["aqi"] = aqi;
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    // Send POST request
    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.print("HTTP Response: ");
      Serial.println(httpResponseCode);
      Serial.print("Response: ");
      Serial.println(response);
      
      // Parse response to get points
      DynamicJsonDocument responseDoc(1024);
      deserializeJson(responseDoc, response);
      
      if (responseDoc["success"]) {
        Serial.print("Points earned: ");
        Serial.println(responseDoc["points"].as<int>());
      }
    } else {
      Serial.print("Error sending data: ");
      Serial.println(httpResponseCode);
    }
    
    http.end();
  } else {
    Serial.println("WiFi not connected");
  }
}

// Function to get air quality description
String getAQIDescription(int aqi) {
  if (aqi <= 50) return "Good";
  else if (aqi <= 100) return "Moderate";
  else if (aqi <= 150) return "Unhealthy for Sensitive";
  else if (aqi <= 200) return "Unhealthy";
  else if (aqi <= 300) return "Very Unhealthy";
  else return "Hazardous";
}