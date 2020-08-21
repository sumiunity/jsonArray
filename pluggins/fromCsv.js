/**
 * cSV to jsonArray
 * ==================
 *
 * pluggin that supports the json to csv module. This converts the a
 * csv file stored remotely into a json Array
 *
 * @author Nik Sumikawa
 * @date Aug 20, 2020
 */

import jsonArray from '../jsonArray'

// import papaparser when available
var parser
try{ parser = require("papaparse"); }catch{}

/**
 * Returns a json array with the contents of the csv file
 * provided at the url address
 * @param  {string} url url address where the data is stored
 * @return {Array}     jsonArray containing the csv data
 */
export function from_file( file, params={} ){

  if( parser === undefined ){
    console.log( 'papaparser not installed' )
    return
  }


  const data = parser.parse(
    file,
    { ...{params},
      ...{
        header: true
      }
  })

  // console.log( data )
  return new jsonArray( data.data )
}
