import { HelpCircle, MessageCircle, Book, Wrench, ExternalLink } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

const faqs = [
  {
    question: "How does T-Air work?",
    answer: "T-Air uses ESP32 sensors with MQ-135 air quality sensors to monitor air pollution in real-time. Data is sent to our decentralized network and you earn TON rewards for contributing."
  },
  {
    question: "What is AQI?",
    answer: "Air Quality Index (AQI) is a number used to communicate how polluted the air currently is. Values range from 0-500, where lower numbers indicate better air quality."
  },
  {
    question: "How do I earn rewards?",
    answer: "You earn 5 points for every sensor reading submitted. Collect 100 points to claim 0.1 TON tokens directly to your connected wallet."
  },
  {
    question: "Why is my sensor offline?",
    answer: "Check your WiFi connection, ensure the ESP32 is powered on, and verify the sensor is properly connected. The status should show green when online."
  },
  {
    question: "How to connect TON wallet?",
    answer: "Tap the 'Connect TON' button in the header, choose your preferred wallet (Telegram Wallet, Tonkeeper, or MyTonWallet), and follow the connection prompts."
  }
]

export function Help() {
  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="text-white" size={24} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Help & Support</h1>
        <p className="text-gray-600">Get help with your T-Air system</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent>
            <div className="flex items-center gap-3">
              <MessageCircle size={24} />
              <div>
                <h3 className="font-bold">Contact Support</h3>
                <p className="text-sm opacity-90">Get direct help</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent>
            <div className="flex items-center gap-3">
              <Book size={24} />
              <div>
                <h3 className="font-bold">Documentation</h3>
                <p className="text-sm opacity-90">Read the guides</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle size={20} className="text-purple-500" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="group">
                <summary className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
                  <span className="font-medium text-gray-800">{faq.question}</span>
                  <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-3 p-3 text-gray-600 text-sm leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench size={20} className="text-orange-500" />
            Troubleshooting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 bg-red-50 rounded-2xl">
              <h4 className="font-medium text-red-800 mb-2">Sensor Not Connecting</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Check WiFi credentials in ESP32 code</li>
                <li>• Verify sensor wiring (VCC→3.3V, GND→GND, AOUT→GPIO34)</li>
                <li>• Ensure backend URL is correct</li>
              </ul>
            </div>

            <div className="p-3 bg-yellow-50 rounded-2xl">
              <h4 className="font-medium text-yellow-800 mb-2">Chart Not Updating</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Refresh the page to reload cached data</li>
                <li>• Check if sensor is sending data every 30 seconds</li>
                <li>• Clear app cache in Settings</li>
              </ul>
            </div>

            <div className="p-3 bg-blue-50 rounded-2xl">
              <h4 className="font-medium text-blue-800 mb-2">Wallet Connection Issues</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Ensure you have a TON wallet installed</li>
                <li>• Try connecting with different wallet options</li>
                <li>• Check if you're on the correct network (Testnet/Mainnet)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle size={20} className="text-green-500" />
            Need More Help?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Can't find what you're looking for? Our support team is here to help you with any questions about T-Air.
          </p>
          <Button 
            className="w-full flex items-center gap-2"
            onClick={() => window.open('https://t.me/smyth0', '_blank')}
          >
            <MessageCircle size={16} />
            Contact Support
            <ExternalLink size={16} />
          </Button>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card>
        <CardContent className="text-center">
          <p className="text-sm text-gray-500 mb-2">T-Air v2.0</p>
          <p className="text-xs text-gray-400">
            Decentralized Air Quality Monitoring Network
          </p>
        </CardContent>
      </Card>
    </div>
  )
}