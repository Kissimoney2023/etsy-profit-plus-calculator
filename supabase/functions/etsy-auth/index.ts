
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { code, codeVerifier, redirectUri } = await req.json()

        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
        if (userError || !user) throw new Error('Unauthorized')

        const clientId = Deno.env.get('ETSY_API_KEY')
        if (!clientId) throw new Error('Missing ETSY_API_KEY configuration')

        // Initial Token Exchange
        console.log('Exchanging code for token with Etsy...')
        const tokenResponse = await fetch('https://api.etsy.com/v3/public/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: clientId,
                redirect_uri: redirectUri,
                code: code,
                code_verifier: codeVerifier,
            }),
        })

        const tokenData = await tokenResponse.json()
        if (!tokenResponse.ok) {
            console.error('Token Error:', tokenData)
            throw new Error(tokenData.error_description || tokenData.error || 'Failed to exchange token')
        }

        const { access_token, refresh_token, expires_in, x_etsy_user_id } = tokenData

        // Fetch Shop Details
        console.log('Fetching shop details...')
        const shopResponse = await fetch(`https://api.etsy.com/v3/application/users/${x_etsy_user_id}/shops`, {
            headers: {
                'x-api-key': clientId,
                'Authorization': `Bearer ${access_token}`
            }
        })

        let shopName = 'My Etsy Shop'
        let shopId = x_etsy_user_id

        if (shopResponse.ok) {
            const shopData = await shopResponse.json()
            if (shopData.results?.[0]) {
                shopName = shopData.results[0].shop_name
                shopId = shopData.results[0].shop_id.toString()
            }
        }

        const expiresAt = Math.floor(Date.now() / 1000) + expires_in

        const { error: dbError } = await supabaseClient
            .from('shop_connections')
            .upsert({
                user_id: user.id,
                platform: 'etsy',
                access_token: access_token,
                refresh_token: refresh_token,
                expires_at: expiresAt,
                shop_id: shopId,
                shop_name: shopName,
                shop_status: 'active',
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id, platform' })

        if (dbError) throw dbError

        return new Response(JSON.stringify({ success: true, shop: { name: shopName, id: shopId } }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error) {
        console.error('Error in etsy-auth:', error)
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
