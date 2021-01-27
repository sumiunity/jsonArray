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
export default function booleanCircle(value, onClick){

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
