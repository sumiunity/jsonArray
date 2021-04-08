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

import moment from 'moment'
import ReactLibraryFramework from '../../ReactLibraryFramework'

import EchartsReact from './EchartsReact'
// export {default as EchartsReact} from './EchartsReact'


export default class echartsLibrary extends ReactLibraryFramework{
  constructor(data){
    super(data)

    // must bind this to all internal functions or they will be
    // lost when rendering via react
    this.Echarts = this.Echarts.bind(this)
    this.Heatmap = this.Heatmap.bind(this)
    this.Boxplot = this.Boxplot.bind(this)
    this.Scatter = this.Scatter.bind(this)
    this.Line = this.Line.bind(this)
    this.Bar = this.Bar.bind(this)
    this.Histogram = this.Histogram.bind(this)
    this.Pareto = this.Pareto.bind(this)
    this.RectGrid = this.RectGrid.bind(this)

  }

  Echarts( props ){
    return EchartsReact( this.props(props) )
  }

  Heatmap( props ){
    return this.Component( 'heatmap', this.props(props) )
  }

  Boxplot( props ){
    return this.Component( 'boxplot', this.props(props) )
  }

  RectGrid( props ){
    return this.Component( 'rectGrid', this.props(props) )
  }

  Scatter( props ){
    return this.Component( 'scatter', this.props(props) )
  }

  Line( props ){
    return this.Component( 'line', this.props(props) )
  }

  Bar( props ){
    return this.Component( 'bar', this.props(props) )
  }

  Histogram( props ){
    return this.Component( 'histogram', this.props(props) )
  }

  Pareto( props ){
    return Pareto( this.props(props) )
  }

  Component( type, props ){

    const options = props.data.echartsOptions

    var plot_options
    switch( type ){
      case 'boxplot':
        plot_options = options.boxplot(props)
        break

      case 'scatter':
        plot_options = options.scatter(props)
        break

      case 'heatmap':
        plot_options = options.heatmap(props)
        break

      case 'line':
        plot_options = options.line(props)
        break

      case 'bar':
        plot_options = options.bar(props)
        break

      case 'rectGrid':
        plot_options = options.rectGrid(props)
        break


      case 'histogram':
        const series = props.data.col( props.colx )
        const hist = series.binning({bins: 30})
        const opt = hist.echartsOptions
        plot_options = opt.bar({colx: 'value', coly: 'count'})
        break

      default:
        alert(`unknown plot type: ${type}`)
        break
    }
    return(
      <EchartsReact
        {...props}
        option = {plot_options}
        />
    )
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






/**
 * Returns a Pareto plot component based on the contents of the
 * jsonArray DAtaFrame
 */
export function Pareto( props ){

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

  var _props = {
    ...props,
    ...{
      data: pivot,
      colx: 'row',
      coly: split_values,
      stacked: true,
    }
  }


  const options = props.data.echartsOptions

  return(
    <EchartsReact
      {..._props}
      option = {options.bar(_props)}
      />
  )
  // return(
  //   <Bar
  //     {...props}
  //     data = {pivot}
  //     colx = 'row'
  //     coly = {split_values}
  //     stacked = {true}
  //     />
  // )
}
