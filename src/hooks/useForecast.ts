import { ChangeEvent, useEffect, useState } from 'react';
import { forecastType, optionType } from './../types';

const useForecast = () => {
  // input user
  const [term, setTerm] = useState<string>('');
  //choosen place
  const [options, setOptions] = useState<[]>([]);
  //city
  const [city, setCity] = useState<optionType | null>(null);
  //weather
  const [forecast, setForcast] = useState<forecastType | null>(null);

  //API call for lon and lat
  const getSearchOption = (value: string) => {
    fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${value.trim()}&limit=5&appid=${
        process.env.REACT_APP_API_KEY
      }`
    )
      .then((res) => res.json())
      .then((data) => setOptions(data));
  };

  //get input for api location
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim(); //city name from input
    setTerm(value);
    if (value === '') return;
    getSearchOption(value);
  };

  //API call for weater
  const getForecast = (city: optionType) => {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${process.env.REACT_APP_API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        const forecastData = {
          ...data.city,
          list: data.list.slice(0, 16),
        };

        setForcast(forecastData);
      });
  };

  const onSubmit = () => {
    if (!city) return;

    getForecast(city);
  };

  const onOptionSelect = (option: optionType) => {
    setCity(option);
  };

  useEffect(() => {
    if (city) {
      setTerm(city.name);
      setOptions([]);
    }
  }, [city]);

  return { term, options, forecast, onInputChange, onSubmit, onOptionSelect };
};

export default useForecast;
