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
    // THE FIX IS HERE 👇
    // We create a special admin client using the secure environment variables.
    // This is the correct and secure way to do it.
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);

    const districts = ['Sangrur', 'Ludhiana', 'Amritsar'];

    const fetchPromises = districts.map(districtName => {
      const apiUrl = `https://indiawris.gov.in/Dataset/Ground%20Water%20Level?stateName=Punjab&districtName=${districtName}&agencyName=CGWB&startdate=${formatDate(startDate)}&enddate=${formatDate(endDate)}&download=false&page=0&size=1000`;
      return fetch(apiUrl, { method: 'POST' });
    });

    const responses = await Promise.all(fetchPromises);

    let allRawStations: any[] = [];
    for (const [index, response] of responses.entries()) {
      if (!response.ok) continue;
      const apiResponse = await response.json();
      if (Array.isArray(apiResponse.data)) {
        const stationsWithDistrict = apiResponse.data.map(station => ({
          ...station,
          district: districts[index]
        }));
        allRawStations = [...allRawStations, ...stationsWithDistrict];
      }
    }
    
    const latestStationsMap = new Map<string, any>();
    for (const station of allRawStations) {
      if (!station.stationCode) continue;
      const existing = latestStationsMap.get(station.stationCode);
      if (!existing || new Date(station.dataTime) > new Date(existing.dataTime)) {
        latestStationsMap.set(station.stationCode, station);
      }
    }
    const uniqueLatestStations = Array.from(latestStationsMap.values());

    const dataToUpsert = uniqueLatestStations.map(station => ({
      id: station.stationCode,
      name: station.stationName,
      hgi_status: getHgiStatus(station.dataValue),
      latitude: parseFloat(station.latitude),
      longitude: parseFloat(station.longitude),
      water_level: station.dataValue,
      last_reading_time: station.dataTime,
      district: station.district,
    }));

    if (dataToUpsert.length === 0) {
      return new Response(JSON.stringify({ message: 'No new station data found to update.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    const { error: upsertError } = await supabaseAdmin
      .from('live_station_data')
      .upsert(dataToUpsert);

    if (upsertError) throw upsertError;

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