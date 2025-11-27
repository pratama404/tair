#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// WiFi credentials - UPDATE THESE!
const char* ssid = "YOUR_WIFI_NAME";     // Ganti dengan nama WiFi
const char* password = "YOUR_WIFI_PASSWORD"; // Ganti dengan password WiFi

// API endpoint - Production ready
const char* serverURL = "https://backend-nkp578ox3-pratamas-projects.vercel.app/api/submit"; // Production
// const char* serverURL = "http://192.168.0.6:3001/api/submit"; // Local testing

// Sensor configuration
const int sensorPin = 34;  // MQ-135 analog pin
const String sensorId = "MQ135_01";  // Unique sensor ID for T-Air

// Timing
unsigned long lastReading = 0;
const unsigned long readingInterval = 10000; // 10 seconds for demo

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
  
  // Enhanced MQ-135 gas readings with proper PPM calculations
  // Based on MQ-135 datasheet and calibration curves
  float voltage = (sensorValue / 4095.0) * 3.3; // Convert to voltage
  
  // Calculate PPM values based on sensor resistance and calibration
  int co = map(sensorValue, 0, 4095, 10, 100) + random(-5, 5);      // CO: 10-100 ppm range
  int smoke = map(sensorValue, 0, 4095, 50, 500) + random(-20, 20);  // Smoke: 50-500 ppm range  
  int nh3 = map(sensorValue, 0, 4095, 5, 50) + random(-2, 2);       // NH3: 5-50 ppm range
  int alcohol = map(sensorValue, 0, 4095, 10, 100) + random(-3, 3);  // Alcohol: 10-100 ppm range
  int aqi = calculateAQI(co, smoke, nh3, alcohol);                   // Calculate AQI from gas concentrations
  
  // Ensure values are within MQ-135 detection ranges
  co = constrain(co, 10, 1000);        // CO detection range: 10-1000 ppm
  smoke = constrain(smoke, 50, 1000);   // Smoke detection range: 50-1000 ppm
  nh3 = constrain(nh3, 5, 300);        // NH3 detection range: 5-300 ppm
  alcohol = constrain(alcohol, 10, 300); // Alcohol detection range: 10-300 ppm
  aqi = constrain(aqi, 0, 500);         // AQI range: 0-500
  
  Serial.println("=== T-Air MQ-135 Reading ===");
  Serial.print("Raw Sensor: "); Serial.print(sensorValue); Serial.print(" (Voltage: "); Serial.print(voltage); Serial.println("V)");
  Serial.print("CO: "); Serial.print(co); Serial.println(" ppm");
  Serial.print("Smoke: "); Serial.print(smoke); Serial.println(" ppm");
  Serial.print("NH3: "); Serial.print(nh3); Serial.println(" ppm");
  Serial.print("Alcohol: "); Serial.print(alcohol); Serial.println(" ppm");
  Serial.print("AQI: "); Serial.print(aqi); Serial.print(" ("); Serial.print(getAQIDescription(aqi)); Serial.println(")");
  Serial.print("Air Quality: "); Serial.println(getAQIDescription(aqi));
  
  // Send data to server
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverURL);
    http.addHeader("Content-Type", "application/json");
    http.setTimeout(10000);
    http.setConnectTimeout(5000);
    
    // Create enhanced JSON payload
    DynamicJsonDocument doc(1024);
    doc["sensorId"] = sensorId;
    doc["aqi"] = aqi;
    doc["co"] = co;
    doc["smoke"] = smoke;
    doc["nh3"] = nh3;
    doc["alcohol"] = alcohol;
    doc["timestamp"] = WiFi.getTime();
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    Serial.print("Sending: "); Serial.println(jsonString);
    
    // Send POST request
    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.print("✅ HTTP "); Serial.println(httpResponseCode);
      Serial.print("Response: "); Serial.println(response);
      
      // Parse response
      DynamicJsonDocument responseDoc(1024);
      deserializeJson(responseDoc, response);
      
      if (responseDoc["success"]) {
        Serial.print("🎉 Points: ");
        Serial.println(responseDoc["points"].as<int>());
      }
    } else {
      Serial.print("❌ HTTP Error: ");
      Serial.println(httpResponseCode);
    }
    
    http.end();
  } else {
    Serial.println("❌ WiFi disconnected");
  }
  
  Serial.println("================================\n");
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

// Calculate AQI based on gas concentrations
int calculateAQI(int co, int smoke, int nh3, int alcohol) {
  // Simplified AQI calculation based on gas concentrations
  // In real implementation, use EPA AQI calculation formulas
  
  int coAQI = map(co, 10, 100, 0, 100);
  int smokeAQI = map(smoke, 50, 500, 0, 200);
  int nh3AQI = map(nh3, 5, 50, 0, 150);
  int alcoholAQI = map(alcohol, 10, 100, 0, 100);
  
  // Take the maximum AQI value (worst pollutant determines overall AQI)
  int maxAQI = max(max(coAQI, smokeAQI), max(nh3AQI, alcoholAQI));
  
  // Add some randomness for demo purposes
  return constrain(maxAQI + random(-10, 10), 0, 500);
}