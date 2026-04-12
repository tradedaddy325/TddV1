import type { NextApiRequest, NextApiResponse } from "next";

async function getMarketPrices() {
  const key = process.env.TWELVE_DATA_API_KEY;

  const [gold, silver, eurusd, btc] = await Promise.all([
    fetch(`https://api.twelvedata.com/price?symbol=XAU/USD&apikey=${key}`).then(r=>r.json()),
    fetch(`https://api.twelvedata.com/price?symbol=XAG/USD&apikey=${key}`).then(r=>r.json()),
    fetch(`https://api.twelvedata.com/price?symbol=EUR/USD&apikey=${key}`).then(r=>r.json()),
    fetch(`https://api.twelvedata.com/price?symbol=BTC/USD&apikey=${key}`).then(r=>r.json())
  ]);

  return {
    gold: parseFloat(gold.price),
    silver: parseFloat(silver.price),
    eurusd: parseFloat(eurusd.price),
    btc: parseFloat(btc.price),
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const prices = await getMarketPrices();

    const ai = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.CLAUDE_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1200,
        messages: [
          {
            role: "user",
            content: `
Return trading dashboard JSON using:

Gold: ${prices.gold}
Silver: ${prices.silver}
EURUSD: ${prices.eurusd}
BTC: ${prices.btc}

Return JSON with:
macro, psychology, signals, technical, predictive
`
          }
        ]
      })
    });

    const aiRes = await ai.json();

    let parsed;
    try {
      parsed = JSON.parse(aiRes.content?.[0]?.text || "{}");
    } catch {
      parsed = {};
    }

    res.status(200).json(parsed);

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "fail" });
  }
}
