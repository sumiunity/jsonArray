/**
 * Table Format
 * =============
 * Routines for formatting and manipulating the table data
 *
 * :Author: Nik Sumikawa
 * :Date: Oct 3, 2019
 */

/**
 * pivots a dictionary resulting in a list of dictionaries referenced by key and values
 * @param  {dictionary} dictionary dictionary containing one element per key
 * @return {list}            list containing the results post pivot
 */
export function pivot( dictionary ){

  var pivot = []
  var key_list = Object.keys( dictionary )
  key_list.forEach( function(key, i){
    var dict = {'key':key, 'value':dictionary[key] }
    pivot.push( dict )
  })

  return pivot
}
