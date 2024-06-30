import styles from './Cities.module.scss';
import { useEffect, useState } from 'react';
import { WeatherType } from '../../types';
import { useNavigate } from 'react-router-dom';

interface PropsType {
  storedCities: string[];
  setStoredCities: (cities: string[]) => void;
}

interface CityWidgetType {
  name: string;
  country: string;
  temp: number;
  icon: string;
}

const Cities = ({ storedCities, setStoredCities }: PropsType) => {
  const [savedData, setSavedData] = useState<CityWidgetType[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [newCity, setNewCity] = useState('');

  const navigate = useNavigate();

  const fetchWidgetData = async (city: string) => {
    const fetchUrl: string = `https://api.weatherapi.com/v1/forecast.json?key=${
      import.meta.env.VITE_API_KEY
    }&q=${city}&days=1&aqi=yes&alerts=no`;
    const res = await fetch(fetchUrl);
    if (!res.ok) {
      const updatedCities = storedCities.filter(
        (storedCity) => storedCity !== city
      );
      setStoredCities(updatedCities);
      localStorage.setItem('storedCities', JSON.stringify(updatedCities));
    } else {
      const jsonData: WeatherType = await res.json();
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
    storedCities.forEach((city) => {
      fetchWidgetData(city);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedCities]);

  const handleAddCity = () => {
    if (
      newCity.trim() &&
      !storedCities.includes(newCity.trim().toLowerCase())
    ) {
      const updatedCities = [...storedCities, newCity.trim().toLowerCase()];
      setStoredCities(updatedCities);
      localStorage.setItem('storedCities', JSON.stringify(updatedCities));
      setNewCity('');
      setShowInput(false);
    }
  };

  const handleDeleteCity = (cityName: string) => {
    const updatedCities = storedCities.filter(
      (city) => city !== cityName.toLowerCase()
    );
    setStoredCities(updatedCities);
    setSavedData(savedData.filter((city) => city.name !== cityName));
    localStorage.setItem('storedCities', JSON.stringify(updatedCities));
  };

  return (
    <div className={styles.container}>
      {savedData.map((city) => (
        <div key={city.name} className={styles.widget}>
          <div>
            <p className={styles.cityTemp}>{city.temp}°</p>
            <img src={city.icon} alt="Weather icon" />
            <div>
              <button
                className={styles.deleteButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCity(city.name);
                }}
              >
                ⨉
              </button>
            </div>
          </div>
          <div>
            <p
              onClick={() => {
                navigate(`/weather?search=${city.name}`);
              }}
              className={styles.cityName}
            >
              {city.name}
            </p>
            <p>{city.country}</p>
          </div>
        </div>
      ))}
      <div className={styles.widget}>
        {showInput ? (
          <div className={styles.addInput}>
            <input
              type="text"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              placeholder="Enter city name"
            />
            <button onClick={handleAddCity}>+</button>
          </div>
        ) : (
          <button style={{ height: '100%' }} onClick={() => setShowInput(true)}>
            +
          </button>
        )}
      </div>
    </div>
  );
};

export default Cities;
