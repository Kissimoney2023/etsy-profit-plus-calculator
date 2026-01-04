
import { POST_1_CONTENT, POST_2_CONTENT, POST_3_CONTENT, POST_4_CONTENT, POST_5_CONTENT } from './blog-content-expanded';

export interface BlogPostData {
  title: string;
  slug: string;
  description: string;
  category: string;
  date: string;
  readingTime: string;
  keywords: string[];
  image?: string;
  imageAlt?: string;
  author?: string;
  content: string;
  faqs?: { q: string; a: string }[];
}

export const BLOG_POSTS: BlogPostData[] = [
  {
    title: "Etsy Fee Calculator 2024: The Complete Guide to Seller Fees",
    slug: "etsy-fee-calculator-explained",
    description: "Don't let hidden fees eat your profits. A complete breakdown of listing, transaction, payment processing, and regulatory fees for Etsy sellers in 2024.",
    category: "Guides",
    date: "Jan 03, 2025",
    readingTime: "12 min read",
    keywords: ["etsy fees", "fee calculator", "selling on etsy", "etsy transaction fee"],
    image: "/blog-images/etsy-fees-breakdown.png",
    imageAlt: "2024 Etsy Fee Structure Breakdown - Visual guide showing listing, transaction, payment processing, and offsite ads fees",
    author: "EtsyProfit+ Team",
    content: POST_1_CONTENT,
    faqs: [
      { q: "Does Etsy charge fees on shipping?", a: "Yes, the 6.5% Transaction Fee applies to the shipping amount you charge the customer." },
      { q: "Can I opt out of Offsite Ads?", a: "Only if your shop has earned less than $10,000 USD in the past 365 days. Once you cross that threshold, you are required to participate for the lifetime of your shop, though the fee drops to 12%." }
    ]
  },
  {
    title: "Net Profit vs. Gross Profit: Analyzing Your Etsy Margins",
    slug: "etsy-profit-analysis-guide",
    description: "Revenue is vanity, profit is sanity. Learn how to calculate your true net profit and margin to ensure your handmade business is sustainable.",
    category: "Profitability",
    date: "Jan 03, 2025",
    readingTime: "14 min read",
    keywords: ["net profit", "etsy calculator", "profit margins", "Etsy business tips"],
    image: "/blog-images/profit-margin-comparison.png",
    imageAlt: "Net Profit vs Gross Profit Comparison - Understanding your real Etsy earnings",
    author: "EtsyProfit+ Team",
    content: POST_2_CONTENT,
    faqs: [
      { q: "What is a good profit margin on Etsy?", a: "Aim for at least 30-50%. This gives you a buffer for marketing, mistakes, and growth." }
    ]
  },
  {
    title: "Etsy Offsite Ads: The 15% Question",
    slug: "etsy-offsite-ads-strategy",
    description: "Should you stay enrolled in Offsite Ads? Analysis of the 12-15% fee and how to price your products to absorb the cost.",
    category: "Marketing",
    date: "Jan 03, 2025",
    readingTime: "11 min read",
    keywords: ["offsite ads", "etsy marketing", "pricing strategy", "ad fees"],
    image: "/blog-images/offsite-ads-strategy.png",
    imageAlt: "Etsy Offsite Ads Decision Flowchart - Strategic guide for sellers",
    author: "EtsyProfit+ Team",
    content: POST_3_CONTENT,
    faqs: [
      { q: "Can I turn off Offsite Ads?", a: "Only if you made less than $10,000 in the past 12 months. Above that threshold, it's mandatory." }
    ]
  },
  {
    title: "How to Calculate Your Etsy Break-Even Price",
    slug: "how-to-calculate-break-even-price-etsy",
    description: "The math behind the lowest price you can charge on Etsy without losing money.",
    category: "Strategy",
    date: "Feb 28, 2024",
    readingTime: "10 min read",
    keywords: ["break even", "pricing strategy", "etsy pricing"],
    image: "/blog-images/break-even-calculator.png",
    imageAlt: "Break-Even Analysis Chart - Find your minimum profitable price on Etsy",
    author: "EtsyProfit+ Team",
    content: POST_4_CONTENT,
    faqs: [
      { q: "What if my break-even price is too high?", a: "You have three options: reduce costs, increase perceived value through better photos/descriptions, or find a different product to sell." }
    ]
  },
  {
    title: "Etsy Payment Processing Fees: Regional Guide 2024",
    slug: "etsy-payment-processing-fees-by-country",
    description: "Why processing fees change based on where you and your customer are located.",
    category: "Guides",
    date: "Feb 25, 2024",
    readingTime: "13 min read",
    keywords: ["processing fees", "etsy payments", "international selling"],
    image: "/blog-images/pricing-strategy-guide.png",
    imageAlt: "Pricing Strategy Pyramid - Build your Etsy price from the ground up",
    author: "EtsyProfit+ Team",
    content: POST_5_CONTENT,
    faqs: [
      { q: "Do I pay different fees for international orders?", a: "No, you pay the processing fee based on YOUR shop's location, not the customer's location." }
    ]
  },
  {
    title: "How to Find Hidden Etsy Niches in Seconds with AI",
    slug: "how-to-find-hidden-etsy-niches-ai",
    description: "Stop guessing. Learn how to use Gemini AI to uncover low-competition, high-profit sub-niches that nobody else is talking about.",
    category: "Strategy",
    date: "Jan 03, 2025",
    readingTime: "8 min read",
    keywords: ["etsy niches", "ai trend hunter", "gemini ai", "etsy seo"],
    image: "/blog-images/ai-trend-hunter-guide.png",
    imageAlt: "AI Trend Hunter Tool finding hidden niches on Etsy",
    author: "AI Strategist",
    content: "POST_6_CONTENT", // Placeholder string until imported
    faqs: [
      { q: "Is using AI for market research cheating?", a: "No, it's smart business. Big retailers use data science; now you have the same power." }
    ]
  }
];

export const ALL_POSTS = BLOG_POSTS;
