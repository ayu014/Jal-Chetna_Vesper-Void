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
    // To write to the database from a function, we must create a special
    // admin client that has full access.
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7); // Look back 7 days for data

    const apiUrl = `https://indiawris.gov.in/Dataset/Ground%20Water%20Level?stateName=Punjab&districtName=Sangrur&agencyName=CGWB&startdate=${formatDate(startDate)}&enddate=${formatDate(endDate)}&download=false&page=0&size=1000`;

    const response = await fetch(apiUrl, { method: 'POST' });
    if (!response.ok) throw new Error('IndiaWRIS API fetch failed');

    const apiResponse = await response.json();
    const rawStations = apiResponse.data;
    if (!Array.isArray(rawStations)) throw new Error('Invalid data from API');

    // Find the latest reading for each unique station
    const latestStationsMap = new Map<string, any>();
    for (const station of rawStations) {
      if (!station.stationCode) continue;
      const existing = latestStationsMap.get(station.stationCode);
      if (!existing || new Date(station.dataTime) > new Date(existing.dataTime)) {
        latestStationsMap.set(station.stationCode, station);
      }
    }
    const uniqueLatestStations = Array.from(latestStationsMap.values());

    // Format the data to match our new 'live_station_data' table structure
    const dataToUpsert = uniqueLatestStations.map(station => ({
      id: station.stationCode,
      name: station.stationName,
      hgi_status: getHgiStatus(station.dataValue),
      latitude: parseFloat(station.latitude),
      longitude: parseFloat(station.longitude),
      water_level: station.dataValue,
      last_reading_time: station.dataTime,
    }));

    // This is the key step: Upsert the clean data into our database table.
    // 'upsert' will INSERT new stations and UPDATE existing ones.
    const { error: upsertError } = await supabaseAdmin
      .from('live_station_data')
      .upsert(dataToUpsert);

    if (upsertError) throw upsertError;

    // The function now returns a simple success message.
    return new Response(JSON.stringify({ message: `Successfully updated ${dataToUpsert.length} stations.` }), {
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