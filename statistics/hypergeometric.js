/**
 * Hypergeometric Distribution
 * ============================
 * @author Nik Sumikawa
 * @date Nov 30, 2020
 */


export function pmf( N, K, n, k){
  const binomialCoef = require('./binomialCoef.js' ).binomialCoef

  const successes = binomialCoef( K, k )
  const samples = binomialCoef( N, n )
  const successToSamples = binomialCoef( N-K, n-k )

  if( isNaN(samples) ) return 66535
  if( isNaN(successes) ) return 66535
  if( isNaN(successToSamples) ) return 66535

  return successes * successToSamples / samples
}
