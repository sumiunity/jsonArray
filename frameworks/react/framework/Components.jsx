/**
 * Components
 * ==============
 *
 * standard html components are wrapped in order to provide
 * the ability to leverage an existing framework when specified.
 * Defaults to using the standard html components
 *
 * @author: Nik Sumikawa
 * @date: Aug 25, 2020
 */


import React from "react";


export function Button(props){
  return wrapper( props, props.defaultValue, 'button' )
}

export function Input(props){
  return wrapper( props, props.defaultValue, 'input' )
}

export function Image(props){
  return wrapper( props, props.defaultValue, 'img' )
}

export function Table(props){
  return wrapper( props, props.defaultValue, 'table' )
}

export function Cell(props){
  return wrapper( props, props.defaultValue, 'td' )
}

export function Header(props){
  return wrapper( props, props.defaultValue, 'thead' )
}

export function HeaderCell(props){
  return wrapper( props, props.defaultValue, 'th' )
}

export function Row(props){
  return wrapper( props, props.defaultValue, 'tr' )
}

export function Body(props){
  return wrapper( props, props.defaultValue, 'body' )
}


function wrapper( props, value, type ){

  if( props.Component === undefined ){
    switch( type ){
      case 'button':
        return <button {...props}>{value}</button>

      case 'input':
        return <input {...props}>{value}</input>

      case 'img':
        return <img src={value}{...props} />

      case 'table':
        return <table {...props}>{value}</table>

      case 'td':
        return <td {...props}>{value}</td>

      case 'tr':
        return <tr {...props}>{value}</tr>

      case 'th':
        return <th {...props}>{value}</th>

      case 'thead':
        return <thead {...props}>{value}</thead>


      default:
        return <div {...props}>{value}</div>


    }
  }


  return <props.Component {...props}>{value}</props.Component>
}
