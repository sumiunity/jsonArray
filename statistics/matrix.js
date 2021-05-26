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


export function forward_diff(data, col, newCol, step=1){
  if( newCol === undefined) newCol = col

  for( let i=step; i < data.length; i++ ){
    data[i][newCol] = data[i][col] - data[i-step][col]
  }

  return data
}


// computes the rolling average for the provided column
export function rolling_average(data, col, window=7 ){

  var pStep, nStep
  if( window % 2  === 0){
    pStep = window/2
    nStep = window/2

  }else{
    pStep = Math.floor(window/2)
    nStep = Math.floor(window/2) + 1
  }

  const yValues = data.map(r => r[col])

  for( let i=0; i < data.length; i++ ){

    var start = i - nStep
    var end = i + pStep

    // ensure that the statistics do not count out of bounds values
    if (start < 0 ) start = 0
    if (end > data.length ) end = data.length

    data[i][`${col}_avg`] = arrayStats.mean(yValues.slice(start,end))
  }

  return data
}
