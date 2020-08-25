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



function wrapper( props, value, type ){

  if( props.Component === undefined ){
    switch( type ){
      case 'button':
        return <button {...props}>{value}</button>

      case 'input':
        return <input {...props}>{value}</input>

      default:
        return <div {...props}>{value}</div>


    }
  }


  return <props.Component {...props}>{value}</props.Component>
}
