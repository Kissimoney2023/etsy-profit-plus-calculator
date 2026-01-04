
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

                // Map and upsert listings to 'products' table
                const productsToUpsert = listingsData.results.map((listing: any) => ({
                    user_id: conn.user_id,
                    title: listing.title,
                    sku: listing.skus?.[0] || listing.title.substring(0, 20), // Fallback if no SKU
                    currency: listing.currency_code || 'USD',
                    item_price: listing.price.amount / listing.price.divisor,
                    shipping_charged: 0, // Etsy API sometimes separates this, defaulting to free/incorporated for now
                    platform_id: listing.listing_id.toString(), // Store external ID to avoid duplicates
                    inputs: {
                        // Store full calculated defaults
                        sku: listing.skus?.[0] || listing.title,
                        itemPrice: listing.price.amount / listing.price.divisor,
                        currency: listing.currency_code || 'USD',
                        shippingCharged: 0,
                        cogs: 0, // User must enter this
                        shippingCost: 0,
                        packagingCost: 0,
                        listingFee: 0.20,
                        transactionFeePercent: 6.5,
                        processingFeePercent: 3.0,
                        processingFeeFixed: 0.25,
                        offsiteAdsEnabled: false,
                        targetProfitValue: 30, // Default goal
                        targetProfitType: 'margin'
                    },
                    updated_at: new Date().toISOString()
                }));

                if (productsToUpsert.length > 0) {
                    const { error: upsertError } = await supabaseClient
                        .from('products')
                        .upsert(productsToUpsert, { onConflict: 'user_id, platform_id' }) // Ensure we have a unique constraint or similar logic

                    if (upsertError) console.error('Error upserting products:', upsertError)
                }

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
