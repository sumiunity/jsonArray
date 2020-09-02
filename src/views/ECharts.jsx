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


import React, {useState} from "react";

import {Grid} from 'semantic-ui-react'

import jsonArray from 'jsonArray/jsonArray'
import {data as test_data} from '../data'

import {data} from 'jsonArray/tests/data'

import { Dropdown } from 'semantic-ui-react'


export default function EChartsComponentTest( props ){

  // <ParentNod />
  const [colx, setColx] = useState()
  const [coly, setColy] = useState()
  const [openX, setOpenX] = useState(false)

  var json_array = new jsonArray( test_data )
  json_array = json_array.filter( row =>
    (row['Shipment after ApproveDate'] > 100000) |
    (row['Total CQC Incident Count'] > 0) )


  var cqc = json_array.col('Total CQC Incident Count')
  var vol = json_array.col('Shipment after ApproveDate')
  var ppm = cqc.divide(vol)
  ppm = ppm.multiply(1e6)
  ppm.name = 'ppm'
  json_array = json_array.set_col( ppm )

  console.log( json_array )



  if( colx === undefined ) setColx( json_array.columns[0] )
  if( coly === undefined ) setColy( json_array.columns[0] )

  if( (colx === undefined)|(coly === undefined) ) return null
  // console.log( test_json )
  // var json_array = new jsonArray( data )
  console.log( 'open state', openX )

  // json_array = json_array.filter( row => row['Preflight Risk'] === 'Dark Green' )

  return (
    <Grid style={{padding:'30px'}}>
      <h2>E-Charts</h2>
      <Grid.Row>
        <Grid.Column width={12}>
          <json_array.react.echarts.Scatter
            coly={'ppm'}
            colx={'Preflight Risk'}
            />
        </Grid.Column>

        <Grid.Column width={4}>

          <json_array.react.semanticUI.Dropdown
            selectOnNavigation = {true}
            fluid
            selection
            open = {openX}
            onChange = {(value, e) => setColx(e.value)}
            onClick = {() => setOpenX( !openX)}
            onMouseDown = {() => setOpenX( !openX)}
            value = {colx}
            tabIndex = {colx}
            text = {colx}
            plottype={'column'}
            scrolling={true}
            />

        </Grid.Column>

      </Grid.Row>


      <Grid.Row>
        <Grid.Column width={12}>

            <json_array.react.echarts.Histogram
              colx={'ppm'}
              />
        </Grid.Column>
      </Grid.Row>


    </Grid>
  )


}
