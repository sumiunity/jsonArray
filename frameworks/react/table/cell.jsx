/**
 * Cells
 * =================
 * Routines for generating different Cell formats
 *
 * :Author: Nik Sumikawa
 * :Date: Jan 13, 2020
 */



import React from 'react';


import {booleanColor, fillAndEdge} from '../../colors/Colors'
import {Cell as TableCell, Button, Image} from '../framework/Components'

import valueToString from '../../../data_types/format/valueToString'



export default function Cell( props ) {
  // populute each cell based on the specified column type. When no
  // column type is provided, default to text format


  const format = new valueToString()

  //add the onclick fundtion. Default to do nothing when the function does not exist
  var cellOnClick = onClickFunc( props )
  var componentOnClick = onClickFunc( props )

  var value = props.value
  var cellContent

  switch( props.dtype ){

    case 'button':
      cellOnClick = null

      cellContent = (
        <Button
          {...props.buttonProps}
          style={{...{textAlign:'center'}, ...props.buttonStyle}}
          component={props.button}
          key={`${props.tableName}-button-${props.col}-${props.row_idx}`}
          defaultValue={value}
          onClick={componentOnClick}
          />
      )
      break;

    case 'image':
      cellOnClick = null
      cellContent = (
        <Image
          {...props.imageProps}
          style={{...{textAlign:'center'}, ...props.imageStyle}}
          component={props.image}
          key={`${props.tableName}-image-${props.col}-${props.row_idx}`}
          defaultValue={value}
          onClick={componentOnClick}
          />
      )
      break;
    //
    //   case 'checkbox':
    //     return (
    //       <CellCheckbox
    //         selectedRow={props.selectedRow}
    //         value={value}
    //         col_name={col_name}
    //         onClick={onClick}
    //         table={props.table}
    //         row={props.row}
    //         col={props.col}
    //         color={props.color}
    //         key={'cell-' + props.row + '-' + props.col}
    //         />
    //       )

    // case 'function':
    //   return props.table.function[col_name](props)

    case 'boolean':
      cellOnClick = null
      cellContent = booleanCircle(value, componentOnClick)
      break

    case 'square':
      cellOnClick = null
      cellContent = coloredSquare(value, componentOnClick)
      break

    case 'hexcolor':
      cellOnClick = null
      cellContent = coloredSquare(value, componentOnClick)
      break

    case 'text':
      cellContent = value
      break

    case 'float':
      cellContent = format.toString(value, props.dtype)
      break

    case 'percentage':
      cellContent = format.toString(value, props.dtype)
      break

    default:
      cellContent = value



  }

  return (
    <TableCell
      {...props.tdProps}
      style={{...{textAlign:'center'}, ...props.tdStyle}}
      component={props.td}
      key = {`${props.tableName}-cell-${props.col}-${props.row_idx}`}
      onClick={cellOnClick}
      defaultValue= {cellContent}
      />
  )

}







/**
 * returns the onClick function when specified. Defaults to undefined
 * @param  {object} json_table  jsonTable object
 * @param  {string} col         column name
 * @param  {integer} row        row number
 * @return {function}           onClick function
 */
