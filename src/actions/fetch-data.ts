import { WeatherType } from '../types';

export const fetchData = async (city: string, days: string) => {
  const URL: string = `https://api.weatherapi.com/v1/forecast.json?key=${
    import.meta.env.VITE_API_KEY
  }&q=${city}&days=${days}&aqi=yes&alerts=no`;

  const res = await fetch(URL);
  if (res.status === 400) {
    return {
      error: {
        message: `Sorry, we couldn't that city. Please try again`,
      },
    };
  } else if (!res.ok) {
    return {
      error: {
        message: `Something went wrong. Please try again later`,
      },
    };
  } else {
    return (await res.json()) as WeatherType;
  }
};
