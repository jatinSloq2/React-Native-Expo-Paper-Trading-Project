const fetch = require('node-fetch');
const fs = require('fs');

async function buildSymbolInfo(page = 1, perPage = 250) {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false`;
  const res = await fetch(url);
  const data = await res.json();
  const info = {};
  for (let coin of data) {
    const symbol = coin.symbol.toUpperCase();
    info[symbol] = {
      name: coin.name,
      image: coin.image
    };
  }
  return info;
}

async function buildTop500SymbolInfo() {
  const perPage = 500;
  const page1 = await buildSymbolInfo(1, perPage);
  const page2 = await buildSymbolInfo(2, perPage);
  const page3 = await buildSymbolInfo(2, perPage);
  const page4 = await buildSymbolInfo(2, perPage);
  const combined = { ...page1, ...page2 , ...page3, page4}; // merge both pages (~500 coins)
  return combined;
}

buildTop500SymbolInfo().then(obj => {
  const fileName = 'symbol_info.json';
  fs.writeFileSync(fileName, JSON.stringify(obj, null, 2));
  console.log(`Saved top 500 crypto symbols to ${fileName}`);
});

