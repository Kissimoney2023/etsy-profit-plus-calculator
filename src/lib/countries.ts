import { CurrencyCode } from '../types';

export interface CountryPreset {
    id: string;
    name: string;
    currency: CurrencyCode;
    regulatoryFee: number; // Percent
    listingFeeUSD: number; // Always 0.20
    hasVAT: boolean; // Just a flag, tax logic might vary
}

export const COUNTRY_PRESETS: CountryPreset[] = [
    { id: 'US', name: 'United States', currency: 'USD', regulatoryFee: 0, listingFeeUSD: 0.20, hasVAT: false },
    { id: 'CA', name: 'Canada', currency: 'CAD', regulatoryFee: 0, listingFeeUSD: 0.20, hasVAT: false },
    { id: 'GB', name: 'United Kingdom', currency: 'GBP', regulatoryFee: 0.25, listingFeeUSD: 0.20, hasVAT: true },
    { id: 'AU', name: 'Australia', currency: 'AUD', regulatoryFee: 0, listingFeeUSD: 0.20, hasVAT: false }, // GST included in price rules often vary
    { id: 'FR', name: 'France', currency: 'EUR', regulatoryFee: 0.40, listingFeeUSD: 0.20, hasVAT: true },
    { id: 'DE', name: 'Germany', currency: 'EUR', regulatoryFee: 0, listingFeeUSD: 0.20, hasVAT: true }, // No reg fee, but has packaging act?
    { id: 'IT', name: 'Italy', currency: 'EUR', regulatoryFee: 0.25, listingFeeUSD: 0.20, hasVAT: true },
    { id: 'ES', name: 'Spain', currency: 'EUR', regulatoryFee: 0.40, listingFeeUSD: 0.20, hasVAT: true },
    { id: 'TR', name: 'Turkey', currency: 'TRY' as any, regulatoryFee: 1.15, listingFeeUSD: 0.20, hasVAT: true }, // TRY not in strict types but handling gracefully
    { id: 'Global', name: 'Other / Global', currency: 'USD', regulatoryFee: 0, listingFeeUSD: 0.20, hasVAT: false },
];
