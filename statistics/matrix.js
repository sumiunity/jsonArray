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

import * as arrayStats from './array'

export function max(data, col){
  if( data.length === 1 ) return data[0][col]
  return arrayStats.max(data.map(row => row[col]))
}

export function min(data, col){
  if( data.length === 1 ) return data[0][col]
  return arrayStats.min(data.map(row => row[col]))
}

export function sum(data, col){
  if( data.length === 1 ) return data[0][col]
  return arrayStats.sum(data.map(row => row[col]))
}

export function mean(data, col){
  if( data.length === 1 ) return data[0][col]
  return arrayStats.mean(data.map(row => row[col]))
}
