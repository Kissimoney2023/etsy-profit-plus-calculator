import { supabase } from './supabase';

export async function initiateEtsyConnection() {
    const codeVerifier = generateRandomString(128);
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    const state = generateRandomString(32);

    localStorage.setItem('etsy_code_verifier', codeVerifier);
    localStorage.setItem('etsy_auth_state', state);

    const redirectUri = window.location.origin + '/dashboard';
    const scope = 'listings_r transactions_r shops_r';

    // NOTE: User must add VITE_ETSY_CLIENT_ID to .env.local
    const clientId = import.meta.env.VITE_ETSY_CLIENT_ID;

    if (!clientId) {
        alert('Etsy Client ID is missing. Please configure VITE_ETSY_CLIENT_ID in your environment variables.');
        return;
    }

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: scope,
        state: state,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
    });

    window.location.href = `https://www.etsy.com/oauth/connect?${params.toString()}`;
}

function generateRandomString(length: number) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let text = '';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);

    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

export async function exchangeEtsyCode(code: string, state: string) {
    const storedState = localStorage.getItem('etsy_auth_state');
    const codeVerifier = localStorage.getItem('etsy_code_verifier');

    if (!codeVerifier || state !== storedState) {
        throw new Error('Invalid state or security mismatch. Please try again.');
    }

    const { data, error } = await supabase.functions.invoke('etsy-auth', {
        body: {
            code,
            codeVerifier,
            redirectUri: window.location.origin + '/dashboard'
        }
    });

    localStorage.removeItem('etsy_code_verifier');
    localStorage.removeItem('etsy_auth_state');

    if (error) throw error;
    return data;
}
