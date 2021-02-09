/**
 * Cells
 * =================
 * Routines for generating different Cell formats
 *
 * :Author: Nik Sumikawa
 * :Date: Jan 13, 2020
 */



import React from 'react';


import {booleanColor} from '../../../colors/Colors'


/**
 * Creates a green or red circle based on the value of the cell
 * @constructor
 */
export default function booleanCircle(value, onClick, props){

  var colors = booleanColor( value )

  var radius = 20
  if( props.radius !== undefined ) radius = props.radius

  return (

      <svg preserveAspectRatio="xMinYMin meet"
           viewBox={`0, 0, ${radius}, ${radius}`}
           transform="scale(1, -1)"
           style={{display: "inline-block",
                   width: `${radius+4}px`,
                   overflow: "visible",
           }}>

        <circle
          cx={`${radius/2 - 2}`}
          cy={`${radius/2 - 2}`}
          r={`${radius/2}`}
          stroke={colors.edge}
          strokeWidth="1"
          fill={colors.fill}
          onClick={onClick}
          />

       </svg>
 )


}
