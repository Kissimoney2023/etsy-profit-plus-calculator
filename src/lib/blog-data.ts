

export interface BlogPostData {
  title: string;
  slug: string;
  description: string;
  category: string;
  date: string;
  readingTime: string;
  keywords: string[];
  image?: string; // Featured image URL
  imageAlt?: string; // Alt text for SEO
  author?: string; // Author name
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
    imageAlt: "2024 Etsy Fee Structure Breakdown - Visual guide showing listing, transaction, payment processing, and offsite ads fees",
    author: "EtsyProfit+ Team",
    content: `
      <div class="mb-8">
        <img src="/blog-images/etsy-fees-breakdown.png" alt="2024 Etsy Fee Structure Breakdown" class="w-full rounded-2xl shadow-lg mb-4" />
        <p class="text-sm text-gray-500 text-center italic">Complete breakdown of all Etsy seller fees in 2024</p>
      </div>

      <h2>Why You Need More Than Just 'Napkin Math'</h2>
      <p>Many new Etsy sellers make a critical mistake: they calculate profit by simply subtracting the cost of their item from the sale price. "I bought this mug for $5 and sold it for $25, so I made $20!" Unfortunately, it's never that simple.</p>
      <p>Etsy's fee structure is layered, and small percentages add up to a significant portion of your revenue. In 2024/2025, understanding these layers is the difference between a hobby and a business.</p>

      <h3>1. The Listing Fee</h3>
      <p><strong>Cost: $0.20 USD per item.</strong></p>
      <p>This is the "rent" you pay for space on Etsy's shelf. You pay this when you create a listing, and it renews every 4 months or whenever the item sells. It seems small, but if you have 100 items that sit for a year, that's $60/year just to exist.</p>

      <h3>2. The Transaction Fee</h3>
      <p><strong>Cost: 6.5% of the total order amount.</strong></p>
      <p>This is the commission Etsy takes for facilitating the sale. Crucially, <strong>this applies to the shipping cost you charge the customer as well</strong>. If you sell an item for $20 and charge $5 shipping, you pay 6.5% on $25, not $20.</p>

      <h3>3. Payment Processing Fee</h3>
      <p><strong>Cost (USA): 3% + $0.25 USD.</strong></p>
      <p>This fee pays for the credit card processing. It varies significantly by country. For example, in the UK it's 4% + £0.20. This is taken from the total transaction value including tax.</p>

      <h3>4. Offsite Ads (The "Success Tax")</h3>
      <p><strong>Cost: 12% or 15% (if a sale comes from an ad).</strong></p>
      <p>If Etsy advertises your item on Google or Facebook and it sells, you pay this fee.
      <ul>
        <li>If you made under $10k in the last 365 days, it's 15% (and optional).</li>
        <li>If you made over $10k, it's 12% (and mandatory).</li>
      </ul>
      </p>

      <div class="bg-indigo-50 border-l-4 border-indigo-500 p-6 my-8 rounded-r-xl">
        <h4 class="font-bold text-indigo-900 mb-2">Real World Example</h4>
        <p class="text-sm text-indigo-800">
          You sell a handmade ring for <strong>$50.00</strong> + <strong>$5.00 shipping</strong>.<br/>
          <strong>Total Revenue: $55.00</strong>
        </p>
        <ul class="list-disc pl-5 mt-2 text-sm text-indigo-800 space-y-1">
           <li>Listing Fee: -$0.20</li>
           <li>Transaction Fee (6.5% of $55): -$3.58</li>
           <li>Payment Proc. (3% of $55 + $0.25): -$1.90</li>
           <li><strong>Total Fees: $5.68 (approx 10% of revenue)</strong></li>
        </ul>
        <p class="mt-4 font-bold text-indigo-900">Net Revenue: $49.32</p>
      </div>

      <p>Use our <a href="/calculator?tool=fees" class="text-primary font-bold hover:underline">Free Etsy Fee Calculator</a> to plug in your own numbers and see exactly what you'll keep.</p>
    `,
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
    readingTime: "10 min read",
    keywords: ["net profit", "etsy calculator", "profit margins", "Etsy business tips"],
    image: "/blog-images/profit-margin-comparison.png",
    imageAlt: "Net Profit vs Gross Profit Comparison - Understanding your real Etsy earnings",
    author: "EtsyProfit+ Team",
    content: `
      <div class="mb-8">
        <img src="/blog-images/profit-margin-comparison.png" alt="Net Profit vs Gross Profit Comparison" class="w-full rounded-2xl shadow-lg mb-4" />
        <p class="text-sm text-gray-500 text-center italic">Understanding the difference between gross and net profit</p>
      </div>

      <h2>The Profit Equation</h2>
      <p>Many sellers confuse "money in the bank" with profit. Your payouts from Etsy are not your profit—they are your <strong>Net Revenue</strong>. To find your <strong>Net Profit</strong>, you must subtract your true costs.</p>

      <h3>Step 1: Calculate COGS (Cost of Goods Sold)</h3>
      <p>This is the direct cost to produce your item. It includes:</p>
      <ul>
        <li><strong>Materials:</strong> Clay, silver, yarn, wood, packaging boxes, bubble wrap.</li>
        <li><strong>Labor:</strong> If you hired someone to make it, pay them. If YOU make it, you should account for your time, but for tax profit, this is often "owner's equity".</li>
      </ul>

      <h3>Step 2: Shipping Costs (The "Silent Killer")</h3>
      <p>Not what you charge the customer—but what <strong>you pay</strong> to buy the shipping label. If you offer "Free Shipping", this cost comes directly out of your pocket. Even if you charge shipping, if you undercharge (e.g., charge $5 but the label costs $7), that $2 loss eats your profit.</p>

      <h3>Step 3: Overhead</h3>
      <p>Tools, software subscriptions (like generic design tools), studio rent, electricity. These are harder to pin to a single unit, but should be kept in mind.</p>

      <div class="bg-green-50 p-8 rounded-2xl my-8 text-center">
         <h3 class="text-2xl font-black text-green-800 mb-4">Don't guess. Know.</h3>
         <p class="text-green-700 mb-6">Our calculator handles the math for costs, fees, and taxes instantly.</p>
         <a href="/calculator" class="inline-block bg-green-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-green-700 transition-colors">Start Profit Analysis</a>
      </div>

      <h3>What is a "Good" Margin?</h3>
      <p>A healthy profit margin for handmade goods is typically between <strong>30% and 50%</strong>. </p>
      <p>If your margin is under 20%, you are one accidental refund or lost package away from losing money. Use our <a href="/calculator?tool=compare" class="text-primary font-bold">Competitor Comparison Tool</a> to see if your pricing allows for a healthy margin compared to the market.</p>
    `,
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
    readingTime: "7 min read",
    keywords: ["offsite ads", "etsy marketing", "pricing strategy", "ad fees"],
    image: "/blog-images/offsite-ads-strategy.png",
    imageAlt: "Etsy Offsite Ads Decision Flowchart - Strategic guide for sellers",
    author: "EtsyProfit+ Team",
    content: `
      <div class="mb-8">
        <img src="/blog-images/offsite-ads-strategy.png" alt="Etsy Offsite Ads Strategy" class="w-full rounded-2xl shadow-lg mb-4" />
        <p class="text-sm text-gray-500 text-center italic">Decision framework for Etsy Offsite Ads participation</p>
      </div>

      <h2>The Love-Hate Relationship with Offsite Ads</h2>
      <p>Etsy's Offsite Ads program places your listings on Google, Facebook, Instagram, Pinterest, and Bing. You pay nothing for the impression or the click. You <strong>only pay a fee if a shopper clicks an ad and buys from your shop within 30 days</strong>.</p>

      <h3>The Fee Structure</h3>
      <ul>
        <li><strong>15%:</strong> For shops with under $10k revenue. (Optional - can opt out).</li>
        <li><strong>12%:</strong> For shops with over $10k revenue. (Mandatory).</li>
      </ul>

      <h3>The Strategy: "Pricing for the Worst Case"</h3>
      <p>Since you cannot control <em>which</em> items are advertised or <em>who</em> clicks them, you run the risk of selling a low-margin item via an ad and losing money.</p>
      <p><strong>The Fix:</strong> Incorporate a buffer into your pricing. If you assume 10% of your sales might come from ads, you can spread that cost across all your prices. Or, simpler: ensure your minimum profit margin is at least 20-25%, so even if a 15% fee hits, you still make 5-10% profit.</p>
      
      <p>Don't fly blind. Use the <a href="/calculator?tool=ads" class="text-primary font-bold hover:underline">Ads Scenario Tool</a> to simulate how a 15% fee impacts your specific product's profitability.</p>
    `
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
    imageAlt: "Break-Even Analysis Chart - Find your minimum profitable price on Etsy",
    author: "EtsyProfit+ Team",
    content: `
      <div class="mb-8">
        <img src="/blog-images/break-even-calculator.png" alt="Break-Even Analysis" class="w-full rounded-2xl shadow-lg mb-4" />
        <p class="text-sm text-gray-500 text-center italic">Understanding your break-even point for sustainable pricing</p>
      </div>
      <h2>Finding Your Floor</h2>
      <p>Your break-even price is the point where Revenue = Total Expenses. Charge a penny less, and you're paying Etsy to take your products.</p>
      <h3>The Formula</h3>
      <p>P = (Costs + Fixed Fees) / (1 - Variable Fee Rate). It's complex because fees depend on the price itself.</p>
      <p>Use our <a href='/calculator?tool=breakeven' class="text-primary font-bold hover:underline">Break-Even Calculator</a> tool to find this number instantly.</p>
    `
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
    imageAlt: "Pricing Strategy Pyramid - Build your Etsy price from the ground up",
    author: "EtsyProfit+ Team",
    content: `
      <div class="mb-8">
        <img src="/blog-images/pricing-strategy-guide.png" alt="Pricing Strategy Guide" class="w-full rounded-2xl shadow-lg mb-4" />
        <p class="text-sm text-gray-500 text-center italic">Strategic pricing framework for Etsy sellers</p>
      </div>
      <h2>Global Selling, Local Fees</h2>
      <p>Etsy Payments fees differ significantly. In the US, it's 3% + $0.25. In the UK, it's 4% + £0.20. In some EU countries, it can be even higher.</p>
      <p>Our calculator automatically adjusts these fees based on your selected country preset.</p>
    `
  }
];

export const ALL_POSTS = BLOG_POSTS;
