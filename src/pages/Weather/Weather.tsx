import { useOutletContext, useSearchParams } from 'react-router-dom';
import { WeatherType } from '../../types';
import styles from './Weather.module.scss';
import { useEffect, useState } from 'react';

interface OutletContextType {
  fetchData: (fetchUrl: string) => Promise<void>;
  URL: string;
  data: WeatherType | undefined;
}

const Weather = () => {
  const { fetchData, URL, data }: OutletContextType = useOutletContext();
  const [searchParams] = useSearchParams();
  const [showData, setShowData] = useState(false);

  const getCurrentTime = () => {
    const d = new Date();
    return Number(d.getHours());
  };

  useEffect(() => {
    console.log(searchParams.get('search'));
    if (!searchParams.get('search')) {
      setShowData(false);
    } else {
      fetchData(URL);
      setShowData(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showData]);

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
            {new Date().getDay()}
          </div>

          <div className={styles.currentContainer}>
            <p>Name {data?.location.name}</p>
            <p>Temp now{data?.current.temp_c}</p>
            <p>Temp max {data?.forecast.forecastday[0].day.maxtemp_c}</p>
            <p>Temp min {data?.forecast.forecastday[0].day.mintemp_c}</p>
            <p>Condition {data?.current.condition.text}</p>
            <p>
              Condition img{' '}
              <img
                src={data?.current.condition.icon}
                alt={data?.current.condition.text}
              />
            </p>
            <p>Feels like {data?.current.feelslike_c}</p>
          </div>

          <div className={styles.hourForecast}>
            {data?.forecast.forecastday[0].hour.map((eachHour) =>
              Number(eachHour.time.slice(10, 13)) >= getCurrentTime() &&
              Number(eachHour.time.slice(10, 13)) < getCurrentTime() + 5 ? (
                <p key={eachHour.time_epoch}>
                  {eachHour.time.slice(10, 13)} {eachHour.temp_c}
                </p>
              ) : null
            )}
          </div>

          <div className={styles.dayForecast}>
            {data?.forecast.forecastday.map((day) => (
              <p key={day.date_epoch}>
                {new Date(day.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                })}
                <img
                  src={day.day.condition.icon}
                  alt={day.day.condition.text}
                />
                {day.day.maxtemp_c} {day.day.mintemp_c}{' '}
                {day.day.daily_chance_of_rain > 0
                  ? day.day.daily_chance_of_rain
                  : null}
              </p>
            ))}
          </div>

          <div className={styles.dayStats}>
            <p>Sunrise {data?.forecast.forecastday[0].astro.sunrise}</p>
            <p>Sunset {data?.forecast.forecastday[0].astro.sunset}</p>
            <p>
              Precipitation{' '}
              {data?.forecast.forecastday[0].day.daily_chance_of_rain}
            </p>
            <p>Humidity {data?.forecast.forecastday[0].day.avghumidity}</p>
            <p>Max wind {data?.forecast.forecastday[0].day.maxwind_kph}</p>
            <p>Pressure {data?.forecast.forecastday[0].hour[12].pressure_mb}</p>
          </div>
        </div>
      ) : (
        <p>no data</p>
      )}
    </>
  );
};

export default Weather;
