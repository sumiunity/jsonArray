/**
 * Index
 * ================
 *
 * File used for development of js scripts hosted by nodejs
 *
 * :Author: Nik Sumikawa
 * :Date: Aug 31, 2020
 */


import jsonArray from './src/jsonArray'
// import {data} from './src/tests/data'
//
//
// console.log( 'boom working' )
// import hypergeometric from './src/algorithms/hypergeometric'
import chamber from './chamber.json'

const failing = ['TZ27014_10', 'TZ27014_12', 'TZ27014_16', 'TZ27014_20', 'TZ27014_24']

var json_array = new jsonArray(chamber)


json_array = json_array.apply(
  'WAFER_ID',
  r => failing.includes(r),
  'label'
)


// json_array = json_array.filter( r=> r.STAGE === '6300FILD1A')
// console.log( json_array )
var byStage = json_array.groupby(['STAGE'])

var stats = []
// from scipy.stats import hypergeom
for( var i=0; i < byStage.length; i++ ){

  const stage = byStage[i].json_obj

  const passing = new jsonArray(stage.filter(r => r.label === false))
  const failing = new jsonArray(stage.filter(r => r.label === true))

  // console.log( failing )
  const pareto = failing.count_values(['PRE_EQP_CH_SEQ'])
  const tp = pareto.max('count')

  const chamber = pareto.filter(r => r.count === tp)[0]['PRE_EQP_CH_SEQ']
  const fp = passing.filter(r => r['PRE_EQP_CH_SEQ'] === chamber ).length

  //
  // const pmf = hypergeometric(
  //   [fp], {
  //   m: failing.length,
  //   n: passing.length,
  //   k: fp + tp,
  //   }
  // )
  // console.log(
  //   stage.length,
  //   failing.length,
  //   fp + tp,
  //   tp,
  //  )
  const temp = pmf(
    stage.length,
    failing.length,
    fp + tp,
    tp,
  )

  stats.push({
        'tp': tp,
        'cham': chamber,
        'stage': byStage[i]['STAGE'],
        'total': stage.length,
        'fp': fp,
        'pmf': temp
  })
  // break
}

stats = new jsonArray(stats)
console.log( stats.sort_values('pmf', true) )

// Returns the binomial coefficient
// where a is the total set of posibbilites
// and b is the number of combinatios we're interested in

export function binomialCoef(a, b) {
  var numerator = fact(a);
  var denominator = fact(a-b) *  fact(b);
  return numerator / denominator;
}

// Factorial function.
export function fact(x) {
  var total = 1
  for( var i=x; i > 0; i-- ){
    total = total * i
  }
  return total
   // if(x==0) return 1;
   // return x * fact(x-1);
}

export function pmf( N, K, n, k){
  return binomialCoef( K, k ) * binomialCoef( N-K, n-k) / binomialCoef(N, n)
}
// N, K
// function hyp(x, n, m, nn) {
//   // console.log('hyp', x, n, m, nn)
//   var nz, mz;
//   // best to have n<m
//   if (m < n) {
//     nz = m;
//     mz = n
//   } else {
//     nz = n;
//     mz = m
//   }
//   var h=1;
//   var s=1;
//   var k=0;
//   var i=0;
//   while (i < x) {
//     while (s > 1 && k < nz) {
//       h = h * (1 - mz / (nn - k));
//       s = s * (1 -mz / (nn - k));
//       k = k + 1;
//     }
//     h = h * (nz - i) * (mz - i) / (i + 1) / (nn - nz - mz + i + 1);
//     s = s + h;
//     i = i + 1;
//   }
//   while (k < nz) {
//     s = s * (1 - mz / (nn - k));
//     k = k + 1;
//   }
//   return s;
// }



