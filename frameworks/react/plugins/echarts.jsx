/**
 * Echarts Wrapper
 * ==================
 *
 * React component used to wrap the echart's plotter. This includes
 * handles for onClick function and callback functions
 *
 * :Author: Nik Sumikawa
 * :Date: April 20, 2020
 */


import React from 'react';
import ReactEcharts from "echarts-for-react";

import ReactLibraryFramework from '../ReactLibraryFramework'


export default class echartsLibrary extends ReactLibraryFramework{
  constructor(data){
    super(data)

    // must bind this to all internal functions or they will be
    // lost when rendering via react
    this.Echarts = this.Echarts.bind(this)
    this.Heatmap = this.Heatmap.bind(this)
    this.Boxplot = this.Boxplot.bind(this)
    this.Scatter = this.Scatter.bind(this)
    this.Bar = this.Bar.bind(this)
    this.Histogram = this.Histogram.bind(this)


  }

  Echarts( props ){
    return EchartsReact( this.props(props) )
  }

  Heatmap( props ){
    return Heatmap( this.props(props) )
  }

  Boxplot( props ){
    return Boxplot( this.props(props) )
  }

  Scatter( props ){
    return Scatter( this.props(props) )
  }

  Bar( props ){
    return Bar( this.props(props) )
  }

  Histogram( props ){
    return Histogram( this.props(props) )
  }
}



export function react_echarts( options, params ){
  return(
    <EchartsReact
      option = {options}
      onClick = {params['onClick']}
    />
  )
}


export function EchartsReact( props ) {

  // extract the options from the props so it can be modified
  var option = props.option

  var onEvents = {}

  // when selectionCallback is provided, add the brush functionality
  // and callback function to the list of events
  if( props.onSelect !== undefined ){
    option['brush'] = {
      xAxisIndex: 'all',
      outOfBrush: {
        colorAlpha: 0.1
      }
    }

    const onSelect = (params) => {
      if( params.batch === undefined ) return

      const index = params.batch[0].selected[0].dataIndex;
      if( params.batch[0].selected !== undefined ){
        props.onSelect( index )
      }
    }

    onEvents['brushselected'] = onSelect
  }

  // when an onClick event is provided, add it to the Events
  if( props.onClick !== undefined ){
    onEvents['click'] = props.onClick
  }

  return (
    <ReactEcharts
      option = {option}
      onEvents={onEvents}
    />
  )
}



/**
 * Returns a heatmap plotting component based on the contents of the
 * jsonArray DAtaFrame
 */
export function Heatmap( props ){

  const options = props.data.echartsOptions

  return(
    <EchartsReact
      {...props}
      option = {options.heatmap(props)}
      />
  )
}


/**
 * Returns a boxplot component based on the contents of the
 * jsonArray DAtaFrame
 */
export function Boxplot( props ){

  const options = props.data.echartsOptions

  return(
    <EchartsReact
      {...props}
      option = {options.boxplot(props)}
      />
  )
}


/**
 * Returns a scatter plot component based on the contents of the
 * jsonArray DAtaFrame
 */
export function Scatter( props ){

  const options = props.data.echartsOptions

  return(
    <EchartsReact
      {...props}
      option = {options.scatter(props)}
      />
  )
}


/**
 * Returns a bar plot component based on the contents of the
 * jsonArray DAtaFrame
 */
export function Bar( props ){

  const options = props.data.echartsOptions

  return(
    <EchartsReact
      {...props}
      option = {options.bar(props)}
      />
  )
}

/**
 * Returns a bar plot component based on the contents of the
 * jsonArray DAtaFrame
 */
export function Histogram( props ){

  const series = props.data.col( props.colx )
  const hist = series.binning({bins: 30})
  const options = hist.echartsOptions

  // console.log( options.bar({colx: 'value', coly: 'count'}) )
  // return( <div> this will be the histogram</div>)
  return(
    <EchartsReact
      {...props}
      option = {options.bar({colx: 'value', coly: 'count'})}
      />
  )
}
