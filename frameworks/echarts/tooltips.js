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

    columns = columns.concat(['__index__'])
    this.formatter = (props) => {
      // the dataframe index was pushed into the plot data in addition to the
      // data used for plotting. This was used to locate the part by index
      // number after splitting it for visualization purposes
      const index = props.data[2]
      if( index === undefined ) return ''

      var sample = json_array.filter(r => r.__index__ === index)
      if( sample.length === 0) return ''

      // select the only sample that should reside at the index
      sample = sample[0]

      // format a string based on the DataFrame contents
      var string = ''
      for (var i=0; i < columns.length; i++ ){
         // [key, value] of Object.entries(json_array[index])) {
        const col = columns[i]
        string = string + `<b>${col}</b>: ${sample[col]}<br/>`;
      }

      return string

    }


  }
}
