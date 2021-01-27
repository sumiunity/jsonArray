/**
 * Cells
 * =================
 * Routines for generating different Cell formats
 *
 * :Author: Nik Sumikawa
 * :Date: Jan 13, 2020
 */


/**
 * returns the onClick function when specified. Defaults to undefined
 * @param  {object} json_table  jsonTable object
 * @param  {string} col         column name
 * @param  {integer} row        row number
 * @return {function}           onClick function
 */
export default function onClickFunc( props ){

  var onClick

  // select the onClick function when provided globally
  if( props.onClick !== undefined ){
    onClick = () => props.onClick({
      row: props.row_idx,
      col: props.col,
      value: props.value,
      row_data: props.row
      })
  }

  // extract the onClick function for the specific cell
  if( props.cellOnClick !== undefined ){

    // add the onClick function when one exists for the column
    const onClickColumns = Object.keys(props.cellOnClick)
    if( onClickColumns.includes(props.col) ){
      onClick = () => props.cellOnClick[props.col]({
        row: props.row_idx,
        col: props.col,
        value: props.value,
        row_data: props.row
        })
    }
  }

  return onClick
}
