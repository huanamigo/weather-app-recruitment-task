import { useEffect, useState } from 'react';
import styles from './App.module.scss';
import { Route, Routes } from 'react-router-dom';
import SearchBar from './components/SearchBar/SearchBar';
import Cities from './pages/Cities/Cities';
import Weather from './pages/Weather/Weather';
import { getBackground } from './actions/index';

function App() {
  const [storedCities, setStoredCities] = useState<string[]>([]);
  const [bgCode, setBgCode] = useState(0);

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

  return (
    <div className={styles.bgContainer} style={getBackground(bgCode)}>
      <div className={styles.container}>
        <SearchBar />
        <Routes key={location.pathname}>
          <Route
            path="/"
            element={
              <Cities
                storedCities={storedCities}
                setStoredCities={setStoredCities}
                setBgCode={setBgCode}
              />
            }
          />
          <Route path="weather" element={<Weather setBgCode={setBgCode} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
