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

console.log( 'boom working' )

//
// import {discrete_probability_by_group} from './src/algorithms/discrete'
//
// import chamber from './chamber.json'
//
// const failing = ['TZ27014_10', 'TZ27014_12', 'TZ27014_16', 'TZ27014_20', 'TZ27014_24']
//
// var json_array = new jsonArray(chamber)
//
//
// json_array = json_array.apply(
//   'WAFER_ID',
//   r => failing.includes(r),
//   'label'
// )
//
//
// const results = discrete_probability_by_group(
//   json_array,
//   'STAGE',
//   'PRE_EQP_CH_SEQ',
//   'label'
// )
//
// console.log( results.sort_values('pmf', true) )


//
import {anova_by_group} from './src/algorithms/anova'

import classprobe from './classprobe.json'

const failing = ['TZ27014_10', 'TZ27014_12', 'TZ27014_16', 'TZ27014_20', 'TZ27014_24']

var json_array = new jsonArray(classprobe)
// json_array = json_array.filter(r => r.NUM === 150666)

json_array = json_array.apply(
  'WAFER_ID',
  r => failing.includes(r),
  'label'
)


const results = anova_by_group(
  json_array,
  'NUM',
  'MEAN',
  'label'
)

console.log( results.sort_values('p', true) )

// const {performance} = require('perf_hooks');
//
//
// import {anova_by_group} from './src/algorithms/anova'
//
// import bin from './bin.json'
//
// const failing = ['TZ27014_10', 'TZ27014_12', 'TZ27014_16', 'TZ27014_20', 'TZ27014_24']
//
//
// var json_array = new jsonArray(bin, true )
//
//
// // console.log( json_array.unique(['PROGRAM']))
// json_array = json_array.filter(r => r.WP_LOTID === 'DV56367.1T')
// //
// json_array = json_array.create_column(
//   'ratio',
//   (val) => val.CNT/val.NUM_DIES_IN_SUMM
// )
//
//
// // console.log( json_array)
//
// var pivot = json_array.pivot_table( 'WAFER_ID', 'BIN', 'mean', 'ratio' )
//
//
// pivot = pivot.fillna(0)
//
// var flat = pivot.flatten('row')
// flat = flat.rename({column:'BIN', value: 'yield', row: 'WAFER_ID'})
//
// var start = performance.now();
// console.log( 'start')
//
// var program = json_array.select_columns(['WAFER_ID','PROGRAM'])
// program = program.drop_duplicates()
//
// flat = flat.merge( program, {
//     how: 'left',
//     on_left: 'WAFER_ID',
//     on_right: 'WAFER_ID'
//   })
//
// console.log( flat)
// console.log( 'end', performance.now() - start)
//
// const results = anova_by_group(
//   json_array,
//   'BIN',
//   'ratio',
//   'PROGRAM'
// )

// console.log( results.sort_values('p', true) )


// // json_array = json_array.filter(r => r.NUM === 150666)
//
// json_array = json_array.apply(
//   'WAFER_ID',
//   r => failing.includes(r),
//   'label'
// )
//
//
// const results = anova_by_group(
//   json_array,
//   'NUM',
//   'MEAN',
//   'label'
// )
//
// console.log( results.sort_values('p', true) )





// import {anovafscore, anovaftest} from 'jStat'
// const class1 = [29893.42571428572, 28842.188000000002, 28209.585555555554, 28170.25222222222, 27818.469999999998, 29065.461428571427, 28121.42222222222, 30076.062857142857]
// const class2 = [27186.987142857142, 25885.821999999996, 25443.951999999997, 26926.145555555555, 26519.866, 25658.94444444444, 26052.871999999996, 26331.137777777778, 25786.82, 27011.742, 25908.294444444444, 26738.00857142857, 26227.302857142855, 27087.257142857143, 25664.514000000003, 24954.565555555557, 26295.29888888889, 26364.654000000002, 25538.392222222225, 26244.327999999998, 25337.264000000003, 25916.758888888886, 26844.732, 25874.786, 27498.177142857145]
// const fscore = anovafscore(...[class1, class2])
// const pscore = anovaftest(...[class1, class2])
// console.log( fscore, pscore)
