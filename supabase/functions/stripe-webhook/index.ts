import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.11.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    const signature = req.headers.get('stripe-signature');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    if (!signature || !webhookSecret) {
        return new Response('Webhook signature missing', { status: 400 });
    }

    try {
        const body = await req.text();
        const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

        console.log('Webhook event:', event.type);

        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                const email = session.customer_email;
                const plan = session.metadata?.plan || 'starter';
                const customerId = session.customer as string;

                // Update user's plan in Supabase
                const { error } = await supabase
                    .from('profiles')
                    .update({
                        plan: plan,
                        stripe_customer_id: customerId
                    })
                    .eq('email', email);

                if (error) {
                    console.error('Error updating profile:', error);
                    throw error;
                }

                console.log(`Updated ${email} to ${plan} plan`);
                break;
            }

            case 'customer.subscription.updated':
            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;

                // Get customer to find email
                const customer = await stripe.customers.retrieve(customerId);
                const email = (customer as Stripe.Customer).email;

                if (!email) {
                    console.error('No email found for customer');
                    break;
                }

                // If subscription is cancelled or expired, downgrade to free
                const newPlan = subscription.status === 'active'
                    ? (subscription.metadata?.plan || 'starter')
                    : 'free';

                const { error } = await supabase
                    .from('profiles')
                    .update({ plan: newPlan })
                    .eq('email', email);

                if (error) {
                    console.error('Error updating profile:', error);
                    throw error;
                }

                console.log(`Updated ${email} to ${newPlan} plan (subscription ${subscription.status})`);
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return new Response(JSON.stringify({ received: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error) {
        console.error('Webhook error:', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            }
        );
    }
});
