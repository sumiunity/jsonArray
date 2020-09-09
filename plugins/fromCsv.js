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

var http = require("http"),
    zlib = require("zlib");

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



/**
* Returns a json array with the contents of the csv file
* provided at the url address
* @param  {string} url url address where the data is stored
* @return {Array}     jsonArray containing the csv data
*/
export async function from_url( file, callback, params={} ){

  if( parser === undefined ){
    console.log( 'papaparser not installed' )
    return
  }


  // var data

  const data = await parser.parse(
    file,
    { ...{params},
      ...{
        download: true,
        header: true,
        complete: function(results) {
          if( callback !== undefined ){

            // convert to a json Array and remove all missing rows
            var json_array = new jsonArray( results.data )
            json_array = json_array.filter(row => Object.keys(row).length > 2)

            // perform callback to update parent state
            callback( json_array )
          }
        }

      }
  })

}



/**
* Returns a json array with the contents of the csv file
* provided at the url address
* @param  {string} url url address where the data is stored
* @return {Array}     jsonArray containing the csv data
*/
export async function from_gz_url( url, callback, params={} ){

  if( parser === undefined ){
    console.log( 'papaparser not installed' )
    return
  }

  // buffer to store the streamed decompression
  var buffer = [];

  console.log( 'do i get here??')
  http.get(url, function(res) {
      // pipe the response into the gunzip to decompress
      var gunzip = zlib.createGunzip();
      res.pipe(gunzip);

      gunzip.on('data', function(data) {
          // decompression chunk ready, add it to the buffer
          buffer.push(data.toString())

      }).on("end", function() {
        console.log( 'parsed successfully')
        parser.parse(
          buffer.join(""),
          { ...{params},
            ...{
              header: true,
              complete: function(results) {
                // console.log( results )

                var data = results.data
                data = data.filter( row => row.VALUE !== '1')
                console.log( data )
                console.log( callback )
                if( callback !== undefined ){
                  // convert to a json Array and remove all missing rows
                  var json_array = new jsonArray( data )
                  // json_array = json_array.filter(row => Object.keys(row).length > 2)

                  // perform callback to update parent state
                  callback( json_array )
                }
              }

            }
        })

      }).on("error", function(e) {
        console.log( 'failed' )
          callback(e);
      })
  }).on('error', function(e) {
    console.log( 'failed' )
      callback(e)
  });

}
