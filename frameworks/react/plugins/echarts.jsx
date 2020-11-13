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

import moment from 'moment'
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
    this.Pareto = this.Pareto.bind(this)


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

  Pareto( props ){
    return Pareto( this.props(props) )
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


/**
 * Returns a Pareto plot component based on the contents of the
 * jsonArray DAtaFrame
 */
export function Pareto( props ){

  const options = props.data.echartsOptions

  // pivot the user data based the unique users per day
  var pivot = props.data.pivot_table(
    props.colx,
    props.coly,
    'unique',
    props.label
    )

  const split_values = props.data.unique(props.coly)

  // format the x axis as a date when specified
  if( (props.dates === true) | (props.colx === 'date') ){

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    pivot = pivot.apply('row', (value) => moment(value), 'datetime' )

    // extract a list of unique day
    const dates = pivot.unique('row')
    const datetimes = pivot.unique('datetime')

    // calculate the number of days between the minimum and maximum date
    const t = new Date(Math.min.apply(null,datetimes))
    const start_date = moment(formatDate(t))

    // calculate the number of days within the window
    const timeframe = (pivot.max('datetime') - pivot.min('datetime') )/(60*60*24*1000)

    // add dates not in the pivot table
    for( var i=0; i < timeframe; i++ ){
      const date = moment(start_date).add(i, 'days').format('YYYY-MM-DD')
      if( !dates.includes(date) ) pivot.push({row: date})
    }
  }

  // sort the usage by date to ensure proper ordering
  pivot = pivot.sort_values('row')


  return(
    <Bar
      {...props}
      data = {pivot}
      colx = 'row'
      coly = {split_values}
      stacked = {true}
      />
  )
}
