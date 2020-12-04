/**
 * Matrix statistics
 * =================
 *
 * Basic statistical functions for an Matrix implementation
 *
 * @author Nik Sumikawa
 * @date Dec 4, 2020
 *
 */


export function max(array){
  if( array.length === 1 ) return array[0]
  return Math.max(...array)
}

export function min(array){
  if( array.length === 1 ) return array[0]
  return Math.min(...array)
}

export function sum(array){
  if( array.length === 1 ) return array[0]
  return array.reduce((a,b) => a + b, 0)
}

export function mean(array){
  if( array.length === 1 ) return array[0]
  return sum(array) / array.length
}
