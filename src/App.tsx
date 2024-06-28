import { useState } from 'react';
import styles from './App.module.scss';
import { WeatherType } from './types';
import { Outlet, useSearchParams } from 'react-router-dom';

function App() {
  const [data, setData] = useState<WeatherType>();
  const [searchParams] = useSearchParams();

  const URL: string = `https://api.weatherapi.com/v1/forecast.json?key=${
    import.meta.env.VITE_API_KEY
  }&q=${searchParams.get('search')}&days=3&aqi=yes&alerts=no`;

  const fetchData = async (fetchUrl: string) => {
    const res = await fetch(fetchUrl);
    if (!res.ok) {
      console.log('first');
    } else {
      const jsonData = await res.json();
      console.log(jsonData);
      setData(jsonData);
    }
  };

  return (
    <div className={styles.container}>
      <Outlet context={{ fetchData, URL, data, setData }} />
    </div>
  );
}

export default App;
