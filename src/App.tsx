import { ChangeEvent, useEffect } from 'react';
import { useState } from 'react';
import './App.css';
import { optionType } from './types';

function App(): JSX.Element {
  // input user
  const [term, setTerm] = useState<string>('');

  //choosen place
  const [options, setOptions] = useState<[]>([]);

  //city
  const [city, setCity] = useState<optionType | null>(null);

  //API call for lon and lat
  const getSearchOption = (value: string) => {
    fetch(
      `https:api.openweathermap.org/geo/1.0/direct?q=${value.trim()}&limit=5&appid=${
        process.env.REACT_APP_API_KEY
      }`
    )
      .then((res) => res.json())
      .then((data) => setOptions(data));
  };

  //API call for weater
  const getForecast = (city: optionType) => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${process.env.REACT_APP_API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => console.log(data));
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

  //get input for api location
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setTerm(value);
    if (value === '') return;
    getSearchOption(value);
  };

  return (
    <h1 className='flex justify-center items-center bg-gradient-to-br from-sky-400 via-rose-400 to-lime-400 h-[100vh] w-full'>
      <section
        className='w-full md:max-w-[500px] p-4 flex flex-col text-center 
      items-center justify-center md:px-10 lg:p-24 h-full lg:h-[500px] 
      bg-white bg-opacity-20 backdrop-blur-lg drop-shadow-lg rounded text-zinc-700'
      >
        <h1 className='text-4xl font-thin'>
          Weater <span className='font-black'>Forecast</span>
        </h1>
        <p className='text-small mt-2'>
          Enter below a place you want to know the weather of and select an
          opinion from the drowpdown
        </p>
        <div className='relative flex mt-10 md:mt-4'>
          <input
            onChange={onInputChange}
            type='text'
            value={term}
            className='px-2 py-1 rounded-l-md border-2 border-white'
          />
          <ul className='absolute top-9 bg-white ml-1 rounded-b-md'>
            {options.map((option: optionType, index: number) => (
              <li key={option.name + '-' + index}>
                <button
                  className='text-left text-sm w-full hover:bg-zinc-700 hover:text-white px-2 py-1 cursor-pointer'
                  onClick={() => onOptionSelect(option)}
                >
                  {option.name}
                </button>
              </li>
            ))}
          </ul>
          <button
            className='rounded-r-md border-2 border-zinc-100 hover:border-zinc-500 hover:text-zinc-500 text-zinc-100 px-2 py-1 cursor-pointer'
            onClick={onSubmit}
          >
            search
          </button>
        </div>
      </section>
    </h1>
  );
}

export default App;
