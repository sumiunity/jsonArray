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
  array = dropna(array)
  if( array.length === 1 ) return array[0]
  return Math.max(...array)
}

export function min(array){
  array = dropna(array)
  if( array.length === 1 ) return array[0]
  return Math.min(...array)
}

export function sum(array){
  array = dropna(array)
  if( array.length === 1 ) return array[0]
  return array.reduce((a,b) => a + b, 0)
}

export function mean(array){
  array = dropna(array)
  if( array.length === 1 ) return array[0]
  return sum(array) / array.length
}

export function dropna(array){
  return array.filter(r => (r !== undefined)&(r !== null) )
}
