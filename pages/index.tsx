import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { WeatherResponse } from "types";
import { kelvinToCelsius } from "utils";
import WeatherAttribute from "components/weather/WeatherAttribute";

type HomeProps = {
  currentCity: string;
  locationWeatherData: WeatherResponse | null;
};

const Home: React.FC<HomeProps> = ({ currentCity, locationWeatherData }) => {
  const cities = [currentCity, "London", "Amsterdam", "Moscow", "New York"];

  const [selectedCity, setSelectedCity] = useState<string>(currentCity);
  const [isStoredCityFetched, setIsStoredCityFetched] = useState(false);

  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(
    locationWeatherData
  );

  const fetchWeatherData = async (city: string) => {
    try {
      const { data: cityWeatherData } = await axios.get(
        `/api/v1/weather?city=${encodeURIComponent(city)}`
      );
      setWeatherData(cityWeatherData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setWeatherData(null);
    }
  };

  useEffect(() => {
    const storedCity = localStorage.getItem("selectedCity");
    if (storedCity) {
      setSelectedCity(storedCity);
    }
    setIsStoredCityFetched(true);
  }, []);

  useEffect(() => {
    if (isStoredCityFetched) {
      fetchWeatherData(selectedCity);
      localStorage.setItem("selectedCity", selectedCity);
    }
  }, [selectedCity, isStoredCityFetched]);

  return (
    <div className="flex flex-col w-full  bg-white gap-10 p-8 md:px-24 px-4">
      <div className="flex flex-col md:flex-row md:items-center">
        <div className="py-4 w-full items-start gap-2 flex flex-col justify-center">
          <label
            htmlFor="citySelect"
            className="text-xl md:text-2xl text-center font-medium text-black"
          >
            Select a city
          </label>
          <select
            id="citySelect"
            name="citySelect"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="py-2 border md:w-1/4 w-full rounded-md"
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() => fetchWeatherData(selectedCity)}
          className="inline-flex items-center justify-center px-3 py-2 space-x-2 text-sm font-medium text-white transition bg-primary rounded-md cursor-pointer hover:bg-blue-800"
        >
          <Image
            width="30"
            height="30"
            src="/icons/refresh.svg"
            alt="Refresh"
          />
          <span>Refresh</span>
        </button>
      </div>

      {weatherData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full  pb-10">
          <div className="flex text-white md:flex-row flex-col justify-evenly items-center gap-4 h-full shadow-md shadow-black  bg-primary py-4 rounded-2xl ">
            <div className="md:text-left text-center p-4 flex flex-col md:gap-5 gap-2 items-center">
              <div className="text-5xl md:text-7xl font-semibold">
                {kelvinToCelsius(weatherData.main?.temp)}°C
              </div>
              <div className="text-2xl md:text-4xl">
                {weatherData.weather[0].main}
              </div>
              <h1 className="text-lg md:text-xl font-bold">{selectedCity}</h1>
            </div>
            <div className="text-center">
              <Image
                src={`https://openweathermap.org/img/w/${weatherData.weather[0]?.icon}.png`}
                alt=""
                width="250"
                height="250"
                className="animate-pulse"
              />
            </div>
          </div>

          <div className="flex flex-col w-full justify-center md:gap-4 gap-2 h-full text-2xl font-medium text-white">
            <div className="flex justify-around md:gap-4 gap-2 md:h-52 h-40 w-full ">
              <WeatherAttribute
                label="Pressure"
                value={weatherData.main?.pressure}
                unit="hPa"
              />
              <WeatherAttribute
                label="Wind"
                value={weatherData.wind?.speed}
                unit="m/s"
              />
            </div>
            <div className="flex justify-around md:gap-4 gap-2 md:h-52 h-40 w-full">
              <WeatherAttribute
                label="Feels Like"
                value={kelvinToCelsius(weatherData.main?.feels_like)}
                unit="°C"
              />
              <WeatherAttribute
                label="Humidity"
                value={weatherData.main?.humidity}
                unit="%"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const getServerSideProps = async () => {
  try {
    const { data: userIPData } = await axios.get(
      `${process.env.NEXT_PUBLIC_IP_STACK_API_URL}/check?access_key=${process.env.IP_STACK_API_KEY}`
    );

    return {
      props: {
        currentCity: userIPData?.city,
      },
    };
  } catch (error) {
    console.error("Error fetching initial data:", error);

    return {
      props: {
        currentCity: "",
      },
    };
  }
};

export default Home;