// function hyp(successesObserved, sampled, successesAvailable, popSize) {
//     // The actual hypergeometric CDF. Requires that half or less of the
//     // population be successes, and that half or less of the population be
//     // sampled.
//
//     // We conceptualize the problem like this: given the population, choose the
//     // successes, choose the sampled items, and look at the size of the overlap.
//
//     // Because of this, it doesn't matter which set is the successes and which
//     // is the sampled items, so we can swap those around for numerical reasons.
//
//     // What are the sizes of the two sets we are intersecting, identifgied by
//     // relative size?
//     var smallerSet, largerSet;
//
//     // best to have sampled<successesAvailable
//     if (successesAvailable < sampled) {
//         // The set of successes is smaller
//         smallerSet = successesAvailable;
//         largerSet = sampled
//     } else {
//         // The set of sampled items is smaller
//         smallerSet = sampled;
//         largerSet = successesAvailable;
//     }
//
//     // This is an intermediate value I don't really understand, which is used in
//     // the middle of the cumulative CDF calculation.
//     var h=1;
//
//     // This is the probability of having observed everything we looked at so
//     // far. Except sometimes it goes above 1 and we have to fix it?
//     var s=1;
//
//     // This is an index over which item we are at in the smaller set
//     var k=0;
//
//     // This is an index over which item we are at in the intersection
//     var i=0;
//
//     while (i < successesObserved) {
//         // For each item in the intersection
//
//         while (s > 1 && k < smallerSet) {
//             // Sample some items from the smaller set (?)
//
//             // Get the probability of, after already grabbing k items for the
//             // smaller set that weren't in the larger set, grabbing another
//             // item for the smaller set that wasn't in the larger set.
//
//             // Then multiply h and s by this probability
//
//             h = h * (1 - largerSet / (popSize - k));
//             s = s * (1 -largerSet / (popSize - k));
//
//             // Advance to the next item in the smaller set.
//             k = k + 1;
//         }
//
//         // Get the number of things not taken for the intersection, after taking
//         // this thing: (popSize - smallerSet - largerSet + i + 1)
//
//         // Get the number of things in the smaller set not in the intersection,
//         // and multiply by the number of things in the larger set not in the
//         // intersection.
//
//         // As i goes from 0 to successesObserved, h accumulates:
//         // factors of smallerSet to smallerSet - successesObserved on top
//         // factors of largerSet to largerSet - successesObserved on top
//         // factors of 1 to successesObserved on bottom
//         // factors of (popSize - smallerSet - largerSet + 1) to
//         //    (popSize - smallerSet - largerSet + successesObserved)
//
//         // I'm not entirely sure how this works, but it looks like we're
//         // cheating a bit to calculate the sum of ratios of factorials without
//         // needing to re-do lots of the multiplications.
//
//         h = h * (smallerSet - i) * (largerSet - i) / (i + 1) / (popSize - smallerSet - largerSet + i + 1);
//         s = s + h;
//
//         // Move on to the next item in the intersection
//         i = i + 1;
//     }
//
//     while (k < smallerSet) {
//         // For each remaining item in the smaller set (conceptually the sampled
//         // ones) that was not part of the intersection(?)
//
//         // popSize - k is the number of items remaining to be grabbed for the
//         // smaller set.
//
//         // largerSet / (popSize - k) is the probability that the next item
//         // grabbed for the smaller set would be in the larger set.
//
//         // We take 1 - that because we know the next item grabbed for the
//         // smaller set will not have been in the larger set, since it wasn't in
//         // the intersection.
//
//         // Then we multiply the probability of everything we've seen so far by
//         // the probability of having successfully not added some extra thing to
//         // our intersection.
//         s = s * (1 - largerSet / (popSize - k));
//
//         // Move on to grab the next item in the smaller set.
//         k = k + 1;
//     }
//
//     return s;
// }


//
// var json_array = new jsonArray( data )
//
// json_array = json_array.astype({VALUE: 'percentage'})
// json_array = json_array.set_index('id')
// // console.log( json_array.toString() )
//
// console.log( json_array.strFormat.value(0, 'VALUE') )

// import {from_url} from './src/pluggins/fromCsv'

// import {from_gz_url} from './src/plugins/fromCsv'
// const url = "http://elendil.am.freescale.net/cached/m27v/dv51/dv51707.1n/wafermap~hardbin~pra~m27v~dv51707.1n.csv.gz"
//
// from_gz_url(
//   url,
//   (val) => console.log( ' returned', val )
// )

//
// from_url( url, (val) => console.log('callback', val))
