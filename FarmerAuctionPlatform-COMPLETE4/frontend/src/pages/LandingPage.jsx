import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  Users, 
  Gavel, 
  Shield, 
  TrendingUp, 
  Clock,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: <Gavel className="w-8 h-8 text-primary-600" />,
      title: "Live Auctions",
      description: "Real-time bidding system with transparent pricing for all agricultural produce."
    },
    {
      icon: <Shield className="w-8 h-8 text-primary-600" />,
      title: "Secure Bidding",
      description: "Verified farmers and buyers with secure payment processing and fraud protection."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary-600" />,
      title: "Fair Pricing",
      description: "Market-driven prices ensuring farmers get the best value for their crops."
    },
    {
      icon: <Clock className="w-8 h-8 text-primary-600" />,
      title: "Quick Settlement",
      description: "Fast auction completion and immediate payment processing for all parties."
    }
  ];

  const testimonials = [
    {
      name: "Ravi Kumar",
      role: "Farmer from Karnataka",
      content: "This platform helped me get 30% better prices for my tomatoes compared to local markets.",
      avatar: "👨‍🌾"
    },
    {
      name: "Priya Traders",
      role: "Buyer from Mumbai",
      content: "Direct connection with farmers ensures fresh produce and competitive prices for our business.",
      avatar: "👩‍💼"
    },
    {
      name: "Suresh Patel",
      role: "Farmer from Gujarat",
      content: "The real-time bidding system is transparent and fair. I trust this platform completely.",
      avatar: "👨‍🌾"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Empowering Farmers,
              <br />
              <span className="text-secondary-300">Connecting Buyers</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
              Join India's most trusted agricultural auction platform where farmers get fair prices 
              and buyers get quality produce through transparent bidding.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/farmer/signup"
                className="btn btn-lg bg-white text-primary-600 hover:bg-gray-100 px-8"
              >
                <Sprout className="w-5 h-5 mr-2" />
                Register as Farmer
              </Link>
              <Link
                to="/buyer/signup"
                className="btn btn-lg border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8"
              >
                <Users className="w-5 h-5 mr-2" />
                Register as Buyer
              </Link>
            </div>

            <div className="mt-8">
              <Link
                to="/auctions"
                className="inline-flex items-center text-green-100 hover:text-white transition-colors"
              >
                Browse Active Auctions
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide a comprehensive solution for agricultural trading with modern technology and traditional values.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to start trading on our platform
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* For Farmers */}
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Sprout className="w-6 h-6 text-primary-600 mr-2" />
                For Farmers
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-600 font-semibold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Register & Verify</h4>
                    <p className="text-gray-600">Create your farmer account and verify your details</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-600 font-semibold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">List Your Crops</h4>
                    <p className="text-gray-600">Add your produce with photos and set minimum bid price</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-600 font-semibold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Receive Bids</h4>
                    <p className="text-gray-600">Watch buyers compete for your crops in real-time</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-600 font-semibold">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Accept & Deliver</h4>
                    <p className="text-gray-600">Accept the best bid and arrange delivery</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Buyers */}
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Users className="w-6 h-6 text-primary-600 mr-2" />
                For Buyers
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-600 font-semibold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Register & Browse</h4>
                    <p className="text-gray-600">Create your buyer account and explore available auctions</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-600 font-semibold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Place Bids</h4>
                    <p className="text-gray-600">Bid on crops that match your requirements</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-600 font-semibold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Win Auctions</h4>
                    <p className="text-gray-600">Get notified when you win and farmer accepts your bid</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-600 font-semibold">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Receive Produce</h4>
                    <p className="text-gray-600">Coordinate delivery and receive fresh produce</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from farmers and buyers who trust our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">{testimonial.avatar}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Trading?
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Join thousands of farmers and buyers who trust our platform for fair agricultural trade.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/farmer/signup"
              className="btn btn-lg bg-white text-primary-600 hover:bg-gray-100"
            >
              Start Selling Your Crops
            </Link>
            <Link
              to="/buyer/signup"
              className="btn btn-lg border-2 border-white text-white hover:bg-white hover:text-primary-600"
            >
              Start Buying Fresh Produce
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
