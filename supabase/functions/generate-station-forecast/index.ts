import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get the stationCode and district from the request body
    const { stationCode, districtName } = await req.json();
    if (!stationCode || !districtName)
      throw new Error("stationCode and districtName are required.");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // 1. Fetch historical data from our own database
    const tableName = `${districtName.toLowerCase()}_daily_summary`;
    const { data: historicalStationData, error: dbError } = await supabaseAdmin
      .from(tableName)
      .select("*")
      .eq("stationCode", stationCode)
      .single(); // We expect only one result

    if (dbError) throw dbError;
    if (!historicalStationData)
      throw new Error("Station not found in summary table.");

    const { latitude, longitude, day1_value } = historicalStationData;

    // 2. Fetch live rainfall forecast from OpenWeatherMap using 5-day forecast API
    const weatherApiKey = Deno.env.get("OPENWEATHER_API_KEY");
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}&units=metric`;

    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) throw new Error("Failed to fetch weather data.");
    const weatherData = await weatherResponse.json();

    // Extract daily rainfall from 5-day forecast (40 entries, 3-hour intervals)
    // Group by day and sum rainfall for each day
    const dailyRainfall: number[] = [];
    const forecastList = weatherData.list || [];

    // Group forecasts by date
    const dailyGroups: { [key: string]: any[] } = {};
    forecastList.forEach((forecast: any) => {
      const date = new Date(forecast.dt * 1000).toDateString();
      if (!dailyGroups[date]) {
        dailyGroups[date] = [];
      }
      dailyGroups[date].push(forecast);
    });

    // Calculate daily rainfall totals
    Object.keys(dailyGroups)
      .slice(0, 5)
      .forEach((date) => {
        const dayForecasts = dailyGroups[date];
        const dailyTotal = dayForecasts.reduce(
          (total: number, forecast: any) => {
            const rain = forecast.rain ? forecast.rain["3h"] || 0 : 0;
            return total + rain;
          },
          0
        );
        dailyRainfall.push(dailyTotal);
      });

    // Pad with zeros if we don't have 5 days of data
    while (dailyRainfall.length < 5) {
      dailyRainfall.push(0);
    }

    const futureRainfall = dailyRainfall;

    // 3. Apply the prediction formula
    const RECHARGE_RATE = 0.15;
    const RESPONSE_FACTOR = 1.0;
    const currentLevel = day1_value || 0;
    let lastLevel = currentLevel;

    const forecastDataValues = futureRainfall.map((rainfall) => {
      const newLevel = lastLevel + rainfall * RECHARGE_RATE * RESPONSE_FACTOR;
      lastLevel = newLevel;
      return newLevel;
    });

    // 4. Package and return all the data the app needs
    const responsePayload = {
      historicalData: [
        historicalStationData.day10_value,
        historicalStationData.day9_value,
        historicalStationData.day8_value,
        historicalStationData.day7_value,
        historicalStationData.day6_value,
        historicalStationData.day5_value,
        historicalStationData.day4_value,
        historicalStationData.day3_value,
        historicalStationData.day2_value,
        historicalStationData.day1_value,
      ].filter((v) => v !== null),
      forecastData: forecastDataValues,
    };

    return new Response(JSON.stringify(responsePayload), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
