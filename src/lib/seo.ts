
export const SITE = {
  name: 'EtsyProfit+',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://etsyprofit-calculator.vercel.app',
  twitterHandle: '@etsyprofit',
  defaultOgImage: '/og-default.png',
};

export interface RouteMeta {
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  noindex?: boolean;
}

export const ROUTES: RouteMeta[] = [
  {
    path: '/',
    title: 'Etsy Profit & Price Calculator | Master Your Etsy Margins',
    description: 'Calculate 2024 Etsy fees, profit margins, and find your "Offsite Ads Safe Price" with our professional profit calculator toolkit.',
    keywords: ['etsy fee calculator', 'etsy profit calculator', 'etsy pricing tool'],
  },
  {
    path: '/pricing',
    title: 'Pricing Plans | EtsyProfit+ Calculator',
    description: 'Choose the best plan for your Etsy business. Free, Starter, and Pro plans available for sellers of all sizes.',
  },
  {
    path: '/etsy-fee-calculator',
    title: 'Etsy Fee Calculator 2024 | Exact Fee Breakdown',
    description: 'Accurately calculate all 2024 Etsy fees: Transaction (6.5%), Listing ($0.20), and Processing costs.',
  },
  {
    path: '/etsy-profit-calculator',
    title: 'Etsy Profit Calculator | Find Your Real Net Profit',
    description: 'Stop guessing. Calculate your real take-home profit after materials, shipping, and Etsy fees.',
  },
  {
    path: '/etsy-offsite-ads-fee-calculator',
    title: 'Etsy Offsite Ads Calculator | Safe Price Strategy',
    description: 'Protect your margins from Etsy Offsite Ads (12-15%). Find the price you need to set to stay profitable.',
  },
  {
    path: '/etsy-break-even-price-calculator',
    title: 'Etsy Break-Even Price Calculator | Find Your Floor',
    description: 'Reverse-calculate the minimum price you must charge on Etsy to cover all your costs.',
  },
  {
    path: '/pricing-strategy',
    title: 'Etsy Pricing Strategy Guide | Scale Your Shop',
    description: 'Learn the math behind profitable Etsy pricing. Tips on margins, shipping strategies, and ad protection.',
  },
  {
    path: '/legal/privacy',
    title: 'Privacy Policy | EtsyProfit+',
    description: 'How we handle your data and privacy.',
    noindex: true,
  },
  {
    path: '/legal/terms',
    title: 'Terms of Service | EtsyProfit+',
    description: 'Terms and conditions for using our calculator tools.',
    noindex: true,
  },
];
