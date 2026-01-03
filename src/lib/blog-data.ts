
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
    readingTime: "8 min read",
    keywords: ["etsy fees", "fee calculator", "selling on etsy", "etsy transaction fee"],
    image: "/blog-images/etsy-fees-breakdown.png",
    imageAlt: "2024 Etsy Fee Structure Breakdown",
    author: "EtsyProfit+ Team",
    content: "<h2>Etsy Fee Calculator 2024</h2><p>Understanding Etsy fees is crucial for your business success.</p>"
  },
  {
    title: "Net Profit vs. Gross Profit: Analyzing Your Etsy Margins",
    slug: "etsy-profit-analysis-guide",
    description: "Revenue is vanity, profit is sanity. Learn how to calculate your true net profit and margin.",
    category: "Profitability",
    date: "Jan 03, 2025",
    readingTime: "10 min read",
    keywords: ["net profit", "etsy calculator", "profit margins"],
    image: "/blog-images/profit-margin-comparison.png",
    imageAlt: "Net Profit vs Gross Profit Comparison",
    author: "EtsyProfit+ Team",
    content: "<h2>Understanding Profit Margins</h2><p>Learn the difference between net and gross profit.</p>"
  },
  {
    title: "Etsy Offsite Ads: The 15% Question",
    slug: "etsy-offsite-ads-strategy",
    description: "Should you stay enrolled in Offsite Ads? Analysis of the 12-15% fee.",
    category: "Marketing",
    date: "Jan 03, 2025",
    readingTime: "7 min read",
    keywords: ["offsite ads", "etsy marketing", "pricing strategy"],
    image: "/blog-images/offsite-ads-strategy.png",
    imageAlt: "Etsy Offsite Ads Strategy",
    author: "EtsyProfit+ Team",
    content: "<h2>Offsite Ads Strategy</h2><p>Understand when to use Etsy Offsite Ads.</p>"
  },
  {
    title: "How to Calculate Your Etsy Break-Even Price",
    slug: "how-to-calculate-break-even-price-etsy",
    description: "The math behind the lowest price you can charge on Etsy without losing money.",
    category: "Strategy",
    date: "Feb 28, 2024",
    readingTime: "7 min read",
    keywords: ["break even", "pricing strategy", "etsy pricing"],
    image: "/blog-images/break-even-calculator.png",
    imageAlt: "Break-Even Analysis Chart",
    author: "EtsyProfit+ Team",
    content: "<h2>Break-Even Pricing</h2><p>Calculate your minimum profitable price.</p>"
  },
  {
    title: "Etsy Payment Processing Fees: Regional Guide 2024",
    slug: "etsy-payment-processing-fees-by-country",
    description: "Why processing fees change based on where you and your customer are located.",
    category: "Guides",
    date: "Feb 25, 2024",
    readingTime: "9 min read",
    keywords: ["processing fees", "etsy payments", "international selling"],
    image: "/blog-images/pricing-strategy-guide.png",
    imageAlt: "Pricing Strategy Guide",
    author: "EtsyProfit+ Team",
    content: "<h2>Payment Processing Fees</h2><p>Understand regional fee differences.</p>"
  }
];

export const ALL_POSTS = BLOG_POSTS;
