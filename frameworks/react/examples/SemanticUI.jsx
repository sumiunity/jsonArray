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

import {Grid} from 'semantic-ui-react'

import jsonArray from 'jsonArray/jsonArray'
import {data} from 'jsonArray/tests/data'

export default function SemanticUIComponents( props ){

  var json_array = new jsonArray( data )

  return (
    <Grid>
      <h2>Semantic UI test </h2>
      <Grid.Row>
        <Grid.Column>
          <json_array.react.semanticUI.Dropdown
            column = 'CATEGORY1'
            style={{minWidth:'100px'}}
            placeholder='Dropdown'
            fluid
            selection
            clearable
            onChange={(e, value) => console.log(value.value)}
            />
        </Grid.Column>
      </Grid.Row>

      <Grid.Row>
        <Grid.Column>
          <json_array.react.semanticUI.Excel
            callback = {(value) => console.log(value)}
            />
        </Grid.Column>
      </Grid.Row>


      <Grid.Row>
        <Grid.Column>
            <json_array.react.semanticUI.Table
              tableName = {'array'}
              sortable={true}
              />
        </Grid.Column>
      </Grid.Row>


    </Grid>


  )

}
