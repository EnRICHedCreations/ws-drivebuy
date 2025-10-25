import React, { useState, useRef } from 'react';
import { MapView, MapViewRef } from './components/MapView';
import { LeadForm } from './components/LeadForm';
import { LeadList } from './components/LeadList';
import { ExportButton } from './components/ExportButton';
import { useAuth } from './hooks/useAuth';
import { useLeads } from './hooks/useLeads';
import { reverseGeocode } from './services/maps';
import { Lead } from './types';
import { Menu, Sun, Moon, LogOut } from 'lucide-react';

function App() {
  const { user, loading, signOut } = useAuth();
  const { leads, addLead, deleteLead } = useLeads(user?.uid || '');
  const [showModal, setShowModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number; heading: number; pitch: number; zoom: number; address: string; } | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const mapViewRef = useRef<MapViewRef>(null);

  const handleLocationTag = async (location: { lat: number; lng: number; heading: number; pitch: number; zoom: number; } | null) => {
    if (!location) return;

    const fullLocation = {
        ...location,
        address: await reverseGeocode(location.lat, location.lng)
    };

    setCurrentLocation(fullLocation);
    setShowModal(true);
  };

  const handleSaveLead = async (leadData: Omit<Lead, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const leadWithUser: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'> = {
      ...leadData,
      userId: user!.uid
    };
    await addLead(leadWithUser);
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div className={`${darkMode ? 'dark' : ''} h-screen flex flex-col`}>
      {/* Header */}
      <header className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center z-10 shadow-lg">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">🏠 Virtual D4D</h1>
          <span className="text-sm text-gray-400">
            {user.email}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <ExportButton leads={leads} />
          
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            <Menu size={20} />
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={signOut}
            className="p-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map */}
        <div className="flex-1 relative">
          <MapView
            ref={mapViewRef}
            onLocationTag={handleLocationTag}
          />
        </div>

        {/* Sidebar */}
        {showSidebar && (
          <div className="w-96 border-l border-gray-200 bg-white overflow-hidden">
            <LeadList
              leads={leads}
              onDelete={deleteLead}
              onLeadClick={(lead) => {
                mapViewRef.current?.moveTo(lead.lat, lead.lng);
              }}
            />
          </div>
        )}
      </div>

      {/* Lead Form Modal */}
      {showModal && currentLocation && (
        <LeadForm
          location={currentLocation}
          onSave={handleSaveLead}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

// Auth Screen Component
const AuthScreen: React.FC = () => {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🏠 Virtual D4D</h1>
          <p className="text-gray-600">Scout properties from your couch</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-lg"
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            onClick={() => signInWithGoogle()}
            className="mt-4 w-full px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold flex items-center justify-center gap-2"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Google
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
