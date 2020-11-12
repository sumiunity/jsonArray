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

import {FixedDocument} from './CodeDocumentation'
import jsonArray from '../../../jsonArray'
import {data} from '../../../tests/data'

export default function ECharts( props ){

  // <ParentNod />

  var json_array = new jsonArray( data )

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column>

          <FixedDocument
            visible={true}
            title={'Scatter Plot'}
            code={`
              var json_array = new jsonArray( data )

              return (
                <json_array.react.echarts.Scatter
                  colx='COUNT'
                  coly='id'
                  />
              )
              `}
              component={
                <json_array.react.echarts.Scatter
                  colx='COUNT'
                  coly='id'
                  />
              }
            />

        </Grid.Column>
      </Grid.Row>

      <Grid.Row>
        <Grid.Column>

          <FixedDocument
            visible={true}
            title={'Bar Chart'}
            code={`
              var json_array = new jsonArray( data )

              return (
                <json_array.react.echarts.Bar
                  colx='id'
                  coly='COUNT'
                  />
              )
              `}
              component={
                <json_array.react.echarts.Bar
                  colx='id'
                  coly='COUNT'
                  />
              }
            />

        </Grid.Column>
      </Grid.Row>


      <Grid.Row>
        <Grid.Column>

          <FixedDocument
            visible={true}
            title={'Boxplot'}
            code={`
              var json_array = new jsonArray( data )

              return (
                <json_array.react.echarts.Boxplot
                  colx='id'
                  coly='COUNT'
                  />
              )
              `}
              component={
                <json_array.react.echarts.Boxplot
                  colx='CATEGORY1'
                  coly='id'
                  />
              }
            />

        </Grid.Column>
      </Grid.Row>


      <Grid.Row>
        <Grid.Column>
          <FixedDocument
            visible={true}
            title={'Heatmap'}
            code={`
              var json_array = new jsonArray( data )

              return (
                <json_array.react.echarts.Heatmap
                  colx='__index__'
                  coly='COUNT'
                  value='id'
                  />
              )
              `}
              component={
                <json_array.react.echarts.Heatmap
                  colx='__index__'
                  coly='COUNT'
                  value='id'
                  />
              }
            />

        </Grid.Column>
      </Grid.Row>
    </Grid>
  )

}
