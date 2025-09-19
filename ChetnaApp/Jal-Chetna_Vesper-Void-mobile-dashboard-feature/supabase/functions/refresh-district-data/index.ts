import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4?target=deno";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Configuration for all three districts and their matching tables
const districtsConfig = [
  { apiName: 'Ludhiana', tableName: 'ludhiana_daily_summary' },
  { apiName: 'Sangrur', tableName: 'sangrur_daily_summary' },
  { apiName: 'Amritsar', tableName: 'amritsar_daily_summary' },
];

// Helper function to format a date into 'YYYY-MM-DD'
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper function to calculate the difference in days between two dates
function dayDifference(date1: Date, date2: Date): number {
    const timeDiff = date1.getTime() - date2.getTime();
    return Math.round(timeDiff / (1000 * 3600 * 24));
}

serve(async (req: Request) => {
  try {
    // Initialize the Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    
    // Define the 10-day date range for the API call
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 9); // -9 to get a 10 day total window

    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);
    const logs = [];

    // Loop through each district in our configuration
    for (const district of districtsConfig) {
      // 1. Fetch the entire 10-day history from the API using a POST request
      const baseUrl = 'https://indiawris.gov.in/Dataset/Ground%20Water%20Level';
      
      // Prepare the parameters to be sent in the request body
      const params = new URLSearchParams({
        stateName: 'Punjab',
        districtName: district.apiName,
        agencyName: 'CGWB',
        startdate: startDateStr,
        enddate: endDateStr,
        download: 'true',
        page: '0',
        size: '2000'
      });

      // Send the request as a POST with the parameters in the body
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params
      });
      
      if (!response.ok) throw new Error(`API fetch failed for ${district.apiName}: ${response.statusText}`);
      const rawData: any[] = await response.json();

      if (!rawData || rawData.length === 0) {
        logs.push(`No data found for ${district.apiName}.`);
        continue;
      }
      
      // 2. Process the raw data into our wide table format
      const stationSummary: { [key: string]: any } = {};
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize today's date for accurate comparison

      for (const reading of rawData) {
        if (!reading.stationCode) continue; // Skip records without a station code

        if (!stationSummary[reading.stationCode]) {
          stationSummary[reading.stationCode] = {
            stationCode: reading.stationCode,
            stationName: reading.stationName,
          };
        }

        const readingDate = new Date(
            reading.dataTime.year,
            reading.dataTime.monthValue - 1,
            reading.dataTime.dayOfMonth
        );
        readingDate.setHours(0, 0, 0, 0);

        const daysAgo = dayDifference(today, readingDate);

        if (daysAgo >= 0 && daysAgo < 10) {
          const dayColumn = `day${daysAgo + 1}_value`;
          stationSummary[reading.stationCode][dayColumn] = reading.dataValue;
        }
      }

      // 3. Prepare the final data and overwrite the Supabase table
      const finalData = Object.values(stationSummary).map(station => ({
        ...station,
        last_updated: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from(district.tableName)
        .upsert(finalData, { onConflict: 'stationCode' });

      if (error) throw new Error(`Error saving data for ${district.tableName}: ${error.message}`);
      logs.push(`Successfully refreshed ${finalData.length} stations for ${district.tableName}.`);
    }

    return new Response(
      JSON.stringify({ message: "All district summaries refreshed successfully!", logs }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});