function onClickFunc( props ){

  var onClick

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




// formats a float by removing resolution to 4 decimal points or
// converting it to scientific notation
function format_float( data ){

  if( data/0.0001 > 0 ) return data.toFixed(4)

  return data.toExponential(2)
}

/**
 * Creates a green or red circle based on the value of the cell
 * @constructor
 */
function booleanCircle(value, onClick){

  var colors = booleanColor( value )

  return (

      <svg preserveAspectRatio="xMinYMin meet"
           viewBox="0, 0, 20, 20"
           transform="scale(1, -1)"
           style={{display: "inline-block",
                   width: "25px",
                   overflow: "visible",
           }}>

        <circle
          cx="10"
          cy="10"
          r="10"
          stroke={colors.edge}
          strokeWidth="1"
          fill={colors.fill}
          onClick={onClick}
          />

       </svg>
 )


}




/**
 * Returns a svg object containing a colored square
 * @param       {string} colorHex string containing the hex color value
 * @constructor
 */
function coloredSquare( colorHex ){

  if( colorHex === undefined ) colorHex = '#B0B0B0'

  const colors = fillAndEdge(colorHex)

  return(
    <svg preserveAspectRatio="xMinYMin meet"
      viewBox="0, 0, 40, 20"
      transform="scale(1, -1)"
      style={{
        display: "inline-block",
        width: "40px",
        overflow: "visible",
      }}>

      <rect
        x="0"
        y="0"
        width="40"
        height="20"
        stroke={colors.edge}
        strokeWidth="1"
        fill={colors.fill}
        />

    </svg>
  )


}


// function text(props){
//
//
//   // format float values to remove excessive percision
//   var value = props.value
//   if( data_type(value) === 'float') value = format_float( value )
//
//   var style = cellStyle(props)
//   // { textAlign: 'center',
//   //               // backgroundColor: CellColor( props.color, props.col_name )
//   //             }
//
//
//   return (<Table.Cell
//             style={style}
//             onClick={props.onClick}
//             >
//             {value}
//           </Table.Cell>);
//
// }

//
//
// /**
//  * fills the Table cell with a checkbox that will execute an onClick function when provided.
//  * The onClick will always have two parameters (x/y) so the function can determien how to
//  * process the results
//  * @constructor
//  */
// function CellCheckbox(props){
//
//   const style = cellStyle(props)
//
//   return (
//     <Table.Cell
//       negative={(props.row === props.selectedRow) ? true : false}
//       style={style}>
//       <Checkbox
//         toggle
//         onClick={props.onClick}
//         checked={!!props.table.data[props.row][props.col_name]}
//       />
//
//     </Table.Cell>
//   );
//
//   // return (
//   //   <td style={style}>
//   //     <div className='form-check'>
//   //       <label className='form-check-label'>
//   //         <input  className="form-check-input"
//   //                 type="checkbox"
//   //                 onClick={props.onClick}
//   //                 checked={!!props.table.data[props.row][props.col_name]}
//   //                 ></input>
//   //         <span className='form-check-sign'></span>
//   //       </label>
//   //     </div>
//   //   </td>
//   // );
//
// }
//
//

//
// // returns the cell style
// function cellStyle( props ){
//
//   var style = {}
//
//   // use the style in the table object when provided
//   if( props.table.style !== undefined ){
//     style = Object.assign(style, props.table.style)
//   }
//
//   // as a default center align text
//   style['textAlign'] = 'center'
//
//   if( props.row === props.selectedRow ){
//     style['backgroundColor'] = '#e7eef1'
//   }
//
//
//   // the background color can be provided as a field of table object.
//   // The background color parameter requires a json array with the
//   // same fields as the data table. What would normally contain the
//   // data now contains colors
//   if( props.table.backgroundColor !== undefined ){
//     var color = props.table.backgroundColor[props.row][props.col_name]
//     if( color !== undefined ){
//       style['backgroundColor'] = color
//     }
//   }
//
//   return style
// }
//
//
// // returns the icon to based on what's stored in the tqble parameters
// function CellIcon( props ){
//
//   if( props.table.icon === undefined ) return undefined
//
//   if( props.table.icon[props.col_name] !== undefined ){
//     return props.table.icon[props.col_name]
//   }
//
//   return undefined
// }
//
// // return the color for the specified cell. return the default when
// // no color exists
// function CellColor( colors, col_name, default_color='white' ){
//
//   if( colors === undefined ){
//     return default_color
//   }
//
//   //return default when the key does not exist
//   if (!colors.hasOwnProperty(col_name)){
//     return default_color
//   }
//
//   var color = colors[col_name]
//
//   return color
// }
//
//
//
//
//
//
//
// function cellOnClick( props, col_name, value ){
//   // wrapper function that's executed when a cell is selected. The
//   // purpose is to track the selected row and highlight it for user feedback
//
//
//     // only update the selected row when selectable is enabled
//   if( (props.selectable === true)&(props.setSelectedRow !== undefined) ){
//     props.setSelectedRow( props.row )
//   }
//
//   //Default the column to what is passed in. Otherwise pull the column name from the data structure
//   var col_name = props.col_name
//   if( col_name === undefined ){
//     col_name = props.table.columns[props.col]
//   }
//
//   // return when an onClick function is not provided
//   if( props.table.onClick === undefined ) return null
//   if( props.table.onClick[col_name] === undefined ) return null
//
//   // when version 2 is enabled, return the data as an object
//   if( props.version === 2 ){
//     props.table.onClick[col_name]({
//       row: props.row,
//       col: props.col,
//       value: value,
//       row_data: props.table.data[props.row]
//       })
//
//     return
//   }
//
//
//   // default onClick function and parameters
//   props.table.onClick[col_name](props.row, props.col, value)
//   // return onClick
//
// }
