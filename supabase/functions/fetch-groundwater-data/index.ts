import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = { 'Access-Control-Allow-Origin': '*' }

// Helper function to get HGI status
const getHgiStatus = (waterLevel: number): string => {
  if (waterLevel <= -50) return 'Red';
  if (waterLevel <= -30) return 'Yellow';
  return 'Green';
}

const formatDate = (date: Date): string => date.toISOString().split('T')[0];

serve(async (req) => {
  try {
    // Read the service role key from the Authorization header
const serviceKey = req.headers.get('Authorization')?.replace('Bearer ', '');
if (!serviceKey) {
  return new Response(JSON.stringify({ error: 'Missing service key' }), { status: 401 });
}

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  serviceKey
);


    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);

    // NEW: Define the list of districts to fetch
    const districts = ['Sangrur', 'Ludhiana', 'Amritsar'];

    // NEW: Create an array of fetch promises, one for each district
    const fetchPromises = districts.map(districtName => {
      const apiUrl = `https://indiawris.gov.in/Dataset/Ground%20Water%20Level?stateName=Punjab&districtName=${districtName}&agencyName=CGWB&startdate=${formatDate(startDate)}&enddate=${formatDate(endDate)}&download=false&page=0&size=1000`;
      return fetch(apiUrl, { method: 'POST' });
    });

    // NEW: Execute all fetch requests concurrently and wait for them all to complete
    const responses = await Promise.all(fetchPromises);

    // NEW: Process all responses and combine the data into one array
    let allRawStations: any[] = [];
    for (const response of responses) {
      if (!response.ok) {
        console.error(`API fetch failed with status: ${response.status}`);
        continue; // Skip this district if it fails, but continue with others
      }
      const apiResponse = await response.json();
      if (Array.isArray(apiResponse.data)) {
        allRawStations = [...allRawStations, ...apiResponse.data];
      }
    }
    
    // The rest of the logic is the same, but it now operates on the combined data
    // --- Find the latest reading for each unique station ---
    const latestStationsMap = new Map<string, any>();
    for (const station of allRawStations) {
      if (!station.stationCode) continue;
      const existing = latestStationsMap.get(station.stationCode);
      if (!existing || new Date(station.dataTime) > new Date(existing.dataTime)) {
        latestStationsMap.set(station.stationCode, station);
      }
    }
    const uniqueLatestStations = Array.from(latestStationsMap.values());

    // Format the data to match our 'live_station_data' table structure
    const dataToUpsert = uniqueLatestStations.map(station => ({
      id: station.stationCode,
      name: station.stationName,
      hgi_status: getHgiStatus(station.dataValue),
      latitude: parseFloat(station.latitude),
      longitude: parseFloat(station.longitude),
      water_level: station.dataValue,
      last_reading_time: station.dataTime,
    }));

    if (dataToUpsert.length === 0) {
      return new Response(JSON.stringify({ message: 'No new station data found to update.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Upsert the combined, clean data into our database table.
    const { error: upsertError } = await supabaseAdmin
      .from('live_station_data')
      .upsert(dataToUpsert);

    if (upsertError) throw upsertError;

    return new Response(JSON.stringify({ message: `Successfully updated ${dataToUpsert.length} stations across ${districts.length} districts.` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});