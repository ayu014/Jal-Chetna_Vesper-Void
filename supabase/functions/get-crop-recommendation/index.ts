import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// CHANGED: The prompt now accepts a language code (locale)
const createPrompt = (latitude: number, longitude: number, locale: string) => {
  // Map the 2-letter code to the full language name for a clearer prompt
  const languageMap = {
    en: 'English',
    hi: 'Hindi',
    pa: 'Punjabi',
    ta: 'Tamil',
    te: 'Telugu',
  };
  const languageName = languageMap[locale] || 'English';

  return `
    You are an agricultural expert for India, specifically for the region around Haryana and Punjab. A farmer at latitude ${latitude}, longitude ${longitude} needs a crop recommendation.
    Key information:
    - The current month is September.
    Based on this location and season, recommend 3 suitable crops for the upcoming Rabi season. 
    For each crop, provide a short, simple reason.
    Also, recommend one popular crop to AVOID in this region and explain why.
    IMPORTANT: Provide the entire JSON response translated into the ${languageName} language.
    Provide the response ONLY in this exact JSON format, with no extra text or markdown formatting:
    {
      "recommended": [
        { "name": "Crop Name", "reason": "Reason" },
        { "name": "Crop Name", "reason": "Reason" },
        { "name": "Crop Name", "reason": "Reason" }
      ],
      "avoid": { "name": "Crop Name", "reason": "Reason" }
    }
  `;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // CHANGED: It now also expects a 'locale' property from the app
    const { latitude, longitude, locale } = await req.json();
    if (!latitude || !longitude || !locale) {
      throw new Error("Latitude, longitude, and locale are required.");
    }
    
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY secret.");
    
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    // CHANGED: We pass the locale to the prompt creator
    const prompt = createPrompt(latitude, longitude, locale);

    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    if (!geminiResponse.ok) {
      const errorBody = await geminiResponse.text();
      throw new Error(`Gemini API failed with status ${geminiResponse.status}: ${errorBody}`);
    }

    const geminiData = await geminiResponse.json();
    let responseText = geminiData.candidates[0].content.parts[0].text;
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonResponse = JSON.parse(responseText);

    return new Response(JSON.stringify(jsonResponse), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Function Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});