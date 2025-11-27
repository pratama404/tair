import { Calendar, ExternalLink, Tag, Clock } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

const newsArticles = [
  {
    id: 1,
    title: "DePIN Revolution: How T-Air is Democratizing Air Quality Monitoring",
    excerpt: "Discover how decentralized physical infrastructure networks are transforming environmental monitoring through blockchain incentives and IoT sensors.",
    category: "DePIN",
    date: "2025-01-12",
    readTime: "5 min read",
    image: "🌐",
    content: "DePIN (Decentralized Physical Infrastructure Networks) represents a paradigm shift in how we build and maintain physical infrastructure. T-Air exemplifies this revolution by creating a decentralized network of air quality sensors powered by blockchain incentives..."
  },
  {
    id: 2,
    title: "Web3 Meets Environmental Sustainability: The T-Air Approach",
    excerpt: "Learn how blockchain technology and cryptocurrency rewards are driving environmental data collection and climate action.",
    category: "Web3",
    date: "2025-01-11",
    readTime: "4 min read",
    image: "🌱",
    content: "The intersection of Web3 technology and environmental sustainability opens new possibilities for climate action. T-Air demonstrates how token incentives can motivate individuals to contribute to environmental monitoring..."
  },
  {
    id: 3,
    title: "SDG 3 & 11: How T-Air Contributes to UN Sustainable Development Goals",
    excerpt: "Exploring T-Air's impact on Good Health and Well-being (SDG 3) and Sustainable Cities and Communities (SDG 11).",
    category: "SDGs",
    date: "2025-01-10",
    readTime: "6 min read",
    image: "🎯",
    content: "The United Nations Sustainable Development Goals provide a framework for global progress. T-Air directly contributes to SDG 3 (Good Health and Well-being) by monitoring air quality that affects public health..."
  },
  {
    id: 4,
    title: "MQ-135 Sensor Technology: The Science Behind T-Air",
    excerpt: "Deep dive into the MQ-135 gas sensor technology that powers T-Air's air quality monitoring capabilities.",
    category: "Technology",
    date: "2025-01-09",
    readTime: "7 min read",
    image: "🔬",
    content: "The MQ-135 sensor is a versatile gas sensor capable of detecting various air pollutants including CO, NH3, alcohol, and smoke. Understanding its capabilities and limitations is crucial for accurate air quality monitoring..."
  },
  {
    id: 5,
    title: "TON Blockchain Integration: Powering Decentralized Rewards",
    excerpt: "How T-Air leverages The Open Network (TON) blockchain for transparent and efficient reward distribution.",
    category: "Blockchain",
    date: "2025-01-08",
    readTime: "5 min read",
    image: "💎",
    content: "The Open Network (TON) provides the perfect foundation for T-Air's reward system. With fast transactions, low fees, and Telegram integration, TON enables seamless reward distribution to sensor operators..."
  },
  {
    id: 6,
    title: "Building Smart Cities with Citizen-Powered Air Quality Networks",
    excerpt: "How decentralized sensor networks like T-Air are enabling data-driven urban planning and smart city initiatives.",
    category: "Smart Cities",
    date: "2025-01-07",
    readTime: "8 min read",
    image: "🏙️",
    content: "Smart cities rely on comprehensive data to make informed decisions. T-Air's decentralized approach to air quality monitoring provides city planners with granular, real-time data that traditional monitoring stations cannot match..."
  }
]

const categories = ["All", "DePIN", "Web3", "SDGs", "Technology", "Blockchain", "Smart Cities"]

export function News() {
  const handleNewsletterSubscribe = async () => {
    const email = document.getElementById('newsletter-email').value
    if (!email) {
      alert('Please enter your email address')
      return
    }
    
    try {
      const response = await fetch('https://backend-oqwgc3m5x-pratamas-projects.vercel.app/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      if (response.ok) {
        alert('Successfully subscribed to T-Air newsletter!')
        document.getElementById('newsletter-email').value = ''
      } else {
        alert('Subscription failed. Please try again.')
      }
    } catch (error) {
      alert('Network error. Please check your connection.')
    }
  }

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">T-Air News & Insights</h1>
        <p className="text-gray-600">Stay updated with the latest in DePIN, Web3, and environmental technology</p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant="secondary"
            size="sm"
            className="whitespace-nowrap"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Featured Article */}
      <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{newsArticles[0].image}</span>
            <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium">Featured</span>
          </div>
          <h2 className="text-xl font-bold mb-2">{newsArticles[0].title}</h2>
          <p className="text-white/90 mb-4">{newsArticles[0].excerpt}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-white/80">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {new Date(newsArticles[0].date).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {newsArticles[0].readTime}
              </span>
            </div>
            <Button 
              variant="secondary" 
              size="sm" 
              className="bg-white text-blue-600"
              onClick={() => window.location.href = '/article/1'}
            >
              Read More
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {newsArticles.slice(1).map((article) => (
          <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{article.image}</span>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                  {article.category}
                </span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">{article.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(article.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {article.readTime}
                  </span>
                </div>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => window.location.href = `/article/${article.id}`}
                >
                  <ExternalLink size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Newsletter Signup */}
      <Card>
        <CardContent className="text-center p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Stay Updated</h3>
          <p className="text-gray-600 mb-6">Get the latest T-Air news and DePIN insights delivered to your inbox</p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="newsletter-email"
            />
            <Button onClick={handleNewsletterSubscribe}>Subscribe</Button>
          </div>
        </CardContent>
      </Card>

      {/* External Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink size={20} className="text-green-500" />
            Related Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="https://sdgs.un.org/goals" target="_blank" rel="noopener noreferrer" 
               className="p-3 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <p className="font-medium text-gray-800">UN SDGs</p>
                  <p className="text-sm text-gray-500">Sustainable Development Goals</p>
                </div>
              </div>
            </a>
            
            <a href="https://ton.org" target="_blank" rel="noopener noreferrer"
               className="p-3 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💎</span>
                <div>
                  <p className="font-medium text-gray-800">TON Network</p>
                  <p className="text-sm text-gray-500">The Open Network</p>
                </div>
              </div>
            </a>
            
            <a href="https://messari.io/report-category/depin" target="_blank" rel="noopener noreferrer"
               className="p-3 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🌐</span>
                <div>
                  <p className="font-medium text-gray-800">DePIN Research</p>
                  <p className="text-sm text-gray-500">Messari Reports</p>
                </div>
              </div>
            </a>
            
            <a href="https://www.who.int/news-room/fact-sheets/detail/ambient-(outdoor)-air-quality-and-health" target="_blank" rel="noopener noreferrer"
               className="p-3 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏥</span>
                <div>
                  <p className="font-medium text-gray-800">WHO Air Quality</p>
                  <p className="text-sm text-gray-500">Health Guidelines</p>
                </div>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}