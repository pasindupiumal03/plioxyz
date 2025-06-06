import { type NextRequest, NextResponse } from "next/server"

interface CryptoRequest {
  category: "large-cap" | "meme-coins"
}

export async function POST(request: NextRequest) {
  try {
    const { category }: CryptoRequest = await request.json()

    // Get CoinMarketCap API key from environment
    const CMC_API_KEY = process.env.COINMARKETCAP_API_KEY

    if (!CMC_API_KEY) {
      return NextResponse.json({ error: "CoinMarketCap API key not configured" }, { status: 500 })
    }

    console.log(`Fetching ${category} crypto data from CoinMarketCap...`)

    // Define the specific cryptocurrencies we want to fetch
    const targetSymbols =
      category === "large-cap" ? ["BTC", "ETH", "SOL", "XRP", "ADA", "DOT"] : ["DOGE", "SHIB", "PEPE", "WIF", "BONK"]

    // Use the quotes endpoint to get specific cryptocurrencies
    const baseUrl = "https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest"
    const params = new URLSearchParams({
      symbol: targetSymbols.join(","),
      convert: "USD",
    })

    const response = await fetch(`${baseUrl}?${params}`, {
      headers: {
        "X-CMC_PRO_API_KEY": CMC_API_KEY,
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`CoinMarketCap API error: ${response.status} - ${errorText}`)
      return NextResponse.json({ error: `API request failed: ${response.status}` }, { status: response.status })
    }

    const data = await response.json()
    console.log("Successfully fetched data from CoinMarketCap")

    // Transform CoinMarketCap data to our format
    const cryptos = targetSymbols
      .map((symbol) => {
        const cryptoData = data.data[symbol]?.[0] // CMC returns array for each symbol

        if (!cryptoData) {
          console.warn(`No data found for ${symbol}`)
          return null
        }

        return {
          id: cryptoData.id,
          name: cryptoData.name,
          symbol: cryptoData.symbol,
          price: cryptoData.quote.USD.price,
          change24h: cryptoData.quote.USD.percent_change_24h || 0,
          marketCap: cryptoData.quote.USD.market_cap,
          // Use CoinMarketCap's logo URL
          logoUrl: `https://s2.coinmarketcap.com/static/img/coins/64x64/${cryptoData.id}.png`,
        }
      })
      .filter(Boolean) // Remove null entries

    // Sort by market cap for large cap, maintain order for meme coins
    if (category === "large-cap") {
      cryptos.sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0))
    }

    return NextResponse.json({ cryptos })
  } catch (error) {
    console.error("Crypto API error:", error)
    return NextResponse.json({ error: "Failed to fetch cryptocurrency data" }, { status: 500 })
  }
}
