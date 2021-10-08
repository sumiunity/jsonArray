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
  constructor(data, props={}){
    super(data, props)

    // must bind this to all internal functions or they will be
    // lost when rendering via react
    this.Echarts = this.Echarts.bind(this)
    this.Bar = this.Bar.bind(this)
    this.Boxplot = this.Boxplot.bind(this)
    this.Heatmap = this.Heatmap.bind(this)
    this.Histogram = this.Histogram.bind(this)
    this.Line = this.Line.bind(this)
    this.Pareto = this.Pareto.bind(this)
    this.Pie = this.Pie.bind(this)
    this.RectGrid = this.RectGrid.bind(this)
    this.Scatter = this.Scatter.bind(this)
  }

  Echarts( props ){
    return EchartsReact( this.format_props(props) )
  }


  Bar( props ){
    const __props = this.format_props(props)
    const options = __props.data.echartsOptions.bar(__props)
    return this.Render( __props, options )
  }


  Boxplot( props ){
    const __props = this.format_props(props)
    const options = __props.data.echartsOptions.boxplot(__props)
    return this.Render( __props, options )
  }

  Heatmap( props ){
    const __props = this.format_props(props)
    const options = __props.data.echartsOptions.heatmap(__props)
    return this.Render( __props, options )
  }

  Histogram( props ){
    const __props = this.format_props(__props)
    const series = __props.data.col( __props.colx )
    const hist = series.binning({bins: 30})
    const opt = hist.echartsOptions
    const options = opt.bar({colx: 'value', coly: 'count'})
    return this.Render( __props, options )
  }

  Line( props ){
    const __props = this.format_props(props)
    const options = __props.data.echartsOptions.line(__props)
    return this.Render( __props, options )
  }

  Pareto( props ){
    const __props = this.format_props(props)
    const options = __props.data.echartsOptions.pareto(__props)
    return this.Render( __props, options )
  }

  Pie( props ){
    const __props = this.format_props(props)
    const options = __props.data.echartsOptions.pieFromSeries(__props)
    return this.Render( __props, options )
  }

  RectGrid( props ){
    const __props = this.format_props(props)
    const options = __props.data.echartsOptions.rectGrid(__props)
    return this.Render( __props, options )
  }

  Scatter( props ){
    const __props = this.format_props(props)
    const options = props.data.echartsOptions.scatter(props)
    return this.Render( props, options )
  }




  // Pareto( props ){
  //   const options = props.data.echartsOptions.heatmap(props)
  //   return this.Render( props, options )
  // }

  Render( props, options ){
    return (
      <EchartsReact
        {...props}
        option = {options}
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




//
//
// /**
//  * Returns a Pareto plot component based on the contents of the
//  * jsonArray DAtaFrame
//  */
// export function Pareto( props ){
//
//   // pivot the user data based the unique users per day
//   var pivot = props.data.pivot_table(
//     props.colx,
//     props.coly,
//     'unique',
//     props.label
//     )
//
//   const split_values = props.data.unique(props.coly)
//
//   // format the x axis as a date when specified
//   if( (props.dates === true) | (props.colx === 'date') ){
//
//     function formatDate(date) {
//         var d = new Date(date),
//             month = '' + (d.getMonth() + 1),
//             day = '' + d.getDate(),
//             year = d.getFullYear();
//
//         if (month.length < 2)
//             month = '0' + month;
//         if (day.length < 2)
//             day = '0' + day;
//
//         return [year, month, day].join('-');
//     }
//
//     pivot = pivot.apply('row', (value) => moment(value), 'datetime' )
//
//     // extract a list of unique day
//     const dates = pivot.unique('row')
//     const datetimes = pivot.unique('datetime')
//
//     // calculate the number of days between the minimum and maximum date
//     const t = new Date(Math.min.apply(null,datetimes))
//     const start_date = moment(formatDate(t))
//
//     // calculate the number of days within the window
//     const timeframe = (pivot.max('datetime') - pivot.min('datetime') )/(60*60*24*1000)
//
//     // add dates not in the pivot table
//     for( var i=0; i < timeframe; i++ ){
//       const date = moment(start_date).add(i, 'days').format('YYYY-MM-DD')
//       if( !dates.includes(date) ) pivot.push({row: date})
//     }
//   }
//
//   // sort the usage by date to ensure proper ordering
//   pivot = pivot.sort_values('row')
//
//   var _props = {
//     ...props,
//     ...{
//       data: pivot,
//       colx: 'row',
//       coly: split_values,
//       stacked: true,
//     }
//   }
//
//
//   const options = props.data.echartsOptions
//
//   return(
//     <EchartsReact
//       {..._props}
//       option = {options.bar(_props)}
//       />
//   )
//   // return(
//   //   <Bar
//   //     {...props}
//   //     data = {pivot}
//   //     colx = 'row'
//   //     coly = {split_values}
//   //     stacked = {true}
//   //     />
//   // )
// }
