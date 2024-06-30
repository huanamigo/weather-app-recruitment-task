import { useEffect, useState } from 'react';
import styles from './App.module.scss';
import { WeatherType } from './types';
import { Route, Routes, useSearchParams } from 'react-router-dom';
import SearchBar from './components/SearchBar/SearchBar';
import Cities from './pages/Cities/Cities';
import Weather from './pages/Weather/Weather';

function App() {
  const [data, setData] = useState<WeatherType>();
  const [searchError, setSearchError] = useState<string>('');
  const [storedCities, setStoredCities] = useState<string[]>([]);

  const [searchParams] = useSearchParams();
  const URL: string = `https://api.weatherapi.com/v1/forecast.json?key=${
    import.meta.env.VITE_API_KEY
  }&q=${searchParams.get('search')}&days=3&aqi=yes&alerts=no`;

  useEffect(() => {
    const cities = localStorage.getItem('storedCities');
    if (cities) {
      setStoredCities(JSON.parse(cities));
    } else {
      const defaultCities = ['katowice', 'london', 'los angeles'];
      setStoredCities(defaultCities);
      localStorage.setItem('storedCities', JSON.stringify(defaultCities));
    }
  }, []);

  const fetchData = async (fetchUrl: string) => {
    const res = await fetch(fetchUrl);
    if (!res.ok) {
      setSearchError('Sorry, we couldnt find that city');
    } else {
      const jsonData = await res.json();
      setSearchError('');

      setData(jsonData);
    }
  };

  const getBackground = () => {
    const sunny = [1000];
    const cloudy = [1003, 1006, 1009, 1030, 1135, 1147];

    if (!data?.current.condition.code) {
      return { background: 'linear-gradient(#a6bacd, #494c6b)' };
    }

    if (sunny.includes(data?.current.condition.code)) {
      return { background: 'linear-gradient(#eca924, #ef6212)' };
    } else if (cloudy.includes(data?.current.condition.code)) {
      return { background: 'linear-gradient(#3b74bb, #2d3e90)' };
    } else {
      return { background: 'linear-gradient(#a6bacd, #494c6b)' };
    }
  };

  return (
    <div className={styles.bgContainer} style={getBackground()}>
      <div className={styles.container}>
        <SearchBar fetchData={fetchData} URL={URL} />
        <Routes key={location.pathname}>
          <Route
            path="/"
            element={
              <Cities
                storedCities={storedCities}
                setStoredCities={setStoredCities}
              />
            }
          />
          <Route
            path="weather"
            element={
              <Weather
                fetchData={fetchData}
                URL={URL}
                data={data}
                searchError={searchError}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
