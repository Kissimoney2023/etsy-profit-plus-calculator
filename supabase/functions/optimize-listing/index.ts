
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
        const { title, description, tags, targetKeyword } = await req.json()
        const apiKey = Deno.env.get('GEMINI_API_KEY')

        if (!apiKey) {
            throw new Error('Missing GEMINI_API_KEY')
        }

        const prompt = `
      Act as an expert Etsy SEO Consultant. Analyze the following product details and provide optimized recommendations.
      
      Product Title: "${title}"
      Description: "${description}"
      Current Tags: ${tags?.join(', ') || 'None'}
      Target Keyword: "${targetKeyword || 'General'}"

      Return a JSON object with the following structure (do NOT use Markdown formatting, just raw JSON):
      {
        "optimizedTitle": "A better, keyword-rich title (max 140 chars)",
        "suggestedTags": ["tag1", "tag2", ... 13 tags total],
        "critique": "A brief analysis of what was improved and why.",
        "seoScore": 85 (0-100 score based on title length, keyword usage)
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
            throw new Error('Failed to generate content from AI')
        }

        const textResponse = data.candidates[0].content.parts[0].text
        // Clean up potential markdown code blocks
        const jsonStr = textResponse.replace(/^```json\n|\n```$/g, '').trim()
        const result = JSON.parse(jsonStr)

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
