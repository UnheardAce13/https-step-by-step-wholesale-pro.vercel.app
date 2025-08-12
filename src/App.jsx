import React, { useState } from 'react';

// Simple icon components using SVG
const SearchIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    accessCode: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Login attempted for ${formData.email}. This is a demo - full authentication coming soon!`);
  };

  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <BuildingIcon />
              <h1 className="text-2xl font-bold text-gray-900">Step by Step Wholesale Pro</h1>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={() => setActiveTab('investor')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Investor Login
              </button>
              <button 
                onClick={() => setActiveTab('wholesaler')}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Wholesaler Login
              </button>
              <button 
                onClick={() => setActiveTab('admin')}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Admin Login
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Find, Analyze & Contract Properties with AI
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Our AI-powered bots discover off-market properties, verify agents, and generate contracts automatically. 
            Join the future of wholesale real estate investing.
          </p>
          
          {/* Beta Banner */}
          <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mb-12 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-2">
              <StarIcon />
              <span className="text-yellow-800 font-semibold">Beta Testing Phase - Limited Spots Available!</span>
            </div>
          </div>

          {/* AI Bots Showcase */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-blue-600">
                <SearchIcon />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Market Scanner Bot</h3>
              <p className="text-gray-600 mb-6">
                Scans 50+ listing platforms daily to find off-market properties with high profit potential.
              </p>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Properties Found Today:</span>
                  <span className="font-bold text-green-600">127</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600">Success Rate:</span>
                  <span className="font-bold text-green-600">94%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-purple-600">
                <ShieldIcon />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Agent Verification Bot</h3>
              <p className="text-gray-600 mb-6">
                Automatically verifies agent credentials, reviews, and transaction history to prevent fraud.
              </p>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Agents Verified:</span>
                  <span className="font-bold text-purple-600">2,847</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600">Fraud Prevention:</span>
                  <span className="font-bold text-purple-600">99.8%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-green-600">
                <TrendingUpIcon />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Deal Analysis Bot</h3>
              <p className="text-gray-600 mb-6">
                Calculates ARV, repair costs, and profit margins in seconds using market data and AI analysis.
              </p>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Deals Analyzed:</span>
                  <span className="font-bold text-blue-600">15,432</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600">Avg ROI Predicted:</span>
                  <span className="font-bold text-blue-600">28%</span>
                </div>
              </div>
            </div>
          </div>

          {/* User Type Selection */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-blue-600">
                <TrendingUpIcon />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">For Investors</h3>
              <p className="text-gray-600 mb-6">
                Access exclusive wholesale deals, AI-powered property analysis, and automated bidding systems.
              </p>
              <ul className="text-left space-y-2 mb-8">
                <li className="flex items-center space-x-2">
                  <CheckCircleIcon />
                  <span className="text-gray-700">Exclusive off-market properties</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircleIcon />
                  <span className="text-gray-700">AI-powered ROI analysis</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircleIcon />
                  <span className="text-gray-700">Automated bidding system</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircleIcon />
                  <span className="text-gray-700">$49 bid fee + 1% closing commission</span>
                </li>
              </ul>
              <button 
                onClick={() => setActiveTab('investor')}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRightIcon />
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-green-600">
                <BuildingIcon />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">For Wholesalers</h3>
              <p className="text-gray-600 mb-6">
                List properties with AI-generated marketing, connect with verified investors, and automate contracts.
              </p>
              <ul className="text-left space-y-2 mb-8">
                <li className="flex items-center space-x-2">
                  <CheckCircleIcon />
                  <span className="text-gray-700">AI property discovery bots</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircleIcon />
                  <span className="text-gray-700">Automated contract generation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircleIcon />
                  <span className="text-gray-700">Verified investor network</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircleIcon />
                  <span className="text-gray-700">$149-$499/month subscription plans</span>
                </li>
              </ul>
              <button 
                onClick={() => setActiveTab('wholesaler')}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRightIcon />
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-purple-600">
                <UsersIcon />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Admin Access</h3>
              <p className="text-gray-600 mb-6">
                Manage platform operations, generate trial codes, monitor AI bots, and oversee all transactions.
              </p>
              <ul className="text-left space-y-2 mb-8">
                <li className="flex items-center space-x-2">
                  <CheckCircleIcon />
                  <span className="text-gray-700">Platform management tools</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircleIcon />
                  <span className="text-gray-700">Trial code generation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircleIcon />
                  <span className="text-gray-700">AI bot monitoring</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircleIcon />
                  <span className="text-gray-700">Revenue analytics dashboard</span>
                </li>
              </ul>
              <button 
                onClick={() => setActiveTab('admin')}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Admin Portal</span>
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">2,847</div>
              <div className="text-gray-300">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">$24.7M</div>
              <div className="text-gray-300">Properties Transacted</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">15,432</div>
              <div className="text-gray-300">Deals Analyzed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">94%</div>
              <div className="text-gray-300">Success Rate</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const LoginPage = ({ userType, color }) => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className={`bg-${color}-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-${color}-600`}>
            {userType === 'investor' && <TrendingUpIcon />}
            {userType === 'wholesaler' && <BuildingIcon />}
            {userType === 'admin' && <UsersIcon />}
          </div>
          <h2 className="text-3xl font-bold text-gray-900 capitalize">{userType} Portal</h2>
          <p className="text-gray-600 mt-2">Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>

          {userType !== 'admin' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Code (Required for Beta)
              </label>
              <input
                type="text"
                name="accessCode"
                value={formData.accessCode}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter beta access code"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Beta access code required. Contact admin for access.
              </p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>$1 Verification:</strong> A $1 charge will be applied to verify your payment method. This will be refunded within 24 hours.
            </p>
          </div>

          <button
            type="submit"
            className={`w-full bg-${color}-600 text-white py-3 rounded-lg hover:bg-${color}-700 transition-colors font-semibold`}
          >
            Sign In & Verify ($1)
          </button>

          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button 
                type="button"
                onClick={() => alert('Registration coming soon! Contact admin for beta access.')}
                className={`text-${color}-600 hover:text-${color}-700 font-semibold`}
              >
                Request Beta Access
              </button>
            </p>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => setActiveTab('home')}
            className="w-full text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );

  // Render based on active tab
  if (activeTab === 'investor') {
    return <LoginPage userType="investor" color="blue" />;
  }
  
  if (activeTab === 'wholesaler') {
    return <LoginPage userType="wholesaler" color="green" />;
  }
  
  if (activeTab === 'admin') {
    return <LoginPage userType="admin" color="purple" />;
  }

  return <HomePage />;
}

export default App;

