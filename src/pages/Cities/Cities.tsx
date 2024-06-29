import { useOutletContext } from 'react-router-dom';
import styles from './Cities.module.scss';
import { useEffect, useState } from 'react';
import { WeatherType } from '../../types';

interface OutletContextType {
  storedCities: string[];
  setStoredCities: React.Dispatch<React.SetStateAction<string[]>>;
}

interface CityWidgetType {
  name: string;
  country: string;
  temp: number;
  icon: string;
}

const Cities = () => {
  const { storedCities }: OutletContextType = useOutletContext();
  const [savedData, setSavedData] = useState<CityWidgetType[]>([]);

  const fetchWidgetData = async (fetchUrl: string) => {
    const res = await fetch(fetchUrl);
    if (!res.ok) {
      console.log('first');
    } else {
      const jsonData: WeatherType = await res.json();
      console.log(jsonData);
      setSavedData((prevData) => {
        const isCityAlreadySaved = prevData.some(
          (city) => city.name === jsonData.location.name
        );

        if (isCityAlreadySaved) {
          return prevData;
        }

        return [
          ...prevData,
          {
            name: jsonData.location.name,
            country: jsonData.location.country,
            temp: jsonData.current.temp_c,
            icon: jsonData.current.condition.icon,
          },
        ];
      });
    }
  };

  useEffect(() => {
    storedCities.map((city) => {
      const storedCityURL: string = `https://api.weatherapi.com/v1/forecast.json?key=${
        import.meta.env.VITE_API_KEY
      }&q=${city}&days=1&aqi=yes&alerts=no`;
      fetchWidgetData(storedCityURL);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedCities]);

  return (
    <div className={styles.container}>
      {savedData.map((city) => (
        <div key={city.name} className={styles.widget}>
          <p>
            {city.temp} <img src={city.icon} alt="Weather icon" />
          </p>
          <p>{city.name}</p>
          <p>{city.country}</p>
        </div>
      ))}
    </div>
  );
};

export default Cities;
