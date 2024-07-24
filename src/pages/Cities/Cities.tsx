import styles from './Cities.module.scss';
import { useEffect, useState } from 'react';
import { WeatherType } from '../../types';
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../../actions';

interface PropsType {
  storedCities: string[];
  setStoredCities: (cities: string[]) => void;
  setBgCode: React.Dispatch<React.SetStateAction<number>>;
}

interface CityWidgetType {
  name: string;
  country: string;
  temp: number;
  icon: string;
}

const Cities = ({ storedCities, setStoredCities, setBgCode }: PropsType) => {
  const [savedData, setSavedData] = useState<CityWidgetType[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [addingError, setAddingError] = useState('');
  const [newCity, setNewCity] = useState('');

  const navigate = useNavigate();

  const fetchWidgetData = async (city: string) => {
    const data: WeatherType | { error: { message: string } } = await fetchData(
      city,
      '1'
    );

    if ('error' in data) {
      console.log(data.error.message);
    } else {
      setSavedData((prevData) => {
        const isCityAlreadySaved = prevData.some(
          (city) => city.name === data.location.name
        );

        if (isCityAlreadySaved) {
          return prevData;
        }

        return [
          ...prevData,
          {
            name: data.location.name,
            country: data.location.country,
            temp: data.current.temp_c,
            icon: data.current.condition.icon,
          },
        ];
      });
    }
  };

  useEffect(() => {
    setBgCode(0);
    storedCities.forEach((city) => {
      fetchWidgetData(city);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedCities]);

  const handleAddCity = async () => {
    if (newCity.length < 3) {
      setAddingError('Name is too short');
      return;
    }

    const dataToAdd = await fetchData(newCity, '1');

    if ('error' in dataToAdd) {
      setAddingError(dataToAdd.error.message);
    } else {
      if (
        !storedCities.includes(dataToAdd.location.name.trim().toLowerCase())
      ) {
        const updatedCities = [
          ...storedCities,
          dataToAdd.location.name.trim().toLowerCase(),
        ];
        setStoredCities(updatedCities);
        localStorage.setItem('storedCities', JSON.stringify(updatedCities));
        setNewCity('');
        setShowInput(false);
        setAddingError('');
      } else {
        setAddingError('Already saved');
      }
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddCity();
            }}
          >
            <div className={styles.addInput}>
              <input
                type="text"
                name="name"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                placeholder="Enter city name"
              />
              <span>{addingError}</span>
              <button type="submit">+</button>
            </div>
          </form>
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
