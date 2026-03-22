import React, { useState, useCallback, useRef } from 'react'; // remove useEffect if not used

const GEOAPIFY_API_KEY = '5c9271b3112c4a81b93188276e770191';
const AUTOCOMPLETE_URL = 'https://api.geoapify.com/v1/geocode/autocomplete';

const GeoapifyAddressInput = ({ value, onChange, onPlaceSelected }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const debounceTimer = useRef(null);

  const fetchSuggestions = useCallback(async (input) => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const url = `${AUTOCOMPLETE_URL}?text=${encodeURIComponent(input)}&apiKey=${GEOAPIFY_API_KEY}&limit=5`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.features) {
        setSuggestions(data.features);
        setShowDropdown(true);
      }
    } catch (error) {
      console.error('Geoapify error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    onChange(val);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(val);
    }, 300);
  };

  const handleSuggestionClick = (feature) => {
    console.log('🎯 Suggestion clicked inside GeoapifyAddressInput:', feature);
    const { properties, geometry } = feature;
    const address = properties.formatted;
    const [lng, lat] = geometry.coordinates; // Geoapify returns [lon, lat]
    onPlaceSelected({ address, lat, lng });
    setSuggestions([]);
    setShowDropdown(false);
  };

  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 200);
  };

  return (
    <div style={{ position: 'relative' }}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
        placeholder="Enter your address"
        style={{ width: '100%', padding: '8px' }}
      />
      {loading && <div style={{ position: 'absolute', right: '10px', top: '10px' }}>Loading...</div>}
      {showDropdown && suggestions.length > 0 && (
        <ul style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'white',
          border: '1px solid #ccc',
          maxHeight: '200px',
          overflowY: 'auto',
          zIndex: 1000,
          margin: 0,
          padding: 0,
          listStyle: 'none'
        }}>
          {suggestions.map((feature, idx) => (
            <li
              key={idx}
              onMouseDown={() => handleSuggestionClick(feature)}
              style={{
                padding: '8px',
                cursor: 'pointer',
                borderBottom: '1px solid #eee'
              }}
            >
              {feature.properties.formatted}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GeoapifyAddressInput;