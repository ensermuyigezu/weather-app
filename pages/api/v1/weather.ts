import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { getRequestValue } from "utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const city = getRequestValue(req, "query", "city");

    const { data: weatherInfo } = await axios.get(
      `${process.env.NEXT_PUBLIC_OPEN_WEATHER_MAP_API_URL}/weather?q=${city}&appid=${process.env.OPEN_WEATHER_MAP_API_KEY}`
    );
    res.status(200).json(weatherInfo);
  } catch (error) {
    res.status(500).json({ error: "Error fetching weather data" });
  }
}
