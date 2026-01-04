
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
        const { image, mimeType } = await req.json()
        const apiKey = Deno.env.get('GEMINI_API_KEY')

        if (!apiKey) {
            throw new Error('Missing GEMINI_API_KEY')
        }

        if (!image) {
            throw new Error('Missing image data')
        }

        const prompt = `
      Act as an expert Etsy Product Photographer and E-commerce Conversion Specialist. 
      Analyze this product image strictly for an Etsy listing.

      Evaluate it based on:
      1. Lighting (Is it bright? Are there harsh shadows?)
      2. Composition (Is the product the hero? Is it centered? Rule of thirds?)
      3. Background (Is it distracting? Is it clean?)
      4. Professionalism (Blurriness, color accuracy, appeal)

      Return a JSON object with this exact structure (no Markdown):
      {
        "score": 85, // 0-100 score
        "strengths": ["Great lighting", "Clean background"], // 2-3 bullet points
        "improvements": ["Crop closer to the product", "Fix white balance"], // 2-3 actionable tips
        "verdict": "A solid main image, but could be brighter." // Summary sentence
      }
    `

        // Use gemini-1.5-flash for vision capabilities
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        {
                            inlineData: {
                                mimeType: mimeType || 'image/jpeg',
                                data: image // Base64 string
                            }
                        }
                    ]
                }]
            })
        })

        const data = await response.json()

        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            console.error('Gemini Error:', data)
            throw new Error('Failed to generate analysis from AI')
        }

        const textResponse = data.candidates[0].content.parts[0].text
        const jsonStr = textResponse.replace(/^```json\n|\n```$/g, '').trim()

        let result
        try {
            result = JSON.parse(jsonStr)
        } catch (e) {
            console.error("Failed to parse JSON:", jsonStr)
            // Fallback if AI returns unstructured text
            result = {
                score: 0,
                strengths: ["Analysis failed to parse"],
                improvements: ["Please try again"],
                verdict: textResponse
            }
        }

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
