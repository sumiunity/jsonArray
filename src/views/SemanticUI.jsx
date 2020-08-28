/**
 * Semantic UI
 * ================
 *
 * Renders various Semantic UI components that are integrated
 * into the jsonArray framework
 *
 * @author Nik Sumikawa
 * @date Aug 27, 2020
 */

import React from 'react';

import jsonArray from 'jsonArray/jsonArray'
import {data} from 'jsonArray/tests/data'

export default function SemanticUIComponents( props ){

  var json_array = new jsonArray( data )

  return (
    <div>
      <h2>Semantic UI test </h2>

      <json_array.react.semanticUI.Dropdown
        column = 'CATEGORY1'
        style={{minWidth:'100px'}}
        placeholder='Dropdown'
        fluid
        selection
        clearable
        onChange={(e, value) => console.log(value.value)}
        />

    </div>
  )

}
