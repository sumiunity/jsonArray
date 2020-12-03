/**
 * Anova
 * =======================
 * Returns the f and p score based on a one-way anova
 * given a labeled dataset
 *
 * @author Nik Sumikawa
 * @date Nov 30, 2020
 */


import {anovafscore, anovaftest} from 'jStat'
import jsonArray from '../jsonArray'

// returns the f and p score from a one-way anova
export function anova( data, att, label ){


  const unique_values = new jsonArray(data).unique([label] )

  const valArray = []
  for( var i=0; i < unique_values.length; i++ ){
    const uniqueVal = unique_values[i]
    valArray.push(
      data.filter(r => r[label] === uniqueVal)
        .map(r => r[att])
    )
  }


  // // split the data by the class label
  // const neg = data.filter(r => r[label] === false).map(r => r[att])
  // const pos = data.filter(r => r[label] === true).map(r => r[att])

  return {
      'f': anovafscore(...valArray),
      'p': anovaftest(...valArray),
  }
}


/**
 * Groups the data based on the group attribute and returns
 * the oneway anova results
 * @param  {jsonArray} data   jsonArray containing the data
 * @param  {string} group_att group attribute name
 * @param  {string} att       subgroup attribute name
 * @param  {string} label     label attribute name
 * @return {jsonArray}        jsonArray containing the results
 */
export function anova_by_group( data, group_att, att, label ){

  var byGroup = data.groupby([group_att])

  var stats = []
  // from scipy.stats import hypergeom
  for( var i=0; i < byGroup.length; i++ ){


    var temp = anova(
      byGroup[i].json_obj,
      att,
      label )

    temp['group'] = byGroup[i][group_att]

    stats.push( temp )

  }

  return new jsonArray(stats)

}

export default anova_by_group
