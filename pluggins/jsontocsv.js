/**
 * json to csv
 * ==================
 *
 * pluggin that supports the json to csv module. This converts the a
 * csv file stored remotely into a json Array
 *
 * @author Nik Sumikawa
 * @date Aug 20, 2020
 */



var csvtojsonV2
try{ csvtojsonV2 = require("csvtojson/v2"); }catch{}

/**
 * Returns a json array with the contents of the csv file
 * provided at the url address
 * @param  {string} url url address where the data is stored
 * @return {Array}     jsonArray containing the csv data
 */
export function from_csv( url ){
  console.log(url)
  csvtojsonV2()
    .fromFile(url)
    .then( (jsonObj) => console.log( jsonObj ) )


}
