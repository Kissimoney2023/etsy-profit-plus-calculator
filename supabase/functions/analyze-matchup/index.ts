
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
        const { myProduct, competitorProduct } = await req.json()
        const apiKey = Deno.env.get('GEMINI_API_KEY')

        if (!apiKey) {
            throw new Error('Missing GEMINI_API_KEY')
        }

        const prompt = `
      Act as an expert Pricing Strategist for Etsy Sellers.
      Compare these two scenarios:

      MY PRODUCT:
      - Price: $${myProduct.price}
      - Shipping: $${myProduct.shipping}
      - Cost of Goods: $${myProduct.cost}
      - Net Profit: $${myProduct.profit}
      - Margin: ${myProduct.margin}%

      COMPETITOR PRODUCT:
      - Price: $${competitorProduct.price}
      - Shipping: $${competitorProduct.shipping}
      - Total Price to Customer: $${competitorProduct.price + competitorProduct.shipping}

      Analyze this specific matchup. 
      - Are we underpriced or overpriced?
      - Is the margin healthy enough to compete?
      - Should we undercut them, match them, or premium-price?
      - Give 3 specific actionable bullet points.

      Return a JSON object with this structure (no Markdown):
      {
        "verdict": "Win / Lose / Risky",
        "analysis": "Short paragraph analysis...",
        "recommendation": "Specific recommendation (e.g., Raise price to $X)",
        "bullets": ["Point 1", "Point 2", "Point 3"]
      }
    `

        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        })

        const data = await response.json()

        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('AI analysis failed')
        }

        const textResponse = data.candidates[0].content.parts[0].text
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
