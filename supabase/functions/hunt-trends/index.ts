
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { keyword } = await req.json()
        const apiKey = Deno.env.get('GEMINI_API_KEY')

        if (!apiKey) {
            throw new Error('Missing GEMINI_API_KEY')
        }

        const prompt = `
      Act as an expert Etsy Market Researcher and Trend Hunter.
      Analyze the broad category or keyword: "${keyword}".
      
      Identify 4 specific, under-served, or trending sub-niches within this category that have high profit potential.
      
      For each niche, provide:
      1. A catchy Niche Name
      2. A Trend Score (0-100) based on current velocity
      3. Competition Level (Low, Medium, High) - Focus on Low/Medium
      4. Profitability Reason (Why is this good? e.g. "Low material cost, high perceived value")
      5. A specific Hero Product idea to sell in this niche
      
      Also provide a 1-sentence Market Summary for the broad keyword.

      Return a JSON object with the following structure (do NOT use Markdown formatting, just raw JSON):
      {
        "keyword": "${keyword}",
        "marketSummary": "Global analysis of the ${keyword} market...",
        "niches": [
          {
            "name": "Niche Name",
            "trendScore": 85,
            "competition": "Low",
            "profitabilityReason": "Explanation...",
            "heroProduct": "Product Idea"
          },
          ... (4 items total)
        ]
      }
    `

        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        })

        const data = await response.json()

        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            console.error('Gemini API Error:', data);
            throw new Error('Failed to generate trends from AI')
        }

        const textResponse = data.candidates[0].content.parts[0].text
        // Clean up potential markdown code blocks
        const jsonStr = textResponse.replace(/^```json\n|\n```$/g, '').trim()

        try {
            const result = JSON.parse(jsonStr)
            return new Response(JSON.stringify(result), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        } catch (e) {
            console.error('JSON Parse Error:', jsonStr);
            throw new Error('AI returned invalid JSON');
        }

    } catch (error: any) {
        console.error('Hunt Trends Error:', {
            message: error.message,
            stack: error.stack,
            apiKeyExists: !!Deno.env.get('GEMINI_API_KEY')
        });
        return new Response(JSON.stringify({
            error: error.message,
            details: error.stack?.split('\n')[0] || 'No additional details'
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
