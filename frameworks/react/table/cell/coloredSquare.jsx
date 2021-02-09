/**
 * Cells
 * =================
 * Routines for generating different Cell formats
 *
 * :Author: Nik Sumikawa
 * :Date: Jan 13, 2020
 */



import React from 'react';


import {fillAndEdge} from '../../../colors/Colors'




/**
 * Returns a svg object containing a colored square
 * @param       {string} colorHex string containing the hex color value
 * @constructor
 */
export default function coloredSquare( colorHex, props ){

  if( colorHex === undefined ) colorHex = '#B0B0B0'

  const colors = fillAndEdge(colorHex)

  return(
    <svg preserveAspectRatio="xMinYMin meet"
      viewBox="0, 0, 40, 20"
      transform="scale(1, -1)"
      style={{
        display: "inline-block",
        width: "40px",
        height: '100%',
        overflow: "visible",
      }}>

      <rect
        x="0"
        y="0"
        width="40"
        height="100%"
        stroke={colors.edge}
        strokeWidth="1"
        fill={colors.fill}
        />

    </svg>
  )


}
