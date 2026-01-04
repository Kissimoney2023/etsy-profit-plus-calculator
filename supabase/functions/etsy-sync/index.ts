
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { data: connections, error: connError } = await supabaseClient
            .from('shop_connections')
            .select('*')
            .eq('shop_status', 'active')

        if (connError) throw connError

        const clientId = Deno.env.get('ETSY_API_KEY')
        const results = []

        if (!connections || connections.length === 0) {
            return new Response(JSON.stringify({ message: "No active connections to sync" }), {
                headers: { 'Content-Type': 'application/json' }
            })
        }

        for (const conn of connections) {
            let accessToken = conn.access_token

            // Check expiry (buffer 5 mins)
            if (Date.now() / 1000 > (conn.expires_at - 300)) {
                console.log(`Refreshing token for shop ${conn.shop_id}...`)
                const refreshRes = await fetch('https://api.etsy.com/v3/public/oauth/token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        grant_type: 'refresh_token',
                        client_id: clientId!,
                        refresh_token: conn.refresh_token,
                    })
                })

                if (refreshRes.ok) {
                    const refreshData = await refreshRes.json()
                    accessToken = refreshData.access_token

                    await supabaseClient
                        .from('shop_connections')
                        .update({
                            access_token: accessToken,
                            refresh_token: refreshData.refresh_token,
                            expires_at: Math.floor(Date.now() / 1000) + refreshData.expires_in,
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', conn.id)
                } else {
                    console.error(`Failed to refresh token for user ${conn.user_id}`)
                    // Update status to auth_expired so we don't spam
                    await supabaseClient.from('shop_connections').update({ shop_status: 'auth_expired' }).eq('id', conn.id)
                    continue
                }
            }

            console.log(`Syncing active listings for shop ${conn.shop_id}...`)
            const listingsRes = await fetch(`https://api.etsy.com/v3/application/shops/${conn.shop_id}/listings/active?limit=100`, {
                headers: {
                    'x-api-key': clientId!,
                    'Authorization': `Bearer ${accessToken}`
                }
            })

            if (listingsRes.ok) {
                const listingsData = await listingsRes.json()
                results.push({
                    shopId: conn.shop_id,
                    synced: listingsData.count,
                    status: 'success'
                })

                // TODO: Here we would actually map 'listingsData.results' to the 'products' table.
                // For MVP, we just log and update the 'last_synced_at'
                await supabaseClient.from('shop_connections').update({ last_synced_at: new Date().toISOString() }).eq('id', conn.id)

            } else {
                results.push({ shopId: conn.shop_id, status: 'failed', error: listingsRes.statusText })
            }
        }

        return new Response(JSON.stringify({ success: true, results }), {
            headers: { 'Content-Type': 'application/json' }
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } })
    }
})
