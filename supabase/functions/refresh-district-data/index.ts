import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4?target=deno";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const districtsConfig = [
  { apiName: "Ludhiana", tableName: "ludhiana_daily_summary" },
  { apiName: "Sangrur", tableName: "sangrur_daily_summary" },
  { apiName: "Amritsar", tableName: "amritsar_daily_summary" },
];

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dayDifference(date1: Date, date2: Date): number {
  const timeDiff = date1.getTime() - date2.getTime();
  return Math.round(timeDiff / (1000 * 3600 * 24));
}

serve(async (req: Request) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 9);

    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);
    const logs = [];

    for (const district of districtsConfig) {
      const baseUrl = "https://indiawris.gov.in/Dataset/Ground%20Water%20Level";
      const params = new URLSearchParams({
        stateName: "Punjab",
        districtName: district.apiName,
        agencyName: "CGWB",
        startdate: startDateStr,
        enddate: endDateStr,
        download: "true",
        page: "0",
        size: "2000",
      });

      const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
      });
      if (!response.ok)
        throw new Error(
          `API fetch failed for ${district.apiName}: ${response.statusText}`
        );
      const rawData: any[] = await response.json();

      if (!rawData || rawData.length === 0) {
        logs.push(`No data found for ${district.apiName}.`);
        continue;
      }
      const stationSummary: { [key: string]: any } = {};
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (const reading of rawData) {
        if (!reading.stationCode) continue;

        if (!stationSummary[reading.stationCode]) {
          stationSummary[reading.stationCode] = {
            stationCode: reading.stationCode,
            stationName: reading.stationName,
            latitude: reading.latitude,
            longitude: reading.longitude,
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

      const finalData = Object.values(stationSummary).map((station) => ({
        ...station,
        last_updated: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from(district.tableName)
        .upsert(finalData, { onConflict: "stationCode" });

      if (error)
        throw new Error(
          `Error saving data for ${district.tableName}: ${error.message}`
        );
      logs.push(
        `Successfully refreshed ${finalData.length} stations for ${district.tableName}.`
      );
    }

    return new Response(
      JSON.stringify({
        message: "All district summaries refreshed successfully!",
        logs,
      }),
      { headers: { "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
