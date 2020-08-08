/**
 * Cells
 * =================
 * Routines for generating different Cell formats
 *
 * :Author: Nik Sumikawa
 * :Date: Jan 13, 2020
 */



import React from 'react';

// import { Button } from "reactstrap";
import {Table, Button, Icon, Checkbox } from 'semantic-ui-react'
import {data_type, format_float} from 'components/Data/DataType'
import {shadeHexColor} from 'components/Plot/Utils/Colors'

/**
 * fills the Table cell with a button that will execute an onClick function when provided.
 * The onClick will always have two parameters (x/y) so the function can determien how to
 * process the results
 * @constructor
 */
export function CellButton(props){

  const style = cellStyle(props)

  const icon = CellIcon( props )
  if( icon !== undefined ){
    return (
      <Table.Cell
        style={style}
        >
        <Button
          color={CellColor( props.color, props.col_name, 'red' )}
          circular
          size="mini"
          key={'cell-' + props.row + ':' + props.col}
          onClick={props.onClick}
          icon = {icon}
          />
      </Table.Cell>
    )
  }

  return (
    <Table.Cell
      style={style}>

      <Button
        color={CellColor( props.color, props.col_name, 'red' )}
        key={'cell-' + props.row + ':' + props.col}
        onClick={props.onClick}
        >
        {props.value}
      </Button>
    </Table.Cell>
  )

}

/**
 * Creates a green or red circle based on the value of the cell
 * @constructor
 */
function CellBooleanCircle(props){

  const style = cellStyle(props)

  var color = "white"
  switch( props.value ){
    case true :
      color='red'
      break

    case false :
      color='green'
      break

    case 0 :
      color='green'
      break

    case 1 :
      color='red'
      break

    case -1 :
      color = '#B0B0B0'
      break

    case -2 :
      color = 'black'
      break

    default :
      color = 'white'
      break
  }



  return (

   <Table.Cell
      onClick={props.onClick}
      style={style}>

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
          stroke="black"
          strokeWidth="1"
          fill={color}
          onClick={props.onClick}
          />

       </svg>
   </Table.Cell>
 )


}




/**
 * Creates a green or red circle based on the value of the cell
 * @constructor
 */
function CellColoredSquare(props){

  const style = cellStyle(props)

  var colorHex = '#B0B0B0'
  if( props.value !== null ) colorHex = props.value


  const rgbFill = shadeHexColor( colorHex, 0.2)
  const rgbEdge = shadeHexColor( colorHex, -0.5)

  return <Table.Cell

            onClick={props.onClick}
            style={style}>

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
                stroke={rgbEdge}
                strokeWidth="1"
                fill={rgbFill}
                />



             </svg>
         </Table.Cell>


}


/**
 * fills the Table cell with a checkbox that will execute an onClick function when provided.
 * The onClick will always have two parameters (x/y) so the function can determien how to
 * process the results
 * @constructor
 */
function CellCheckbox(props){

  const style = cellStyle(props)

  return (
    <Table.Cell
      negative={(props.row === props.selectedRow) ? true : false}
      style={style}>
      <Checkbox
        toggle
        onClick={props.onClick}
        checked={!!props.table.data[props.row][props.col_name]}
      />

    </Table.Cell>
  );

  // return (
  //   <td style={style}>
  //     <div className='form-check'>
  //       <label className='form-check-label'>
  //         <input  className="form-check-input"
  //                 type="checkbox"
  //                 onClick={props.onClick}
  //                 checked={!!props.table.data[props.row][props.col_name]}
  //                 ></input>
  //         <span className='form-check-sign'></span>
  //       </label>
  //     </div>
  //   </td>
  // );

}


function CellText(props){


  // format float values to remove excessive percision
  var value = props.value
  if( data_type(value) === 'float') value = format_float( value )

  var style = cellStyle(props)
  // { textAlign: 'center',
  //               // backgroundColor: CellColor( props.color, props.col_name )
  //             }


  return (<Table.Cell
            style={style}
            onClick={props.onClick}
            >
            {value}
          </Table.Cell>);

}


// returns the cell style
function cellStyle( props ){

  var style = {}

  // use the style in the table object when provided
  if( props.table.style !== undefined ){
    style = Object.assign(style, props.table.style)
  }

  // as a default center align text
  style['textAlign'] = 'center'

  if( props.row === props.selectedRow ){
    style['backgroundColor'] = '#e7eef1'
  }


  // the background color can be provided as a field of table object.
  // The background color parameter requires a json array with the
  // same fields as the data table. What would normally contain the
  // data now contains colors
  if( props.table.backgroundColor !== undefined ){
    var color = props.table.backgroundColor[props.row][props.col_name]
    if( color !== undefined ){
      style['backgroundColor'] = color
    }
  }

  return style
}


// returns the icon to based on what's stored in the tqble parameters
function CellIcon( props ){

  if( props.table.icon === undefined ) return undefined

  if( props.table.icon[props.col_name] !== undefined ){
    return props.table.icon[props.col_name]
  }

  return undefined
}

