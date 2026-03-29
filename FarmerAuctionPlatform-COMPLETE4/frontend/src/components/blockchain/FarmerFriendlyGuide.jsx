import React from 'react';
import { Smartphone, DollarSign, Globe, Shield } from 'lucide-react';

const FarmerFriendlyGuide = () => {
  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-8 border border-green-200">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">💰</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Get Paid Instantly from Anywhere in the World
        </h2>
        <p className="text-lg text-gray-600">
          Sell your crops and receive digital money payments in minutes, not days
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 border border-green-200">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold text-gray-900">Instant Money</h3>
              <p className="text-gray-600">Get paid in minutes, not weeks</p>
            </div>
          </div>
          <p className="text-gray-700">
            No more waiting for bank transfers or checks to clear. Receive your payment instantly when you sell your crops.
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-blue-200">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold text-gray-900">Global Buyers</h3>
              <p className="text-gray-600">Sell to anyone, anywhere</p>
            </div>
          </div>
          <p className="text-gray-700">
            Reach buyers from all over the world. No borders, no limits. Your crops can be sold internationally.
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-purple-200">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold text-gray-900">Safe & Secure</h3>
              <p className="text-gray-600">Your money is protected</p>
            </div>
          </div>
          <p className="text-gray-700">
            Advanced security protects your payments. No risk of fraud or bounced checks.
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-orange-200">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold text-gray-900">Easy to Use</h3>
              <p className="text-gray-600">Simple as using WhatsApp</p>
            </div>
          </div>
          <p className="text-gray-700">
            Just install one free app on your phone. No complicated setup or technical knowledge needed.
          </p>
        </div>
      </div>

      {/* Simple Steps */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          📱 3 Simple Steps to Start
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">1</span>
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Download App</h4>
            <p className="text-gray-600">
              Install the free payment app on your phone or computer. Takes 2 minutes.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">2</span>
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Get Test Money</h4>
            <p className="text-gray-600">
              We'll give you ₹7,50,000 worth of test money to practice with. Completely free!
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">3</span>
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Start Selling</h4>
            <p className="text-gray-600">
              List your crops and start receiving instant payments from buyers worldwide.
            </p>
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="bg-green-50 rounded-lg p-6 border border-green-200 mb-8">
        <h3 className="text-xl font-bold text-green-900 mb-4">
          🌟 What Other Farmers Say
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <p className="text-gray-700 mb-3">
              "I sold my tomatoes to a buyer in Mumbai and got paid in 5 minutes! No more waiting for weeks."
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">R</span>
              </div>
              <div className="ml-3">
                <p className="font-semibold text-gray-900">Ravi Kumar</p>
                <p className="text-sm text-gray-600">Tomato Farmer, Karnataka</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-green-200">
            <p className="text-gray-700 mb-3">
              "Now I can sell my onions to buyers in other countries. My income increased by 40%!"
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <div className="ml-3">
                <p className="font-semibold text-gray-900">Sita Devi</p>
                <p className="text-sm text-gray-600">Onion Farmer, Maharashtra</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Ready to Start Earning More?
        </h3>
        <p className="text-gray-600 mb-6">
          Join thousands of farmers already earning more with digital money payments
        </p>
        <div className="space-y-4">
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-600 transition-colors"
          >
            📱 Download Free Payment App
          </a>
          <p className="text-sm text-gray-500">
            100% Free • No hidden charges • Works on all phones
          </p>
        </div>
      </div>

      {/* Help */}
      <div className="mt-8 bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="font-bold text-blue-900 mb-2">📞 Need Help?</h4>
        <p className="text-blue-800 text-sm">
          Call our farmer support team: <strong>1800-123-4567</strong> (Toll Free)
          <br />
          Available in Hindi, English, Tamil, Telugu, Marathi, and Gujarati
        </p>
      </div>
    </div>
  );
};

export default FarmerFriendlyGuide;
