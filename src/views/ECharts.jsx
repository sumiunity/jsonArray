/**
 * Echarts
 * ===================
 *
 * View demonstrating the various Echarts plotting routines
 *
 * @author Nik Sumikawa
 * @date Aug 27, 2020
 *
 */


import React from "react";

import {Grid} from 'semantic-ui-react'

import jsonArray from 'jsonArray/jsonArray'
import {data} from 'jsonArray/tests/data'

import {set} from 'jsonArray/frameworks/react/pluggins/echarts'
const test = require('jsonArray/frameworks/react/pluggins/echarts')

export default function EChartsComponentTest( props ){

  // <ParentNod />

  var json_array = new jsonArray( data )

  console.log( 'echarts', json_array.react.echarts )
  return (
    <Grid>
      <h2>E-Charts</h2>
      <Grid.Row>
        <Grid.Column>
          <json_array.react.echarts.Scatter
            colx='COUNT'
            coly='id'
            />
        </Grid.Column>
      </Grid.Row>

      <Grid.Row>
        <Grid.Column>
          <json_array.react.echarts.Bar
            colx='id'
            coly='COUNT'
            />
        </Grid.Column>
      </Grid.Row>


      <Grid.Row>
        <Grid.Column>
          <json_array.react.echarts.Boxplot
            colx='CATEGORY1'
            coly='id'
            />
        </Grid.Column>
      </Grid.Row>


      <Grid.Row>
        <Grid.Column>
          <json_array.react.echarts.Heatmap
            colx='__index__'
            coly='COUNT'
            value='id'
            />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )

}
