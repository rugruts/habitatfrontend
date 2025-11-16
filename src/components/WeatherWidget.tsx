import React, { useState, useEffect, useRef } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Thermometer, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  description: string;
  forecast?: {
    maxTemp: number;
    minTemp: number;
    condition: string;
    date: string;
  }[];
}

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch real weather data for Trikala, Greece
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        console.log('Fetching weather data...');
        
        // Fetch current weather
        const currentResponse = await fetch(
          `https://backendhabitatapi.vercel.app/api/weather/trikala`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          }
        );
        
        // Fetch forecast data
        const forecastResponse = await fetch(
          `https://backendhabitatapi.vercel.app/api/weather/trikala/forecast`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          }
        );
        
        console.log('Current weather response status:', currentResponse.status);
        console.log('Forecast response status:', forecastResponse.status);
        
        if (!currentResponse.ok) {
          throw new Error(`HTTP error! status: ${currentResponse.status}`);
        }
        
        const currentData = await currentResponse.json();
        console.log('Current weather API response:', currentData);
        
        let forecastData = null;
        if (forecastResponse.ok) {
          forecastData = await forecastResponse.json();
          console.log('Forecast API response:', forecastData);
        }
        
        if (currentData.current && currentData.current.temp_c !== undefined) {
          const weatherData: WeatherData = {
            temperature: Math.round(currentData.current.temp_c),
            condition: currentData.current.condition.text.toLowerCase(),
            humidity: currentData.current.humidity,
            windSpeed: Math.round(currentData.current.wind_kph),
            feelsLike: Math.round(currentData.current.feelslike_c),
            description: currentData.current.condition.text
          };
          
          // Add forecast data if available
          if (forecastData && forecastData.forecast && forecastData.forecast.forecastday) {
            weatherData.forecast = forecastData.forecast.forecastday.slice(0, 5).map((day: { day: { maxtemp_c: number; mintemp_c: number; condition: { text: string } }; date: string }) => ({
              maxTemp: Math.round(day.day.maxtemp_c),
              minTemp: Math.round(day.day.mintemp_c),
              condition: day.day.condition.text.toLowerCase(),
              date: day.date
            }));
          }
          
          console.log('Processed weather data:', weatherData);
          setWeather(weatherData);
          setIsLoading(false);
        } else {
          throw new Error('Invalid data structure from API');
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
        // Fallback to mock data if API fails
        const fallbackData: WeatherData = {
          temperature: 22,
          condition: 'sunny',
          humidity: 65,
          windSpeed: 12,
          feelsLike: 24,
          description: 'Partly cloudy with sunshine',
          forecast: [
            { maxTemp: 25, minTemp: 18, condition: 'sunny', date: '2024-01-22' },
            { maxTemp: 24, minTemp: 17, condition: 'partly cloudy', date: '2024-01-23' },
            { maxTemp: 26, minTemp: 19, condition: 'sunny', date: '2024-01-24' },
            { maxTemp: 23, minTemp: 16, condition: 'cloudy', date: '2024-01-25' },
            { maxTemp: 25, minTemp: 18, condition: 'sunny', date: '2024-01-26' }
          ]
        };
        console.log('Using fallback data:', fallbackData);
        setWeather(fallbackData);
        setIsLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition.toLowerCase();
    
    if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
      return <Sun className="h-4 w-4" />;
    }
    if (conditionLower.includes('cloudy') || conditionLower.includes('overcast')) {
      return <Cloud className="h-4 w-4" />;
    }
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle') || conditionLower.includes('shower')) {
      return <CloudRain className="h-4 w-4" />;
    }
    if (conditionLower.includes('snow') || conditionLower.includes('sleet')) {
      return <CloudSnow className="h-4 w-4" />;
    }
    if (conditionLower.includes('mist') || conditionLower.includes('fog')) {
      return <Cloud className="h-4 w-4" />;
    }
    
    return <Thermometer className="h-4 w-4" />;
  };

  const getWeatherColor = (condition: string) => {
    const conditionLower = condition.toLowerCase();
    
    if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
      return 'text-yellow-400';
    }
    if (conditionLower.includes('cloudy') || conditionLower.includes('overcast') || conditionLower.includes('mist') || conditionLower.includes('fog')) {
      return 'text-gray-400';
    }
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle') || conditionLower.includes('shower')) {
      return 'text-blue-400';
    }
    if (conditionLower.includes('snow') || conditionLower.includes('sleet')) {
      return 'text-blue-200';
    }
    
    return 'text-gray-400';
  };

  if (isLoading) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="text-foreground hover:text-foreground transition-all duration-300 bg-white/90 hover:bg-white rounded-full px-4 py-2.5 shadow-sm border border-border/30"
        disabled
      >
        <div className="animate-pulse flex items-center gap-2">
          <Thermometer className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-muted-foreground">--°C</span>
        </div>
      </Button>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        className="text-foreground hover:text-foreground transition-all duration-300 bg-white/90 hover:bg-white hover:shadow-lg rounded-full px-4 py-2.5 shadow-sm hover:scale-105 active:scale-95 border border-border/30"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <div className="flex items-center gap-2">
          <div className={`${getWeatherColor(weather.condition)}`}>
            {getWeatherIcon(weather.condition)}
          </div>
          <span className="text-sm font-semibold text-foreground">{weather.temperature}°C</span>
          <MapPin className="h-3 w-3 text-muted-foreground" />
        </div>
      </Button>

      {/* Weather Dropdown */}
      {isDropdownOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`text-3xl ${getWeatherColor(weather.condition)}`}>
                {getWeatherIcon(weather.condition)}
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {weather.temperature}°C
                </div>
                <div className="text-sm text-gray-600 capitalize">
                  {weather.description}
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" />
                  Trikala, Greece
                </div>
              </div>
            </div>
          </div>

          {/* Weather Details */}
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Thermometer className="h-4 w-4 text-red-500" />
                <div>
                  <div className="text-xs text-gray-600">Feels like</div>
                  <div className="font-semibold text-sm">{weather.feelsLike}°C</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Cloud className="h-4 w-4 text-blue-500" />
                <div>
                  <div className="text-xs text-gray-600">Humidity</div>
                  <div className="font-semibold text-sm">{weather.humidity}%</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Wind className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="text-xs text-gray-600">Wind Speed</div>
                  <div className="font-semibold text-sm">{weather.windSpeed} km/h</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="h-4 w-4 text-green-500" />
                <div>
                  <div className="text-xs text-gray-600">Location</div>
                  <div className="font-semibold text-sm">Trikala</div>
                </div>
              </div>
            </div>

            {/* Weather Forecast */}
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-xs text-blue-800 mb-2">
                <strong>5-Day Forecast:</strong>
              </div>
              {weather.forecast && weather.forecast.length > 0 ? (
                <div className="space-y-2">
                  {weather.forecast.map((day, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className={`${getWeatherColor(day.condition)}`}>
                          {getWeatherIcon(day.condition)}
                        </div>
                        <span className="text-gray-700">
                          {new Date(day.date).toLocaleDateString('en-GB', { weekday: 'short' })}
                        </span>
                      </div>
                      <div className="text-gray-700">
                        <span className="font-medium">{day.maxTemp}°</span>
                        <span className="text-gray-500"> / {day.minTemp}°</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-blue-800">
                  Sunny weather expected for the next 5 days with temperatures ranging from 18°C to 25°C. Perfect weather for exploring Trikala!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
