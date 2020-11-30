/**
 * Discrete Probability
 * =======================
 * Returns the subgroup with the highest statistical
 * significance based on a discrete probability function
 *
 * @author Nik Sumikawa
 * @date Nov 30, 2020
 */


import {pmf} from '../statistics/hypergeometric'
import jsonArray from '../jsonArray'

// greedy discrete probability function that computes the discrete
// probability of the subgroup with the most positive values
export function greedy_discrete_prob( data, att, label ){

    // split the data by the class label
    const neg = new jsonArray(data.filter(r => r[label] === false))
    const pos = new jsonArray(data.filter(r => r[label] === true))

    // select the
    const pareto = pos.count_values([att])
    const tp = pareto.max('count')

    // identify the subgroup with the most positives
    const subgroup = pareto.filter(r => r.count === tp)[0][att]

    // compute the number of false positibves
    const fp = neg.filter(r => r[att] === subgroup ).length

    // compute the probability mass function
    const temp = pmf(
      data.length,
      pos.length,
      fp + tp,
      tp,
    )

  return {
      'tp': tp,
      'fp': fp,
      'subgroup': subgroup,
      'total': data.length,
      'pmf': temp
  }
}


/**
 * Groups the data based on the group attribute and computes
 * the discrete probability for the specified attribute within
 * each group
 * @param  {jsonArray} data   jsonArray containing the data
 * @param  {string} group_att group attribute name
 * @param  {string} att       subgroup attribute name
 * @param  {string} label     label attribute name
 * @return {jsonArray}        jsonArray containing the results
 */
export function discrete_probability_by_group( data, group_att, att, label ){

  var byGroup = data.groupby([group_att])

  var stats = []
  // from scipy.stats import hypergeom
  for( var i=0; i < byGroup.length; i++ ){


    var temp = greedy_discrete_prob(
      byGroup[i].json_obj,
      att,
      label )

    temp['group'] = byGroup[i][group_att]

    stats.push( temp )

  }

  return new jsonArray(stats)

}
