export const courses = [
    {
      id: 1,
      title: 'Stock Market Fundamentals',
      subtitle: 'Complete guide to understanding stock markets',
      lessons: 12,
      duration: '3h',
      difficulty: 'Beginner',
      category: 'basics',
      color: '#10B981',
      modules: [
        {
          title: 'What is Stock Market?',
          duration: '15 min',
          content: `# What is Stock Market?

The stock market is a marketplace where shares of publicly listed companies are bought and sold. Think of it as a giant marketplace, but instead of fruits and vegetables, people trade ownership stakes in companies.

## How Does It Work?

When you buy a stock, you're buying a small piece of ownership in that company. If the company does well, your stock value increases. If it struggles, the value decreases.

### Key Players:
1. **Companies** - Issue shares to raise money
2. **Investors** - Buy shares to own part of the company
3. **Stock Exchanges** - Platforms where trading happens (NSE, BSE)
4. **SEBI** - Regulates and ensures fair trading

## Why Do Companies List on Stock Market?

- **Raise Capital**: To expand business operations
- **Increase Visibility**: Public companies get more attention
- **Liquidity**: Founders and early investors can sell shares
- **Employee Benefits**: Can offer stock options to employees

## Types of Markets:

**Primary Market**: Where companies first issue shares (IPO)
**Secondary Market**: Where investors trade shares among themselves

## Real Example:
If Reliance Industries needs ₹10,000 crores for a new project, they can sell shares to the public. You buy 100 shares at ₹2,500 each = ₹2,50,000 investment. Now you own a tiny part of Reliance!

## Remember:
- Stock prices change every second based on demand and supply
- More buyers = Price goes up
- More sellers = Price goes down`
        },
        {
          title: 'NSE and BSE - Indian Stock Exchanges',
          duration: '12 min',
          content: `# NSE and BSE - Indian Stock Exchanges

India has two main stock exchanges where all trading happens.

## BSE (Bombay Stock Exchange)
- **Founded**: 1875 (Asia's oldest stock exchange)
- **Index**: SENSEX (tracks top 30 companies)
- **Companies Listed**: 5,000+
- **Location**: Mumbai

## NSE (National Stock Exchange)
- **Founded**: 1992
- **Index**: NIFTY 50 (tracks top 50 companies)
- **Companies Listed**: 2,000+
- **Trading Volume**: Higher than BSE

## What are Indices?

Think of indices as a report card for the stock market.

**SENSEX**: Shows performance of top 30 companies
**NIFTY 50**: Shows performance of top 50 companies

If NIFTY is at 19,500:
- Yesterday it was 19,400 → Market went up ✅
- Yesterday it was 19,600 → Market went down ❌

## Trading Hours:
- **Pre-opening**: 9:00 AM - 9:15 AM
- **Normal Trading**: 9:15 AM - 3:30 PM
- **Post-closing**: 3:40 PM - 4:00 PM

## How Orders are Matched:
1. You place a BUY order for TCS at ₹3,500
2. Someone places a SELL order for TCS at ₹3,500
3. Exchange matches both orders
4. Trade executed! You now own TCS shares

## Market Holidays:
Stock markets are closed on weekends and public holidays (Diwali, Holi, Republic Day, etc.)`
        },
        {
          title: 'Understanding Share Prices',
          duration: '18 min',
          content: `# Understanding Share Prices

Every stock has a price, but what determines this price?

## Price Discovery:
Share prices are determined by **demand and supply**:

**High Demand + Low Supply = Price Increases** 📈
**Low Demand + High Supply = Price Decreases** 📉

## Reading Stock Quotes:

When you see a stock quote, here's what each term means:

**RELIANCE: ₹2,456.75**
- Current Trading Price

**Open**: ₹2,440.00 (Price when market opened)
**High**: ₹2,470.00 (Highest price today)
**Low**: ₹2,435.00 (Lowest price today)
**Close**: ₹2,450.00 (Yesterday's closing price)

**Change**: +6.75 (+0.28%) → Stock went up today!

**Volume**: 45,67,890 shares (How many shares traded)

## Market Cap (Market Capitalization):
Shows the total value of a company.

**Formula**: Share Price × Total Shares
Example: If Infosys has 100 crore shares at ₹1,500 each
Market Cap = 100 crore × ₹1,500 = ₹1,50,000 crores

### Categories:
- **Large Cap**: Above ₹20,000 crore (TCS, Reliance)
- **Mid Cap**: ₹5,000 - ₹20,000 crore
- **Small Cap**: Below ₹5,000 crore

## P/E Ratio (Price to Earnings):
Shows if a stock is expensive or cheap.

**Formula**: Share Price ÷ EPS (Earnings Per Share)

Example: Stock price ₹1,000, EPS = ₹50
P/E Ratio = 1000 ÷ 50 = 20

**P/E < 15**: Undervalued (might be good buy)
**P/E > 25**: Overvalued (might be expensive)

## 52-Week High/Low:
- **52W High**: ₹2,800 (Highest price in last year)
- **52W Low**: ₹2,100 (Lowest price in last year)

Helps you understand the stock's price range.`
        },
        {
          title: 'Demat and Trading Account',
          duration: '20 min',
          content: `# Demat and Trading Account

To buy or sell stocks, you need two accounts:

## 1. Demat Account (Dematerialized Account)

Think of it as a **digital locker** for your shares.

In old days, people had physical share certificates (paper). Now everything is digital!

**What it stores:**
- Stocks you buy
- Mutual fund units
- Bonds
- Government securities

**Example**: You buy 10 shares of TCS. These shares are stored in your Demat account (not physical papers).

## 2. Trading Account

This is like a **bridge** between your bank account and Demat account.

**How it works:**
1. You have money in Bank Account
2. You place order through Trading Account
3. Money goes from Bank → Trading Account
4. Shares come to Trading Account → Demat Account

## Opening Process:

**Documents Needed:**
- PAN Card (Mandatory)
- Aadhaar Card
- Bank Account Details
- Cancelled Cheque
- Photograph
- Signature

**Popular Brokers:**
- Zerodha, Upstox, Groww, Angel One, ICICI Direct

**Time**: 24-48 hours to open account

## Charges:

**Account Opening**: ₹0 - ₹500 (Most free now)
**Annual Maintenance**: ₹0 - ₹300
**Brokerage**: 0.01% to 0.05% per trade

## Important Points:

✅ One person can have multiple Demat accounts
✅ Keep your passwords safe
✅ Update mobile number and email
✅ Verify broker is SEBI registered
❌ Never share OTP or password with anyone

## How to Buy Your First Stock:

1. **Login** to trading app
2. **Search** for stock (e.g., "Reliance")
3. **Choose quantity** (e.g., 5 shares)
4. **Select order type** (Market or Limit)
5. **Review** total amount
6. **Place Order**
7. **Done!** Shares in your Demat account

## Settlement:
**T+1 Settlement**: Shares come to your Demat in 1 working day
(T = Trading Day)`
        },
        {
          title: 'Types of Orders',
          duration: '25 min',
          content: `# Types of Orders in Stock Market

Understanding different order types is crucial for successful trading.

## 1. Market Order

**Buy/Sell immediately at current market price**

Example: Infosys is trading at ₹1,450
You place MARKET ORDER to buy
Order executes instantly at ₹1,450 (or close to it)

**Pros:**
✅ Instant execution
✅ Guaranteed to execute

**Cons:**
❌ Price might change in seconds
❌ Might get unfavorable price in volatile market

**When to use:** When you want to buy/sell urgently

## 2. Limit Order

**Buy/Sell at a specific price or better**

Example: TCS is at ₹3,500, but you want to buy only at ₹3,450
You place LIMIT ORDER at ₹3,450
Order executes only when price drops to ₹3,450 or below

**Buy Limit**: "I'll buy only at this price or LOWER"
**Sell Limit**: "I'll sell only at this price or HIGHER"

**Pros:**
✅ Price control
✅ No surprises

**Cons:**
❌ Might not execute if price doesn't reach
❌ Can miss opportunities

**When to use:** When you have a target price in mind

## 3. Stop-Loss Order (SL)

**Protects you from big losses**

Example: You bought Wipro at ₹400
You set Stop-Loss at ₹380
If price drops to ₹380, it automatically sells

Think of it as a safety net!

**Types:**
**SL-Market**: Sells at market price when trigger hits
**SL-Limit**: Sells at your limit price when trigger hits

**Real Example:**
- Bought: HDFC Bank at ₹1,600
- Stop-Loss: ₹1,520 (5% below)
- Current Price: ₹1,580 (falling)
- Trigger: When it hits ₹1,520, auto sells
- Result: Loss limited to ₹80 per share

## 4. Good Till Cancelled (GTC)

Order remains active until you cancel it

Example: You want to buy Asian Paints at ₹2,800
Current price: ₹3,000
Set GTC order at ₹2,800
Order stays active for days/weeks until price reaches ₹2,800

**Validity**: Usually 30-90 days

## 5. Immediate or Cancel (IOC)

Order executes immediately (fully or partially), rest cancels

Example: Want to buy 1000 shares
Only 600 available at your price
600 shares executed, 400 cancelled

## 6. Day Order

**Default order type**
Valid only for the trading day
If not executed by 3:30 PM, automatically cancelled

## Order Placement Example:

**Scenario**: Want to buy Reliance at ₹2,400

**Conservative Approach:**
- Current Price: ₹2,450
- Place LIMIT ORDER at ₹2,400
- Wait for price to drop

**Aggressive Approach:**
- Place MARKET ORDER
- Buy immediately at current price

**With Protection:**
- Place LIMIT ORDER at ₹2,400
- After buying, set STOP-LOSS at ₹2,280 (5% below)

## Pro Tips:

💡 Always use Stop-Loss for risk management
💡 Use Limit Orders in volatile markets
💡 Market Orders for blue-chip stocks
💡 Review pending orders daily
💡 Cancel stale orders

## Common Mistakes:

❌ Placing market orders in illiquid stocks
❌ Forgetting to cancel old orders
❌ Not using stop-loss
❌ Setting stop-loss too tight`
        },
        {
          title: 'Bull vs Bear Markets',
          duration: '15 min',
          content: `# Bull vs Bear Markets

Markets move in cycles - sometimes up, sometimes down.

## Bull Market 🐂

**When prices are rising and optimism is high**

**Characteristics:**
- Stock prices rising (20%+ from recent lows)
- High investor confidence
- Strong economic growth
- More buyers than sellers
- Positive news dominates

**Example**: 
March 2020 to Dec 2021
Nifty: 7,500 → 18,000 (140% rise!)

**Investor Behavior:**
- People want to buy more
- "Market will go higher!"
- FOMO (Fear of Missing Out)
- Higher trading volumes

**How to Trade:**
✅ Buy quality stocks
✅ Hold long-term
✅ Ride the wave up
❌ Don't be over-confident

## Bear Market 🐻

**When prices are falling and pessimism is high**

**Characteristics:**
- Stock prices falling (20%+ from peak)
- Investor fear and panic
- Economic slowdown
- More sellers than buyers
- Negative news everywhere

**Example**:
Jan 2008 to March 2009
Sensex: 21,000 → 8,000 (62% fall!)

**Investor Behavior:**
- People want to sell
- "Everything will crash!"
- Panic selling
- Lower trading volumes

**How to Trade:**
✅ Buy quality stocks at discount
✅ Average down carefully
✅ Stay calm
❌ Don't panic sell
❌ Don't try to catch falling knife

## Market Corrections

**When market falls 10-20% from peak**

Normal and healthy for markets!

Example: Nifty at 20,000 → Falls to 18,000 (10% correction)

**What to do:**
- Don't panic
- Good opportunity to buy
- Review your portfolio
- Stick to your plan

## Sideways Market

Market moving in a range (neither up nor down much)

Example: Nifty between 17,500 - 18,500 for 6 months

**Strategy**: Range trading, swing trading

## How to Identify:

**Bull Market Signs:**
- New 52-week highs
- Positive news flow
- IPOs getting oversubscribed
- Everyone talking about stocks

**Bear Market Signs:**
- New 52-week lows
- Negative headlines
- FIIs selling
- People avoiding market talk

## Historical Perspective:

Indian markets have given:
- Long-term: 12-15% annual returns
- Bull markets last longer than bear markets
- Market always recovers eventually

## Remember:

🎯 Markets are cyclical
🎯 Bull and bear are both temporary
🎯 Don't try to time the market
🎯 Stay invested for long-term
🎯 Keep emotions in check`
        }
      ]
    },
    {
      id: 2,
      title: 'Stocks - Complete Guide',
      subtitle: 'Everything about equity investing',
      lessons: 15,
      duration: '4h',
      difficulty: 'Beginner',
      category: 'stocks',
      color: '#8B5CF6',
      modules: [
        {
          title: 'What are Stocks?',
          duration: '20 min',
          content: `# What are Stocks?

Stocks (also called shares or equity) represent ownership in a company.

## Simple Example:

Imagine you and 3 friends start a ₹1 lakh business:
- You invest ₹25,000 (25% ownership)
- Each friend invests ₹25,000 (25% each)

Now scale this: A company worth ₹1 lakh crore divided into 100 crore shares
Each share = ₹1,000

If you buy 1 share = You own 0.000001% of the company!

## Why Companies Issue Stocks?

**Reliance Example:**
- Needs ₹50,000 crore for new 5G rollout
- Instead of bank loan (high interest), sells shares
- Raises money from public
- No repayment pressure
- Shareholders become part-owners

## Types of Stocks:

### 1. Common Stocks (Equity Shares)
**What you usually buy**

**Rights:**
- Voting rights in company decisions
- Dividends (if company gives)
- Capital appreciation

**Example**: You own 100 Infosys shares
- Get dividends: ₹50 per share = ₹5,000
- Voting: Can vote in AGM
- Price rises: ₹1,400 → ₹1,600 = ₹20,000 profit

### 2. Preference Shares
**Priority over common stocks**

**Features:**
- Fixed dividend rate
- No voting rights usually
- First claim on dividends
- First claim if company shuts down

**Less common** in India for retail investors

## Stock Categories by Market Cap:

### Large-Cap Stocks
**Top 100 companies by market cap**

**Examples**: Reliance, TCS, HDFC Bank, Infosys

**Characteristics:**
- Stable and established
- Lower risk
- Lower returns (but steady)
- High liquidity
- Less volatile

**Who should buy**: Conservative investors, beginners

### Mid-Cap Stocks
**Companies ranked 101-250**

**Examples**: Petronet LNG, Indigo, Crompton

**Characteristics:**
- Growth potential
- Moderate risk
- Better returns than large-cap
- Decent liquidity
- Moderately volatile

**Who should buy**: Investors with medium risk appetite

### Small-Cap Stocks
**Companies ranked 251 and below**

**Examples**: Many smaller companies

**Characteristics:**
- High growth potential
- High risk
- Can give multibagger returns
- Low liquidity
- Very volatile

**Who should buy**: Aggressive investors, experienced traders

## Sector Classification:

### Banking & Finance
HDFC Bank, ICICI Bank, Kotak Mahindra

### IT & Technology
TCS, Infosys, Wipro, HCL Tech

### Pharmaceutical
Sun Pharma, Dr. Reddy's, Cipla

### Automobiles
Maruti Suzuki, Tata Motors, M&M

### FMCG
Hindustan Unilever, ITC, Nestle

### Energy
Reliance, ONGC, Coal India

## How to Make Money from Stocks:

### 1. Capital Gains
Buy at ₹1,000, Sell at ₹1,200 = ₹200 profit per share

**Short-term**: Sold within 1 year (15% tax)
**Long-term**: Sold after 1 year (10% tax above ₹1 lakh)

### 2. Dividends
Company shares profits with shareholders

Example: Infosys declares ₹20 dividend per share
You own 100 shares = ₹2,000 dividend income

### 3. Bonus Shares
Free shares given to existing shareholders

Example: 1:1 bonus
You own 100 shares → Get 100 more free!
Total: 200 shares

### 4. Stock Splits
1 share divided into multiple shares

Example: 1:5 split
1 share of ₹5,000 → 5 shares of ₹1,000 each
Total value remains same

## Stock Selection Criteria:

✅ Strong fundamentals (good profit, low debt)
✅ Consistent growth history
✅ Good management team
✅ Competitive advantage
✅ Growing industry
✅ Reasonable valuation (not overpriced)

## Red Flags:

❌ Continuous losses
❌ Very high debt
❌ Frequent management changes
❌ Accounting irregularities
❌ Promoter pledging (using shares as loan collateral)

## Beginner's Stock Portfolio Example:

**₹1,00,000 investment**
- ₹40,000 - Large Cap (TCS, HDFC Bank)
- ₹35,000 - Mid Cap (Good growth companies)
- ₹15,000 - Small Cap (High risk, high return)
- ₹10,000 - International (US stocks)

## Key Takeaways:

🎯 Stocks = Ownership in company
🎯 Returns from price rise + dividends
🎯 Higher risk = Higher potential returns
🎯 Diversify across sectors and market caps
🎯 Long-term wealth creation tool
🎯 Research before investing`
        },
        {
          title: 'How to Select Good Stocks',
          duration: '30 min',
          content: `# How to Select Good Stocks

Picking the right stocks is both art and science. Here's a complete guide:

## Step 1: Industry Analysis

**Choose Growing Industries:**

✅ **Good Industries** (High growth potential):
- Technology (AI, Cloud, Fintech)
- Healthcare & Pharmaceuticals
- Renewable Energy
- E-commerce & Digital
- Electric Vehicles

❌ **Declining Industries** (Avoid):
- Outdated manufacturing
- Obsolete technology
- Heavily regulated with issues

**Example**: Would you invest in a typewriter company today? No! But AI companies? Yes!

## Step 2: Company Fundamentals

### Financial Health Checks:

**1. Revenue Growth**
Is company growing sales?
Check last 5 years trend

Good: 15%+ annual growth
Example: TCS revenue grew from ₹1.23L Cr (2018) to ₹2.25L Cr (2023)

**2. Profit Margins**
Is company making good profit?

**Net Profit Margin** = (Net Profit / Revenue) × 100

Good margins:
- IT: 15-20%
- FMCG: 10-15%
- Retail: 5-10%

**3. Return on Equity (ROE)**
How efficiently company uses shareholder money?

**ROE** = (Net Profit / Shareholder Equity) × 100

Good ROE: Above 15%
Excellent ROE: Above 20%

Example: Asian Paints ROE = 28% (Excellent!)

**4. Debt to Equity Ratio**
How much debt compared to equity?

**D/E Ratio** = Total Debt / Shareholder Equity

Good: Below 1 (Less debt than equity)
Caution: Above 2 (Too much debt)

Example: Reliance D/E = 0.5 (Comfortable level)

**5. Current Ratio**
Can company pay short-term debts?

**Current Ratio** = Current Assets / Current Liabilities

Good: Above 1.5
Example: ITC Current Ratio = 2.8 (Strong)

## Step 3: Valuation Metrics

### Is the stock fairly priced?

**1. P/E Ratio (Price to Earnings)**

P/E = Share Price / Earnings Per Share

- **P/E < 15**: Undervalued (potential buy)
- **P/E 15-25**: Fairly valued
- **P/E > 25**: Overvalued (expensive)

Compare with:
- Industry average P/E
- Company's historical P/E

Example:
- Infosys P/E: 22
- IT Industry Average: 20
Verdict: Slightly expensive

**2. P/B Ratio (Price to Book)**

P/B = Share Price / Book Value Per Share

- P/B < 1: Trading below book value
- P/B 1-3: Reasonable
- P/B > 3: Premium valuation

Good for: Banking, Manufacturing stocks

**3. Dividend Yield**

Dividend Yield = (Annual Dividend / Share Price) × 100

Good: Above 2%
Excellent: Above 4%

Example: ITC dividend yield: 4.2% (Good income stock)

## Step 4: Management Quality

**Check:**
- Track record of promoters
- Corporate governance
- Past scandals (if any)
- Management commentary in reports

**Red Flags:**
❌ Frequent auditor changes
❌ Promoter pledging of shares
❌ Related party transactions
❌ Past fraud cases

## Step 5: Competitive Advantage (Moat)

**Does company have unfair advantage?**

**Types of Moats:**

1. **Brand Power**
Examples: Asian Paints, Nestle, Titan
- People trust and prefer the brand
- Can charge premium prices

2. **Network Effect**
Examples: Zomato, Paytm
- More users attract more users
- Hard for competitors to break

3. **Cost Leadership**
Examples: Maruti Suzuki
- Can produce cheaper than others
- High market share

4. **Switching Cost**
Examples: Banking software
- Costly/difficult for customers to switch
- Sticky customers

5. **Regulatory Approvals**
Examples: Pharmaceutical companies
- High barriers to entry
- Patents protect products

## Step 6: Growth Catalysts

**What will drive stock higher?**

- New product launches
- Market expansion plans
- Technology upgrades
- Government policies
- Industry tailwinds

Example: EV companies benefited from government's EV push

## Step 7: Risks Assessment

**What can go wrong?**

- Competition increasing
- Regulatory changes
- Technology disruption
- Management issues
- Cyclical industry downturn

## Practical Stock Selection Process:

### Example: Evaluating "XYZ" Stock

**Step 1**: Industry ✅
Growing sector (Cloud computing)

**Step 2**: Financials ✅
- Revenue growth: 20% YoY
- Profit margin: 18%
- ROE: 22%
- D/E: 0.3
- Current Ratio: 2.1

**Step 3**: Valuation ✅
- P/E: 18 (Industry: 22) → Undervalued
- P/B: 3.5 → Reasonable for IT
- Dividend Yield: 1.8%

**Step 4**: Management ✅
- Clean track record
- No controversies
- Promoter holding: 55% (stable)

**Step 5**: Moat ✅
- Proprietary technology
- Long-term client contracts
- High switching cost

**Step 6**: Catalysts ✅
- New cloud product launch
- Expanding to US market
- 3 large deals signed

**Step 7**: Risks ⚠️
- High competition
- Currency fluctuation impact
- Client concentration (30% from 1 client)

**Verdict**: Good buy with proper stop-loss

## Tools to Use:

**Screeners:**
- Screener.in
- Tickertape
- Moneycontrol

**Financial Data:**
- Company annual reports
- Quarterly results
- Investor presentations

## Common Mistakes to Avoid:

❌ Buying based on tips
❌ Ignoring fundamentals
❌ Overvaluing growth
❌ Ignoring debt levels
❌ Not diversifying
❌ Falling for penny stocks
❌ Chasing past returns

## Quick Checklist:

Before buying any stock, ensure:
☑ Good industry prospects
☑ Revenue growing YoY
☑ Healthy profit margins
☑ Strong ROE (>15%)
☑ Manageable debt
☑ Reasonable valuation
☑ Clean management
☑ Sustainable competitive advantage
☑ Future growth visibility
☑ Acceptable risk level

## Remember:

🎯 Quality over quantity
🎯 Buy business, not just stock
🎯 Long-term perspective
🎯 Margin of safety
🎯 Continuous monitoring
🎯 Review quarterly results`
        }
      ]
    },
    {
      id: 3,
      title: 'Mutual Funds Complete Guide',
      subtitle: 'From basics to advanced selection',
      lessons: 10,
      duration: '2h 30m',
      difficulty: 'Beginner',
      category: 'mf',
      color: '#F59E0B',
      modules: [
        {
          title: 'What are Mutual Funds?',
          duration: '25 min',
          content: `# What are Mutual Funds?

A mutual fund is like a basket that collects money from many investors and invests it in stocks, bonds, or other securities.

## Simple Analogy:

**Individual Stock Buying:**
You alone go to market, buy vegetables
Risk: If you pick wrong, entire money lost

**Mutual Fund:**
You + 1000 people pool money
Expert chef (fund manager) buys vegetables
Risk: Spread across many items

## How Mutual Funds Work:

### The Players:

**1. You (Investor)**
- Invest ₹5,000 monthly
- Get mutual fund units

**2. Asset Management Company (AMC)**
- Companies like SBI MF, HDFC MF, ICICI Prudential
- Manage your money

**3. Fund Manager**
- Expert who decides which stocks/bonds to buy
- Research and portfolio management

**4. SEBI**
- Regulates mutual funds
- Protects investor interests

### The Process:

**Step 1**: You invest ₹10,000 in "XYZ Mutual Fund"
NAV (Net Asset Value) = ₹100
You get: 10,000 ÷ 100 = **100 units**

**Step 2**: Fund manager invests your money (along with others') in:
- 60% Stocks (Reliance, TCS, HDFC Bank)
- 30% Bonds (Government bonds, corporate bonds)
- 10% Cash (for redemptions)

**Step 3**: After 1 year:
Portfolio grows to ₹11,500
NAV becomes ₹115
Your investment: 100 units × ₹115 = ₹11,500 ✅

## NAV (Net Asset Value)

**Like the "price" of mutual fund**

**Formula:**
NAV = (Total Assets - Total Liabilities) / Total Units

**Example:**
Fund has:
- Stocks worth: ₹950 crores
- Bonds worth: ₹40 crores
- Cash: ₹10 crores
- Total Assets: ₹1,000 crores
- Liabilities: ₹5 crores
- Units outstanding: 10 crore

NAV = (1000 - 5) / 10 = ₹99.50

**NAV Updates:** Calculated daily after market closes (around 9 PM)

## Types of Mutual Funds:

### Based on Asset Class:

**1. Equity Funds**
**Invest mainly in stocks**

**Risk**: High
**Returns**: 12-15% long-term
**Investment Horizon**: 5+ years

**Best for**: Long-term wealth creation

Examples:
- Large Cap Funds (Reliance, TCS, HDFC)
- Mid Cap Funds (Growing companies)
- Small Cap Funds (High risk, high return)
- Multi Cap Funds

**2. Debt Funds**
**Invest in bonds and fixed income**

**Risk**: Low to Moderate
**Returns**: 6-8% annually
**Investment Horizon**: 1-3 years

**Best for**: Stable returns, low risk appetite

Types:
- Liquid Funds (park money for days/weeks)
- Short Duration Funds (1-3 years)
- Corporate Bond Funds
- Gilt Funds (Government securities)

**3. Hybrid Funds**
**Mix of equity and debt**

**Risk**: Moderate
**Returns**: 10-12% annually
**Investment Horizon**: 3-5 years

Types:
- Aggressive Hybrid (65% equity, 35% debt)
- Conservative Hybrid (25% equity, 75% debt)
- Balanced Advantage Funds (dynamic allocation)

**Best for**: Balanced approach, moderate risk

**4. Index Funds**
**Copy a market index**

Example: Nifty 50 Index Fund
- Buys all 50 stocks in Nifty
- Same weightage as index
- Passive management

**Risk**: Moderate
**Returns**: Same as index (12-13%)
**Cost**: Very low expense ratio (0.1-0.3%)

**Best for**: Long-term, low-cost investing

**5. ELSS (Tax Saving Funds)**
**Equity funds with tax benefits**

**Features:**
- Tax deduction up to ₹1.5 lakh (Section 80C)
- Lock-in: 3 years (shortest among tax-saving options)
- Invest in stocks

**Returns**: 12-15% long-term

**Best for**: Tax saving + wealth creation

## Why Invest in Mutual Funds?

### ✅ Advantages:

**1. Professional Management**
Expert fund managers with research teams
You don't need to track markets daily

**2. Diversification**
One mutual fund = 30-50 stocks
Risk spreads across companies

Example: One stock falls 20%, but fund falls only 2%

**3. Low Investment Amount**
Start with ₹500 SIP
No need for lakhs of rupees

**4. Liquidity**
Can redeem anytime (except ELSS)
Money in bank within 1-3 days

**5. Transparency**
Monthly factsheets
Daily NAV updates
Complete portfolio disclosure

**6. Regulated**
SEBI oversight
Investor protection

**7. Tax Efficiency**
Equity funds: 10% tax (>₹1L gains) after 1 year
Debt funds: Based on holding period

### ❌ Disadvantages:

**1. No Guaranteed Returns**
Returns vary based on market

**2. Exit Load**
Sell within 1 year = 1% penalty

**3. Expense Ratio**
Annual charges: 0.5% - 2.5%
Reduces your returns

**4. No Control**
Fund manager decides what to buy

## Mutual Fund Returns Example:

**Investment:** ₹10,000 per month SIP
**Duration:** 10 years
**Fund:** Equity Mutual Fund
**Assumed Return:** 12% annually

**Total Invested:** ₹12,00,000
**Final Value:** ₹23,23,391
**Profit:** ₹11,23,391 🎉

**Power of Compounding!**

## How to Invest:

**Direct Plan vs Regular Plan**

**Direct Plan:**
- Buy directly from AMC website/app
- Lower expense ratio (0.5-1%)
- Higher returns (0.5-1% more annually)

**Regular Plan:**
- Buy through broker/distributor
- Higher expense ratio (1-2.5%)
- Broker gets commission

**Recommendation:** Always choose Direct Plans

**SIP vs Lumpsum**

**SIP (Systematic Investment Plan):**
- Fixed amount monthly (₹1000, ₹5000, etc.)
- Rupee cost averaging
- Less risk
- Best for salaried individuals

**Lumpsum:**
- One-time big investment
- Higher risk (timing matters)
- Good when markets are low
- Best when you have large sum

## Choosing the Right Fund:

**Factors to Consider:**

**1. Investment Goal**
- Retirement: Equity funds (15-20 years)
- Child education: Hybrid funds (10-15 years)
- Emergency fund: Liquid funds
- Tax saving: ELSS

**2. Risk Appetite**
- High risk: Small cap equity
- Medium risk: Hybrid funds
- Low risk: Debt funds

**3. Investment Horizon**
- >5 years: Equity funds
- 3-5 years: Hybrid funds
- <3 years: Debt funds

**4. Past Performance**
Check 5-year and 10-year returns
Compare with benchmark and peers

**5. Expense Ratio**
Lower is better
Direct plans have lower ratio

**6. Fund Manager Track Record**
How long managing the fund?
Consistent performance?

**7. AUM (Assets Under Management)**
Not too small (<₹100 crore)
Not too large (>₹50,000 crore for small/mid cap)

## Reading Mutual Fund Factsheet:

**Top Holdings:**
- Which stocks fund owns
- Concentration risk check

**Asset Allocation:**
- % in equity vs debt
- Sector wise breakup

**Returns:**
- 1Y, 3Y, 5Y, 10Y returns
- Compare with benchmark

**Risk Metrics:**
- Standard Deviation (volatility)
- Sharpe Ratio (risk-adjusted return)
- Beta (compared to market)

## Tax on Mutual Funds:

**Equity Funds:**
- Short-term (<1 year): 15% tax
- Long-term (>1 year): 10% tax above ₹1 lakh gains

**Debt Funds:**
Taxed as per income tax slab

**Example:**
Invested ₹1,00,000 → Grew to ₹2,00,000 in 2 years
Gain: ₹1,00,000
Tax: ₹10,000 - ₹1,00,000 = 0 (₹1L exempt)
Then 10% on remaining = ₹0

## Common Mistakes:

❌ Chasing past returns
❌ Too many funds (over-diversification)
❌ Redeeming in panic during fall
❌ Not reviewing portfolio
❌ Choosing regular plans
❌ Wrong fund for wrong goal
❌ Ignoring expense ratio

## Sample Portfolio:

**Monthly Budget: ₹20,000 SIP**

**Age 25-30 (Aggressive):**
- ₹8,000 - Large Cap Fund
- ₹6,000 - Mid Cap Fund
- ₹4,000 - Small Cap Fund
- ₹2,000 - International Fund

**Age 30-40 (Balanced):**
- ₹8,000 - Large Cap Fund
- ₹5,000 - Mid Cap Fund
- ₹5,000 - Hybrid Fund
- ₹2,000 - Debt Fund

**Age 40-50 (Conservative):**
- ₹7,000 - Large Cap Fund
- ₹5,000 - Hybrid Fund
- ₹5,000 - Debt Fund
- ₹3,000 - Liquid/Arbitrage Fund

## Key Takeaways:

🎯 Professional management of your money
🎯 Start small with SIP
🎯 Choose direct plans
🎯 Diversify across fund types
🎯 Long-term investment (5+ years)
🎯 Review annually, don't panic
🎯 Match fund with your goal
🎯 Equity for wealth, debt for stability`
        }
      ]
    },
    {
      id: 4,
      title: 'F&O - Futures & Options',
      subtitle: 'Advanced derivatives trading',
      lessons: 14,
      duration: '4h',
      difficulty: 'Advanced',
      category: 'fno',
      color: '#DC2626',
      modules: [
        {
          title: 'Introduction to F&O',
          duration: '30 min',
          content: `# Introduction to Futures & Options (F&O)

F&O are derivative instruments - their value is derived from underlying assets (stocks, indices).

## What are Derivatives?

**Simple Definition:**
A contract whose value depends on something else (underlying asset)

**Example:**
- Underlying: Reliance stock
- Derivative: Reliance Futures or Options
- If Reliance moves, derivative moves

## Why F&O Trading?

### 1. Leverage
Control large position with small capital

**Example:**
Buy Reliance stock: Need ₹2,500 × 100 = ₹2,50,000
Buy Reliance Future: Need only ₹50,000 margin
**Leverage: 5x**

### 2. Hedging
Protect your stock portfolio from losses

**Example:**
Own ₹10 lakh Nifty stocks
Buy Nifty Put option
If market falls, Put option profit covers stock losses

### 3. Speculation
Profit from price movements (up or down)

Can make money in falling markets too!

### 4. Arbitrage
Profit from price differences

Stock trading at different prices on NSE vs BSE

## F&O Market Structure:

**Lot Size:**
Can't buy 1 Future/Option
Must buy in lots

**Examples:**
- Nifty: 50 units per lot
- Bank Nifty: 15 units per lot
- Reliance: 250 shares per lot
- TCS: 150 shares per lot

**If Nifty at 19,500:**
1 lot = 50 × 19,500 = ₹9,75,000 contract value
Margin needed: ~₹1,20,000

## Expiry Dates:

**Monthly Expiry:**
Last Thursday of every month

**Weekly Expiry:**
- Nifty: Thursday
- Bank Nifty: Wednesday
- Fin Nifty: Tuesday

**Example:**
Today: November 10, 2024
November expiry: November 28 (last Thursday)

## Key Differences:

### Stocks vs F&O

**Stocks:**
- Buy 1 share possible
- No expiry
- Delivery based
- Lower leverage
- Suitable for long-term

**F&O:**
- Must buy in lots
- Monthly expiry
- Cash settled
- High leverage
- Suitable for traders

## Who Should Trade F&O?

✅ **Suitable for:**
- Experienced traders
- Understanding of markets
- Risk management skills
- Capital to afford losses
- Can track markets actively

❌ **Not suitable for:**
- Complete beginners
- Long-term investors
- Low risk appetite
- Cannot afford losses
- No time to monitor

## F&O Segments:

### 1. Index F&O
Based on indices (Nifty, Bank Nifty)

**Available:**
- Nifty 50
- Bank Nifty
- Fin Nifty
- Nifty IT
- Nifty Pharma

### 2. Stock F&O
Based on individual stocks

**Criteria for F&O listing:**
- Large cap stocks mostly
- High liquidity
- Market cap > ₹500 crore

**Popular F&O stocks:**
Reliance, TCS, HDFC Bank, Infosys, ITC

## Important Terms:

**1. Underlying Asset**
The stock/index on which F&O is based

**2. Lot Size**
Minimum quantity to trade

**3. Strike Price**
Price at which you can buy/sell (in Options)

**4. Premium**
Price you pay to buy option

**5. Expiry Date**
Last day of contract

**6. Margin**
Money blocked as security

**7. Mark to Market (MTM)**
Daily profit/loss settlement

## Risk in F&O:

### ⚠️ HIGH RISK!

**Leverage cuts both ways:**
- Profit: Can multiply 5x-10x
- Loss: Can also multiply 5x-10x

**Example:**
Margin: ₹1,00,000
Position size: ₹10,00,000 (10x leverage)

Market moves 2% against you:
Loss: 2% × ₹10,00,000 = ₹20,000 (20% of margin!)

**Can lose more than investment in some strategies!**

## Safety Rules for F&O:

🛡️ Start with small positions
🛡️ Always use stop-loss
🛡️ Don't use full margin
🛡️ Understand what you trade
🛡️ Never hold to expiry (unless planned)
🛡️ Keep cash reserve
🛡️ Risk only what you can afford to lose

## F&O vs Stock Trading:

| Aspect | Stocks | F&O |
|--------|--------|-----|
| Capital | High | Low (leverage) |
| Risk | Moderate | Very High |
| Expiry | No | Yes |
| Profit Potential | Moderate | High |
| Loss Potential | Moderate | Very High |
| Suitable for | Investors | Traders |
| Time Needed | Less | More |

## Example Scenario:

**Stock Trading:**
- Buy 100 Reliance shares at ₹2,500
- Investment: ₹2,50,000
- Stock rises to ₹2,600
- Profit: ₹10,000 (4%)

**F&O Trading:**
- Buy 1 lot Reliance Future (250 shares) at ₹2,500
- Margin: ₹50,000
- Contract value: ₹6,25,000
- Future rises to ₹2,600
- Profit: ₹25,000 (50% return on margin!)

**But if wrong:**
- Loss: ₹25,000 (50% of margin gone!)

## Regulations:

**SEBI Rules:**
- Minimum margin requirements
- Position limits
- Reporting requirements
- Exchange monitored

**Broker Requirements:**
- Proof of income
- Risk disclosure
- Margin maintenance

## Prerequisites Before Starting:

☑ Understand stock markets well
☑ Have trading experience (6+ months)
☑ Learn technical analysis
☑ Start with paper trading
☑ Have risk capital
☑ Learn from courses
☑ Practice on simulators
☑ Start with small positions

## Next Steps:

After understanding basics:
1. Learn Futures in detail
2. Learn Options strategies
3. Practice on simulators
4. Start with small capital
5. Build gradually

## Remember:

⚠️ 90% of F&O traders lose money
⚠️ Not a get-rich-quick scheme
⚠️ Requires skill and discipline
⚠️ Can lose entire capital
⚠️ Start only when ready

**F&O is powerful tool but dangerous if misused!**`
        },
        {
          title: 'Futures Explained',
          duration: '35 min',
          content: `# Futures Trading Complete Guide

Futures are agreements to buy/sell an asset at a predetermined price on a future date.

## Simple Example:

**Today (November):**
- You agree to buy 1kg gold at ₹60,000
- Delivery: December 31

**December 31:**
- Gold market price: ₹65,000
- You pay only: ₹60,000
- **Your Profit: ₹5,000**

This is a Futures contract!

## How Stock Futures Work:

**Nifty Future Example:**

**Today:**
- Nifty Spot: 19,500
- Nifty December Future: 19,550
- You BUY 1 lot (50 units)
- Contract Value: 50 × 19,550 = ₹9,77,500
- Margin Required: ₹1,20,000 (12%)

**Next Week:**
- Nifty moves to 19,700
- Future price: 19,750
- Your gain: (19,750 - 19,550) × 50 = ₹10,000
- Return on margin: 8.3% in 1 week!

## Key Features:

### 1. Contract Specifications

**Nifty Future:**
- Lot Size: 50
- Tick Size: 0.05 points
- Trading Hours: 9:15 AM - 3:30 PM
- Expiry: Last Thursday

**Bank Nifty Future:**
- Lot Size: 15
- Higher volatility
- Weekly expiry available

### 2. Margin System

**Two Types:**

**Initial Margin (SPAN):**
Minimum margin to open position
Usually 10-15% of contract value

**Exposure Margin:**
Additional buffer
Usually 3-5%

**Total Margin = SPAN + Exposure + Extreme Loss Margin**

**Example for Reliance Future:**
- Contract Value: ₹6,00,000
- SPAN Margin: ₹60,000 (10%)
- Exposure: ₹18,000 (3%)
- Total: ₹78,000

### 3. Mark to Market (MTM)

**Daily profit/loss settlement**

**Example:**
Day 1: Buy Nifty Future at 19,500
Day 2: Nifty closes at 19,450
MTM Loss: (19,450 - 19,500) × 50 = -₹2,500
**This ₹2,500 debited from your account**

Day 3: Nifty closes at 19,600
MTM Profit: (19,600 - 19,450) × 50 = +₹7,500
**This ₹7,500 credited to your account**

### 4. Rollover

**Moving position to next month**

**Why Rollover?**
Don't want to close position
Want to continue holding

**How:**
- Close November contract
- Open December contract
- Pay rollover charges

**Cost of Rollover:**
Price difference between contracts + brokerage

**Example:**
- November Future: 19,500
- December Future: 19,550
- Rollover Cost: 50 points × 50 = ₹2,500

## Types of Positions:

### 1. Long Position (Bullish)

**Expectation:** Price will rise

**Action:** BUY Future

**Example:**
- Buy Nifty at 19,500
- Target: 19,800
- Stop-loss: 19,350

**If Right:**
- Nifty → 19,800
- Profit: (19,800-19,500) × 50 = ₹15,000

**If Wrong:**
- Nifty → 19,350
- Loss: (19,350-19,500) × 50 = -₹7,500

### 2. Short Position (Bearish)

**Expectation:** Price will fall

**Action:** SELL Future (even if you don't own!)

**Example:**
- Sell Nifty at 19,500
- Target: 19,200
- Stop-loss: 19,650

**If Right:**
- Nifty → 19,200
- Profit: (19,500-19,200) × 50 = ₹15,000

**If Wrong:**
- Nifty → 19,650
- Loss: (19,650-19,500) × 50 = -₹7,500

## Futures Pricing:

### Spot vs Future Price

**Fair Value = Spot Price + Cost of Carry**

**Cost of Carry includes:**
- Interest cost (on blocked capital)
- Dividends (if any)
- Time to expiry

**Example:**
- Nifty Spot: 19,500
- Interest rate: 7% annually
- Time to expiry: 1 month
- Dividend: ₹0

Future Fair Value:
19,500 + (19,500 × 7% × 1/12) = 19,614

**If Future trading at:**
- 19,650: Premium (bullish sentiment)
- 19,580: Discount (bearish sentiment)

### Premium vs Discount

**Premium (Contango):**
Future > Spot
Bullish market

**Discount (Backwardation):**
Future < Spot
Bearish market

## Hedging with Futures:

### Protecting Stock Portfolio

**Scenario:**
- Own ₹10 lakh Nifty stocks
- Worried about market fall
- Don't want to sell (long-term investor)

**Solution:**
Sell Nifty Futures worth ₹10 lakh

**Result:**
- Market falls 5%
- Stock portfolio loss: -₹50,000
- Future profit: +₹50,000
- **Net: ₹0** (Protected!)

### Real Example:

**Portfolio:**
- 100 Reliance shares at ₹2,500 = ₹2,50,000
- Expecting correction

**Hedge:**
Sell 1 lot Reliance Future (250 shares) at ₹2,500

**Outcome 1: Market Falls**
- Reliance → ₹2,300
- Stock loss: ₹20,000
- Future profit: (2,500-2,300) × 250 = ₹50,000
- Net gain: ₹30,000

**Outcome 2: Market Rises**
- Reliance → ₹2,700
- Stock gain: ₹20,000
- Future loss: -₹50,000
- Net loss: -₹30,000

*Hedge limits both gain and loss!*

## Trading Strategies:

### 1. Trend Following

**Logic:** Trade in direction of trend

**Long Trend:**
- Nifty above 200-day MA
- Buy dips
- Trail stop-loss

**Short Trend:**
- Nifty below 200-day MA
- Sell rallies
- Trail stop-loss

### 2. Range Trading

**Logic:** Buy at support, sell at resistance

**Setup:**
- Nifty range: 19,400 - 19,600
- Buy at 19,400
- Sell at 19,600
- Stop if breaks range

### 3. Breakout Trading

**Logic:** Trade when price breaks range

**Bullish Breakout:**
- Nifty breaks above 19,600
- Buy on breakout
- Target: 19,800
- Stop: 19,550

### 4. Arbitrage

**Logic:** Price difference between markets

**Cash-Future Arbitrage:**
- Nifty Spot: 19,500
- Nifty Future: 19,600 (Premium too high)
- Buy Spot, Sell Future
- Profit: 100 points on expiry

## Risk Management:

### Position Sizing

**Never use full margin!**

**Conservative:** Use 30% margin capacity
**Moderate:** Use 50% margin capacity
**Aggressive:** Use 70% margin capacity (risky!)

**Example:**
Total Capital: ₹5,00,000
Conservative: Trade worth ₹1,50,000 margin
= 1 Nifty Lot + Buffer

### Stop-Loss Rules

**Mandatory for Futures trading!**

**Methods:**

**1. Percentage-based:**
Risk 1-2% of capital per trade

Capital: ₹5 lakh
Risk: 2% = ₹10,000
Stop-loss: Calculate to limit loss to ₹10,000

**2. Technical-based:**
Below support for long
Above resistance for short

**3. Volatility-based:**
1.5 × ATR (Average True Range)

### Common Mistakes:

❌ Trading without stop-loss
❌ Averaging losing positions
❌ Holding till expiry unplanned
❌ Over-leveraging
❌ Trading on tips
❌ Revenge trading
❌ Ignoring MTM charges
❌ Not understanding contract specs

## Costs Involved:

**Brokerage:**
₹10-20 per executed order (or 0.03%)

**STT (Securities Transaction Tax):**
0.01% on sell side (Futures)

**Exchange Charges:**
NSE: 0.002%

**GST:**
18% on (brokerage + exchange charges)

**SEBI Charges:**
₹10 per crore

**Stamp Duty:**
State specific

**Example:**
Contract value: ₹10 lakh
Total charges: ₹200-300

## Tax on Futures:

**Speculative Income:**
Taxed as per income slab

**No LTCG benefit** (even if held >1 year)

**Example:**
Salary: ₹15 lakh (30% slab)
F&O Profit: ₹2 lakh
Tax: 30% of ₹2 lakh = ₹60,000

**Can set off losses:**
Against other speculative income

## When to Exit:

✅ Target achieved
✅ Stop-loss hit
✅ Strategy invalidated
✅ 2-3 days before expiry
✅ News/event risk
❌ Never hold to expiry (unplanned)

## Key Takeaways:

🎯 High leverage = High risk
🎯 Always use stop-loss
🎯 Understand MTM impact
🎯 Don't use full margin
🎯 Expiry management crucial
🎯 Perfect for hedging
🎯 Requires active monitoring
🎯 Not for beginners`
        }
      ]
    }
  ];

 export const keyTradingPoints = [
    {
      icon: 'alert-circle',
      title: 'Never Trade Without Stop-Loss',
      description: 'Protect your capital by always setting a stop-loss order. It\'s your safety net against catastrophic losses.'
    },
    {
      icon: 'trending-up',
      title: 'The Trend is Your Friend',
      description: 'Trade in the direction of the overall market trend. Don\'t fight the market momentum.'
    },
    {
      icon: 'pie-chart',
      title: 'Diversify Your Portfolio',
      description: 'Spread investments across sectors, market caps, and asset classes to reduce risk.'
    },
    {
      icon: 'target',
      title: 'Risk Only 1-2% Per Trade',
      description: 'Never risk more than 2% of your total capital on a single trade to survive long-term.'
    },
    {
      icon: 'book-open',
      title: 'Do Your Own Research (DYOR)',
      description: 'Never blindly follow tips or recommendations. Always analyze and understand before investing.'
    },
    {
      icon: 'clock',
      title: 'Patience is Key',
      description: 'Wait for the right setup. Not every day is a trading day. Quality over quantity.'
    },
    {
      icon: 'heart',
      title: 'Control Your Emotions',
      description: 'Fear and greed destroy accounts. Stick to your trading plan regardless of emotions.'
    },
    {
      icon: 'file-text',
      title: 'Maintain a Trading Journal',
      description: 'Record all trades with reasons, outcomes, and learnings. Review regularly to improve.'
    },
    {
      icon: 'shield',
      title: 'Position Sizing Matters',
      description: 'Calculate proper position size based on your capital and risk tolerance before entering.'
    },
    {
      icon: 'minimize',
      title: 'Cut Losses Quick, Let Profits Run',
      description: 'Exit losing positions fast. Give winning trades room to grow. Don\'t do opposite!'
    }
  ];