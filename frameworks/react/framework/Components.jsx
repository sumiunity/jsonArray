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
  return wrapper( props, 'button' )
}

export function Input(props){
  return wrapper( props, 'input' )
}

export function Image(props){
  return wrapper( props, 'img' )
}

export function Table(props){
  return wrapper( props, 'table' )
}

export function Cell(props){
  return wrapper( props, 'td' )
}

export function Header(props){
  return wrapper( props, 'thead' )
}

export function HeaderCell(props){
  return wrapper( props, 'th' )
}

export function Row(props){
  return wrapper( props, 'tr' )
}

export function Body(props){
  return wrapper( props, 'body' )
}


function wrapper( props, type ){

  if( props.component === undefined ){
    switch( type ){
      case 'button':
        return <button {...props}>{props.defaultValue}</button>

      case 'input':
        return <input {...props}>{props.defaultValue}</input>

      case 'img':
        return <img
          src={props.defaultValue}
          alt=''
          {...props} />

      case 'table':
        return <table {...props}>{props.defaultValue}</table>

      case 'td':
        return <td {...props}>{props.defaultValue}</td>

      case 'tr':
        return <tr {...props}>{props.defaultValue}</tr>

      case 'th':
        return <th {...props}>{props.defaultValue}</th>

      case 'body':
        return <tbody {...props}>{props.defaultValue}</tbody>

      case 'thead':
        return <thead {...props}>{props.defaultValue}</thead>


      default:
        console.log( 'default type', type)
        return <div {...props}>{props.defaultValue}</div>


    }
  }

  return(
    <props.component
      {...props}
      component={undefined}
      >
      {props.defaultValue}
    </props.component>
  )
}
