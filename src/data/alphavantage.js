
/**
 * Init Alpha Vantage with your API key.
 *
 * @param {String} key
 *   Your Alpha Vantage API key.
 */
 const alpha = require('alphavantage');

 // const alpha = require('alphavantage')({ key: 'qweqweqwe' });
const api_key = '4MP93LXFWD2CBYRF'


export async function get( symbol ){
  // alpha({ key: 'qweqweqwe' })
  // alpha.data.batch([`msft`, `aapl`]).then(data => {
  //   console.log(data);
  // });
  //
  // `https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES&symbols=${term}&apikey=${key}`;
  var url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${api_key}`;
  fetch( url )
  const res = await fetch( url );
  const json_obj = await res.json();
  console.log( json_obj )
}


//
// // Simple examples
// alpha.data.intraday(`msft`).then(data => {
//   console.log(data);
// });
//
// alpha.data.batch([`msft`, `aapl`]).then(data => {
//   console.log(data);
// });
//
// alpha.forex.rate('btc', 'usd').then(data => {
//   console.log(data);
// });
//
// alpha.crypto.daily('btc', 'usd').then(data => {
//   console.log(data);
// });
//
// alpha.technical.sma(`msft`, `daily`, 60, `close`).then(data => {
//   console.log(data);
// });
//
// alpha.performance.sector().then(data => {
//   console.log(data);
// });
