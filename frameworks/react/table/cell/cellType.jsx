/**
 * Cells
 * =================
 * Routines for generating different Cell formats
 *
 * :Author: Nik Sumikawa
 * :Date: Jan 13, 2020
 */



import React from 'react';

import {Button, Image, Icon, Checkbox} from '../../framework/Components'

import valueToString from '../../../../data_types/format/valueToString'

import booleanCircle from './booleanCircle'
import coloredSquare from './coloredSquare'
import onClickFunc from './onClickFunc'


export default function cellType( props ) {
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

    case 'icon':
      cellOnClick = null
      cellContent = (
        <Icon
          {...props.IconProps}
          key={`${props.tableName}-icon-${props.col}-${props.row_idx}`}
          style={{...{textAlign:'center'}, ...props.iconStyle}}
          component={props.icon}
          name={value}
          onClick={componentOnClick}
          />
      )
      break;

    case 'checkbox':
      cellOnClick = null
      cellContent = (
        <Checkbox
          {...props.CheckboxProps}
          key={`${props.tableName}-checkbox-${props.col}-${props.row_idx}`}
          style={{...{textAlign:'center'}, ...props.checkboxStyle}}
          component={props.checkbox}
          checked={value}
          onClick={componentOnClick}
          />
      )
      break;

    // case 'function':
    //   return props.table.function[col_name](props)

    case 'boolean':
      cellOnClick = null
      cellContent = booleanCircle(value, componentOnClick, props)
      break

    case 'square':
      cellOnClick = null
      cellContent = coloredSquare(value, componentOnClick, props)
      break

    case 'hexcolor':
      cellOnClick = null
      cellContent = coloredSquare(value, componentOnClick, props)
      break

    case 'text':
      cellContent = <p style={{whiteSpace:'pre'}}>{value}</p>
      break

    case 'hyperlink':
      cellContent = <a href={value}>link</a>
      break

    case 'float':
      cellContent = format.toString(value, props.dtype)
      break

    case 'percent':
    case 'percentage':
      cellContent = format.toString(value, props.dtype)
      break

    case 'scientific':
      cellContent = format.toString(value, props.dtype)
      break

    case 'datetime':
      cellContent = format.toString(value, props.dtype)
      break

    case 'table':
      cellContent = value
      break

    default:
      cellContent = <p style={{whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>{value}</p>
  }


  return {
    cellContent: cellContent,
    cellOnClick: cellOnClick
  }

}
