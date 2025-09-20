import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the stationCode and district from the request body
    const { stationCode, districtName } = await req.json();
    if (!stationCode || !districtName) throw new Error('stationCode and districtName are required.');

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 1. Fetch historical data from our own database
    const tableName = `${districtName.toLowerCase()}_daily_summary`;
    const { data: historicalStationData, error: dbError } = await supabaseAdmin
      .from(tableName)
      .select('*')
      .eq('stationCode', stationCode)
      .single(); // We expect only one result

    if (dbError) throw dbError;
    if (!historicalStationData) throw new Error('Station not found in summary table.');
    
    const { latitude, longitude, day1_value } = historicalStationData;

    // 2. Fetch live rainfall forecast from OpenWeatherMap
    const weatherApiKey = Deno.env.get('OPENWEATHER_API_KEY');
    const weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly,alerts&appid=${weatherApiKey}&units=metric`;
    
    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) throw new Error('Failed to fetch weather data.');
    const weatherData = await weatherResponse.json();
    
    // Extract the daily rainfall for the next 8 days (free tier limit)
    const futureRainfall = weatherData.daily.slice(0, 10).map((day: any) => day.rain || 0);

    // 3. Apply the prediction formula
    const RECHARGE_RATE = 0.15;
    const RESPONSE_FACTOR = 1.0;
    const currentLevel = day1_value || 0;
    let lastLevel = currentLevel;

    const forecastDataValues = futureRainfall.map(rainfall => {
      const newLevel = lastLevel + (rainfall * RECHARGE_RATE * RESPONSE_FACTOR);
      lastLevel = newLevel;
      return newLevel;
    });

    // 4. Package and return all the data the app needs
    const responsePayload = {
      historicalData: [
        historicalStationData.day10_value, historicalStationData.day9_value, historicalStationData.day8_value,
        historicalStationData.day7_value, historicalStationData.day6_value, historicalStationData.day5_value,
        historicalStationData.day4_value, historicalStationData.day3_value, historicalStationData.day2_value, historicalStationData.day1_value,
      ].filter(v => v !== null),
      forecastData: forecastDataValues,
    };

    return new Response(JSON.stringify(responsePayload), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});