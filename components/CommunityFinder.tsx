import React, { useState } from 'react';
import { MapPin, Search, Navigation, ExternalLink, Star } from 'lucide-react';
import { findCommunityResources } from '../services/geminiService';
import { GeoLocation, GroundingMetadata } from '../types';
import ReactMarkdown from 'react-markdown';

const CommunityFinder: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ text: string; grounding?: GroundingMetadata } | null>(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [locError, setLocError] = useState<string | null>(null);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setLoading(false);
        setLocError(null);
      },
      (error) => {
        setLocError("Unable to retrieve your location. Search will be general.");
        setLoading(false);
      }
    );
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    
    const response = await findCommunityResources(
      query, 
      location?.latitude, 
      location?.longitude
    );
    
    setResults(response);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <div className="text-center space-y-3 mb-8">
        <h2 className="text-2xl font-bold text-black">Find Your Tribe</h2>
        <p className="text-gray-500">Discover local places, volunteer opportunities, and social clubs to break the cycle of isolation.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={requestLocation}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
              location 
                ? 'bg-gray-100 border-gray-300 text-black' 
                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-black'
            }`}
          >
            <Navigation size={18} className={location ? "fill-current" : ""} />
            <span className="text-sm font-medium">{location ? "Location Set" : "Use My Location"}</span>
          </button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., 'Book clubs', 'Volunteer shelters', 'Hiking groups'"
              className="w-full h-full min-h-[48px] pl-11 pr-4 rounded-xl border border-gray-200 focus:ring-1 focus:ring-black focus:border-black outline-none placeholder:text-gray-400"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
          
          <button
            onClick={handleSearch}
            disabled={loading || !query}
            className="bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        {locError && <p className="text-xs text-red-500 mt-2">{locError}</p>}
      </div>

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <div className="md:col-span-2 space-y-4">
             {/* Main Text Content */}
             <div className="bg-white p-6 rounded-xl border border-gray-200 prose prose-slate max-w-none">
                <ReactMarkdown>{results.text}</ReactMarkdown>
             </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-black flex items-center gap-2">
              <MapPin size={18} />
              Identified Locations
            </h3>
            
            {!results.grounding?.groundingChunks || results.grounding.groundingChunks.length === 0 ? (
              <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-500 text-center border border-gray-100">
                No specific map data returned. Try a more specific query.
              </div>
            ) : (
              results.grounding.groundingChunks.map((chunk, idx) => {
                if (!chunk.maps) return null;
                return (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 hover:border-black transition-colors group">
                    <h4 className="font-bold text-black mb-1">{chunk.maps.title}</h4>
                    {chunk.maps.placeAnswerSources?.[0]?.reviewSnippets?.[0] && (
                        <div className="text-xs text-gray-500 italic mb-3 border-l-2 border-gray-300 pl-2">
                            "{chunk.maps.placeAnswerSources[0].reviewSnippets[0].content}"
                        </div>
                    )}
                    <a 
                      href={chunk.maps.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-black hover:underline"
                    >
                      View on Maps <ExternalLink size={12} />
                    </a>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityFinder;
