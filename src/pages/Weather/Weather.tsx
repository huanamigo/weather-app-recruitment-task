import { useSearchParams } from 'react-router-dom';
import styles from './Weather.module.scss';
import { useEffect, useState } from 'react';
import { fetchData } from '../../actions';
import { WeatherType } from '../../types';

interface WeatherProps {
  setBgCode: React.Dispatch<React.SetStateAction<number>>;
}

const Weather = ({ setBgCode }: WeatherProps) => {
  const [searchParams] = useSearchParams();
  const [showData, setShowData] = useState(false);
  const [searchError, setSearchError] = useState('');

  const city = searchParams.get('search') || '';

  const [data, setData] = useState<WeatherType>();

  const getCurrentTime = () => {
    const d = new Date();
    return Number(d.getHours());
  };

  useEffect(() => {
    const fetchDataAndShow = async () => {
      const dataToCheck: WeatherType | { error: { message: string } } =
        await fetchData(city, '3');

      if ('error' in dataToCheck) {
        setShowData(false);
        setSearchError(dataToCheck.error.message);
      } else {
        setData(dataToCheck);
        setBgCode(dataToCheck.current.condition.code);
        setShowData(true);
      }
    };

    fetchDataAndShow();
  }, [showData, searchError, setSearchError, city, searchParams, setBgCode]);

  return (
    <>
      {showData ? (
        <div className={styles.mainWrapper}>
          <div className={styles.header}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'short',
            })}
            ,{' '}
            {new Date().toLocaleDateString('en-US', {
              month: 'long',
            })}{' '}
            {new Date().getDate()}
          </div>

          <div className={styles.currentContainer}>
            <div className={styles.textContainer}>
              <p className={styles.cityName}>{data?.location.name}</p>

              <div className={styles.tempContainer}>
                <p className={styles.mainTemp}>{data?.current.temp_c}°</p>
                <p>
                  <span>▵</span>
                  {data?.forecast.forecastday[0].day.maxtemp_c}° <span>▿</span>
                  {data?.forecast.forecastday[0].day.mintemp_c}°
                </p>
              </div>

              <div className={styles.conditionContainer}>
                <p>{data?.current.condition.text}</p>
                <span>Feels like {data?.current.feelslike_c}°</span>
              </div>
            </div>

            <img
              src={data?.current.condition.icon}
              alt={data?.current.condition.text}
            />
          </div>

          <div className={styles.hourForecast}>
            {data?.forecast.forecastday[0].hour.map((eachHour) =>
              (Number(eachHour.time.slice(10, 13)) >= getCurrentTime() &&
                Number(eachHour.time.slice(10, 13)) < getCurrentTime() + 5) ||
              (getCurrentTime() > 19 &&
                Number(eachHour.time.slice(10, 13)) >= 19) ? (
                <div key={eachHour.time_epoch}>
                  <p>{eachHour.time.slice(10, 20)}</p>
                  <p>{eachHour.temp_c}°</p>
                </div>
              ) : null
            )}
          </div>

          <div className={styles.dayForecast}>
            {data?.forecast.forecastday.map((day) => (
              <div key={day.date_epoch} className={styles.wrapper}>
                <div>
                  {new Date(day.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                  })}
                </div>
                <div className={styles.icon}>
                  <img
                    src={day.day.condition.icon}
                    alt={day.day.condition.text}
                  />

                  <span>
                    {' '}
                    {day.day.daily_chance_of_rain > 0
                      ? day.day.daily_chance_of_rain + '%'
                      : null}
                  </span>
                </div>
                <div className={styles.minMaxTemp}>
                  ▵{day.day.maxtemp_c} <span>▿{day.day.mintemp_c}</span>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.dayStats}>
            <div>
              <span>Sunrise</span>
              <p>{data?.forecast.forecastday[0].astro.sunrise}</p>
            </div>
            <div>
              <span>Sunset</span>
              <p>{data?.forecast.forecastday[0].astro.sunset}</p>
            </div>
            <div>
              <span>Precipitation</span>
              <p>{data?.forecast.forecastday[0].day.daily_chance_of_rain}</p>
            </div>
            <div>
              <span>Humidity</span>
              <p>{data?.forecast.forecastday[0].day.avghumidity}</p>
            </div>
            <div>
              <span>Max wind</span>
              <p> {data?.forecast.forecastday[0].day.maxwind_kph}</p>
            </div>
            <div>
              <span>Pressure</span>
              <p>{data?.forecast.forecastday[0].hour[12].pressure_mb}</p>
            </div>
          </div>
        </div>
      ) : (
        <p style={{ textAlign: 'center' }}>{searchError}</p>
      )}
    </>
  );
};

export default Weather;
