export type PlanType = 'free' | 'starter' | 'pro';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY' | 'CHF' | 'SEK' | 'PLN' | 'NZD' | 'SGD' | 'HKD' | 'MXN' | 'DKK' | 'NOK' | 'ILS' | 'BRL' | 'CZK';

export interface UserProfile {
  id: string;
  email: string;
  plan: PlanType;
  stripe_customer_id?: string;
  created_at: string;
}

export interface CalculatorInputs {
  sku: string;
  currency: CurrencyCode;
  itemPrice: number;
  targetProfitType: 'amount' | 'margin';
  targetProfitValue: number;
  cogs: number;
  packagingCost: number;
  shippingCost: number;
  shippingCharged: number;
  listingFee: number;
  transactionFeePercent: number;
  processingFeePercent: number;
  processingFeeFixed: number;
  offsiteAdsEnabled: boolean;
  offsiteAdsRate: number;
  regulatoryFeePercent: number;
  returnsAllowancePercent: number;
}

export interface CalculationResult {
  revenue: number;
  totalCosts: number;
  fees: {
    listing: number;
    transaction: number;
    processing: number;
    offsiteAds: number;
    regulatory: number;
    total: number;
  };
  // Convenience properties for easier access
  transactionFee: number;
  paymentProcessingFee: number;
  offsiteAdsFee: number;
  totalFees: number;
  netProfit: number;
  margin: number;
  breakEvenPrice: number;
  recommendedPrice: number;
  offsiteAdsSafePrice: number;
}

export interface Product {
  id: string;
  user_id: string;
  title: string;
  sku: string | null;
  currency: CurrencyCode;
  inputs: CalculatorInputs;
  created_at: string;
}