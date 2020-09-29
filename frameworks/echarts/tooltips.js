/**
 * Echarts Tooltip formatter
 * =========================
 *
 * Attempt to standardize the tooltip format
 * to show data from the top 5 columns or those
 * specified by the user
 *
 * :Author: Nik Sumikawa
 * :Date: Sept 29, 2020
 */

import moment from 'moment'

export default class echartsTooltip extends Object {

  constructor() {
    super()
    // super(...array)

    // as a default, set the tooltip to trigger when
    // hovering over an item
    this.show = true
    this.trigger = 'item'
    // this.showContent = false
  }


  /**
   * Formats the tooltip using data taken from the
   * selected sample. When a list of columns are provided,
   * they are used render the tooltip information
   * @param  {object} json_array   array of json objects
   * @param  {Array}  [columns=[]] array fo column names
   * @return {none}              The tooltip format is stored locally
   */
  from_DataFrame( json_array, columns=[] ){

    if( columns.length === 0 ){
      columns = json_array.columns.splice(1,5)
    }

    this.formatter = (props) => {
      // pull the index number from the selected sample
      const index = props.data[0]

      // format a string based on the DataFrame contents
      var string = ''
      for (var i=0; i < columns.length; i++ ){
         // [key, value] of Object.entries(json_array[index])) {
        const col = columns[i]
        string = string + `<b>${col}</b>: ${json_array[index][col]}<br/>`;
      }

      return string

    }


  }
}
