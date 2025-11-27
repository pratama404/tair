import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react'
import { Card, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

const articles = {
  1: {
    title: "DePIN Revolution: How T-Air is Democratizing Air Quality Monitoring",
    content: `
      <h2>The Rise of Decentralized Physical Infrastructure</h2>
      <p>Decentralized Physical Infrastructure Networks (DePIN) represent a paradigm shift in how we build and maintain physical infrastructure. Unlike traditional centralized systems, DePIN leverages blockchain technology and token incentives to create distributed networks of physical devices.</p>
      
      <h3>T-Air's Approach to DePIN</h3>
      <p>T-Air exemplifies this revolution by creating a decentralized network of air quality sensors. Each ESP32 device equipped with MQ-135 sensors contributes to a global air quality monitoring network, earning TON tokens for data contributions.</p>
      
      <h3>Benefits of Decentralized Monitoring</h3>
      <ul>
        <li><strong>Cost Efficiency:</strong> Distributed ownership reduces infrastructure costs</li>
        <li><strong>Data Accuracy:</strong> Multiple sensors provide more comprehensive coverage</li>
        <li><strong>Incentive Alignment:</strong> Token rewards motivate quality data collection</li>
        <li><strong>Transparency:</strong> Blockchain ensures data integrity and traceability</li>
      </ul>
      
      <h3>The Future of Environmental Monitoring</h3>
      <p>As climate change becomes increasingly urgent, decentralized monitoring networks like T-Air provide the granular data needed for effective environmental policy and personal health decisions.</p>
    `,
    category: "DePIN",
    date: "2025-01-12",
    readTime: "5 min read",
    image: "🌐"
  },
  2: {
    title: "Web3 Meets Environmental Sustainability: The T-Air Approach",
    content: `
      <h2>Bridging Technology and Environment</h2>
      <p>The intersection of Web3 technology and environmental sustainability opens new possibilities for climate action. T-Air demonstrates how blockchain incentives can motivate environmental data collection.</p>
      
      <h3>Token Economics for Environmental Good</h3>
      <p>By rewarding users with TON tokens for contributing air quality data, T-Air creates a sustainable economic model that benefits both individual users and the global community.</p>
      
      <h3>Smart Contracts for Transparency</h3>
      <p>All reward distributions are handled through smart contracts on the TON blockchain, ensuring transparent and automated payments to contributors.</p>
    `,
    category: "Web3",
    date: "2025-01-11", 
    readTime: "4 min read",
    image: "🌱"
  },
  3: {
    title: "SDG 3 & 11: How T-Air Contributes to UN Sustainable Development Goals",
    content: `
      <h2>Aligning with Global Sustainability Goals</h2>
      <p>The United Nations Sustainable Development Goals provide a framework for global progress. T-Air directly contributes to SDG 3 (Good Health and Well-being) by monitoring air quality that affects public health.</p>
      
      <h3>SDG 3: Good Health and Well-being</h3>
      <p>Air pollution is one of the leading causes of premature death globally. T-Air's real-time monitoring helps individuals make informed decisions about outdoor activities and health protection.</p>
      
      <h3>SDG 11: Sustainable Cities and Communities</h3>
      <p>Urban planning requires comprehensive environmental data. T-Air's distributed sensor network provides city planners with granular air quality data for better decision-making.</p>
    `,
    category: "SDGs",
    date: "2025-01-10",
    readTime: "6 min read",
    image: "🎯"
  },
  4: {
    title: "MQ-135 Sensor Technology: The Science Behind T-Air",
    content: `
      <h2>Understanding MQ-135 Gas Sensor Technology</h2>
      <p>The MQ-135 sensor is a versatile gas sensor capable of detecting various air pollutants including CO, NH3, alcohol, and smoke. Understanding its capabilities and limitations is crucial for accurate air quality monitoring.</p>
      
      <h3>Detection Capabilities</h3>
      <ul>
        <li><strong>Carbon Monoxide (CO):</strong> 10-1000 ppm detection range</li>
        <li><strong>Ammonia (NH3):</strong> 10-300 ppm detection range</li>
        <li><strong>Alcohol:</strong> 10-300 ppm detection range</li>
        <li><strong>Smoke:</strong> Particulate matter detection</li>
      </ul>
      
      <h3>Calibration and Accuracy</h3>
      <p>Proper calibration is essential for accurate readings. T-Air implements automatic calibration algorithms to ensure consistent data quality across all sensors in the network.</p>
    `,
    category: "Technology",
    date: "2025-01-09",
    readTime: "7 min read",
    image: "🔬"
  },
  5: {
    title: "TON Blockchain Integration: Powering Decentralized Rewards",
    content: `
      <h2>Why TON for T-Air?</h2>
      <p>The Open Network (TON) provides the perfect foundation for T-Air's reward system. With fast transactions, low fees, and Telegram integration, TON enables seamless reward distribution to sensor operators.</p>
      
      <h3>Smart Contract Architecture</h3>
      <p>T-Air's smart contracts handle automatic reward distribution based on data quality and consistency. The transparent nature of blockchain ensures fair compensation for all contributors.</p>
      
      <h3>Telegram Integration</h3>
      <p>TON's native integration with Telegram allows T-Air users to manage their rewards directly through the Telegram bot interface, creating a seamless user experience.</p>
    `,
    category: "Blockchain",
    date: "2025-01-08",
    readTime: "5 min read",
    image: "💎"
  },
  6: {
    title: "Building Smart Cities with Citizen-Powered Air Quality Networks",
    content: `
      <h2>The Smart City Vision</h2>
      <p>Smart cities rely on comprehensive data to make informed decisions. T-Air's decentralized approach to air quality monitoring provides city planners with granular, real-time data that traditional monitoring stations cannot match.</p>
      
      <h3>Citizen Participation</h3>
      <p>By incentivizing citizens to operate air quality sensors, T-Air creates a participatory approach to urban environmental monitoring. This bottom-up data collection complements traditional top-down monitoring systems.</p>
      
      <h3>Data-Driven Urban Planning</h3>
      <p>High-resolution air quality data enables more precise urban planning decisions, from traffic management to green space development, ultimately creating healthier and more sustainable cities.</p>
    `,
    category: "Smart Cities",
    date: "2025-01-07",
    readTime: "8 min read",
    image: "🏙️"
  }
}

export function ArticleDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const article = articles[id]

  if (!article) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold mb-4">Article Not Found</h2>
        <Button onClick={() => navigate('/news')}>Back to News</Button>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Button 
        variant="secondary" 
        onClick={() => navigate('/news')}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft size={16} />
        Back to News
      </Button>

      <Card>
        <CardContent className="p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-3xl">{article.image}</span>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              {article.category}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(article.date).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {article.readTime}
            </span>
          </div>

          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Published by T-Air Team
              </div>
              <Button onClick={() => navigate('/news')}>
                More Articles
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}