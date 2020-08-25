import React from 'react';

import jsonArray from 'jsonArray/jsonArray'
import {data} from 'jsonArray/tests/data'


export default function Table( props ){


  var json_array = new jsonArray( data )

  json_array = json_array.astype({image: 'image'})
  console.log( json_array.dtypes)
  const table = json_array.react.semanticUI.table
  table.parameters.sortable = true
  // console.log( header)
  return (
    <div>
      <h2>What is this??</h2>

      {table.render()}
    </div>
  )

}
