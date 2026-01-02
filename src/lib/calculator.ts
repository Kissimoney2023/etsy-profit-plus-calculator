
import { CalculatorInputs, CalculationResult, CurrencyCode } from '../types';
import { convertCurrency } from './currency';

/**
 * Calculates Etsy fees and profit metrics based on inputs.
 * Uses USD as an internal base for logic to ensure fixed fees (like the $0.20 listing fee)
 * are handled correctly regardless of the selected display currency.
 */
export const calculateEtsyProfit = (inputs: CalculatorInputs): CalculationResult => {
  const targetCurrency = inputs.currency;

  // 1. Convert all money-denominated inputs to USD for internal processing
  const moneyInputs = [
    'itemPrice', 'cogs', 'packagingCost', 'shippingCost', 
    'shippingCharged', 'listingFee', 'processingFeeFixed'
  ] as const;

  const usdInputs = { ...inputs };
  moneyInputs.forEach(key => {
    usdInputs[key] = convertCurrency(inputs[key], targetCurrency, 'USD');
  });

  // Convert target profit if it's an amount
  const usdTargetProfitValue = inputs.targetProfitType === 'amount' 
    ? convertCurrency(inputs.targetProfitValue, targetCurrency, 'USD') 
    : inputs.targetProfitValue;

  const {
    itemPrice,
    cogs,
    packagingCost,
    shippingCost,
    shippingCharged,
    listingFee,
    transactionFeePercent,
    processingFeePercent,
    processingFeeFixed,
    offsiteAdsEnabled,
    offsiteAdsRate,
    regulatoryFeePercent,
    returnsAllowancePercent,
    targetProfitType,
  } = usdInputs;

  const revenue = itemPrice + shippingCharged;
  
  // Basic Costs
  const directCosts = cogs + packagingCost + shippingCost;
  const returnsAllowance = (revenue * (returnsAllowancePercent / 100));

  // Fees
  const transactionFee = revenue * (transactionFeePercent / 100);
  const processingFee = (revenue * (processingFeePercent / 100)) + processingFeeFixed;
  const regulatoryFee = revenue * (regulatoryFeePercent / 100);
  
  let offsiteAdsFee = 0;
  if (offsiteAdsEnabled) {
    offsiteAdsFee = Math.min(revenue * (offsiteAdsRate / 100), 100);
  }

  const totalFees = listingFee + transactionFee + processingFee + regulatoryFee + offsiteAdsFee;
  const totalOutgoings = directCosts + totalFees + returnsAllowance;
  const netProfit = revenue - totalOutgoings;
  const margin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

  // Pricing Helpers
  const calculatePriceForTarget = (targetProfit: number, isMargin: boolean, includeAds: boolean = false): number => {
    const sc = shippingCharged;
    const lf = listingFee;
    const tf = transactionFeePercent / 100;
    const pf = processingFeePercent / 100;
    const pff = processingFeeFixed;
    const rf = regulatoryFeePercent / 100;
    const ra = returnsAllowancePercent / 100;
    const af = includeAds ? offsiteAdsRate / 100 : 0;
    const costs = directCosts;
    
    const feeRateSum = tf + pf + rf + ra + af;
    
    if (isMargin) {
      const marginRate = targetProfit / 100;
      const denominator = 1 - (feeRateSum + marginRate);
      if (denominator <= 0) return 0; 
      const numerator = costs + lf + pff + sc * (feeRateSum + marginRate) - sc;
      return Math.max(0, numerator / denominator);
    } else {
      const denominator = 1 - feeRateSum;
      if (denominator <= 0) return 0;
      const numerator = targetProfit + costs + lf + pff + sc * feeRateSum - sc;
      return Math.max(0, numerator / denominator);
    }
  };

  const usdBreakEvenPrice = calculatePriceForTarget(0, false, false);
  const usdRecommendedPrice = calculatePriceForTarget(usdTargetProfitValue, targetProfitType === 'margin');
  const usdOffsiteAdsSafePrice = calculatePriceForTarget(usdTargetProfitValue, targetProfitType === 'margin', true);

  // 2. Convert all results back from USD to the target currency
  return {
    revenue: convertCurrency(revenue, 'USD', targetCurrency),
    totalCosts: convertCurrency(directCosts + returnsAllowance, 'USD', targetCurrency),
    fees: {
      listing: convertCurrency(listingFee, 'USD', targetCurrency),
      transaction: convertCurrency(transactionFee, 'USD', targetCurrency),
      processing: convertCurrency(processingFee, 'USD', targetCurrency),
      offsiteAds: convertCurrency(offsiteAdsFee, 'USD', targetCurrency),
      regulatory: convertCurrency(regulatoryFee, 'USD', targetCurrency),
      total: convertCurrency(totalFees, 'USD', targetCurrency)
    },
    netProfit: convertCurrency(netProfit, 'USD', targetCurrency),
    margin,
    breakEvenPrice: convertCurrency(usdBreakEvenPrice, 'USD', targetCurrency),
    recommendedPrice: convertCurrency(usdRecommendedPrice, 'USD', targetCurrency),
    offsiteAdsSafePrice: convertCurrency(usdOffsiteAdsSafePrice, 'USD', targetCurrency)
  };
};