// return the color for the specified cell. return the default when
// no color exists
function CellColor( colors, col_name, default_color='white' ){

  if( colors === undefined ){
    return default_color
  }

  //return default when the key does not exist
  if (!colors.hasOwnProperty(col_name)){
    return default_color
  }

  var color = colors[col_name]

  return color
}




export function Cell(props) {
  // populute each cell based on the specified column type. When no
  // column type is provided, default to text format

  //Default the column to what is passed in. Otherwise pull the column name from the data structure
  var col_name = props.col_name
  if( col_name === undefined ){
    col_name = props.table.columns[props.col]
  }

  //select the type of column to create. default to creating a text column
  var col_type = props.col_type
  if( props.table.col_type !== undefined ){

    // extract the column type when provided
    const temp = props.table.col_type[col_name]
    if( temp !== undefined  ){
      if( temp.toLowerCase() === 'button' ){ col_type = 'button' }
      if( temp.toLowerCase() === 'checkbox' ){ col_type = 'checkbox' }
      if( temp.toLowerCase() === 'boolean' ){ col_type = 'boolean' }
      if( temp.toLowerCase() === 'color' ){ col_type = 'color' }
      if( temp.toLowerCase() === 'function' ){ col_type = 'function' }
    }
  }


  //set the value of the button to an icon if it exists, otherwise show the value in the table
  var value = null
  if( props.table.data[props.row][col_name] !== undefined ){
    value = props.table.data[props.row][col_name]
  }


  //add the onclick fundtion. Default to do nothing when the function does not exist
  const onClick = () => cellOnClick( props, col_name, value )

  // //add the onclick fundtion. Default to do nothing when the function does not exist
  // var onClick = null
  // if( props.table.onClick !== undefined ){
  //   if( props.table.onClick[col_name] !== undefined ){
  //     // default onClick function and parameters
  //     onClick = () => props.table.onClick[col_name](props.row, props.col, value)
  //
  //     // when version 2 is enabled, return the data as an object
  //     if( props.version === 2 ){
  //       onClick = () => props.table.onClick[col_name]({
  //         row: props.row,
  //         col: props.col,
  //         value: value,
  //         row_data: props.table.data[props.row]
  //         })
  //     }
  //   }
  // }


  switch( col_type ){

    case 'button':
      return (
        <CellButton
          selectedRow={props.selectedRow}
          value={value}
          col_name={col_name}
          onClick={onClick}
          table={props.table}
          row={props.row}
          col={props.col}
          color={props.color}
          key={'cell-' + props.row + '-' + props.col}
          />
        )

      case 'checkbox':
        return (
          <CellCheckbox
            selectedRow={props.selectedRow}
            value={value}
            col_name={col_name}
            onClick={onClick}
            table={props.table}
            row={props.row}
            col={props.col}
            color={props.color}
            key={'cell-' + props.row + '-' + props.col}
            />
          )

      case 'boolean':
        return (
          <CellBooleanCircle
            selectedRow={props.selectedRow}
            value={value}
            col_name={col_name}
            onClick={onClick}
            table={props.table}
            row={props.row}
            col={props.col}
            color={props.color}
            key={'cell-' + props.row + '-' + props.col}
            />
          )

    case 'color':
      return (
        <CellColoredSquare
          selectedRow={props.selectedRow}
          value={value}
          col_name={col_name}
          onClick={onClick}
          table={props.table}
          row={props.row}
          col={props.col}
          color={props.color}
          key={'cell-' + props.row + '-' + props.col}
          />
        )

    case 'function':
      return props.table.function[col_name](props)

    case 'text':
      return (
        <CellText
          selectedRow={props.selectedRow}
          value={value}
          col_name={col_name}
          onClick={onClick}
          table={props.table}
          row={props.row}
          col={props.col}
          color={props.color}
          key={'cell-' + props.row + '-' + props.col}
          />
        )

    default:
      return (
        <CellText
          selectedRow={props.selectedRow}
          value={value}
          col_name={col_name}
          onClick={onClick}
          table={props.table}
          row={props.row}
          col={props.col}
          color={props.color}
          key={'cell-' + props.row + '-' + props.col}
          />
        )



  }


}



function cellOnClick( props, col_name, value ){
  // wrapper function that's executed when a cell is selected. The
  // purpose is to track the selected row and highlight it for user feedback


    // only update the selected row when selectable is enabled
  if( (props.selectable === true)&(props.setSelectedRow !== undefined) ){
    props.setSelectedRow( props.row )
  }

  //Default the column to what is passed in. Otherwise pull the column name from the data structure
  var col_name = props.col_name
  if( col_name === undefined ){
    col_name = props.table.columns[props.col]
  }

  // return when an onClick function is not provided
  if( props.table.onClick === undefined ) return null
  if( props.table.onClick[col_name] === undefined ) return null

  // when version 2 is enabled, return the data as an object
  if( props.version === 2 ){
    props.table.onClick[col_name]({
      row: props.row,
      col: props.col,
      value: value,
      row_data: props.table.data[props.row]
      })

    return
  }


  // default onClick function and parameters
  props.table.onClick[col_name](props.row, props.col, value)
  // return onClick

}
