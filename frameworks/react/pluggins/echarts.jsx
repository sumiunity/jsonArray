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
    this.Heatmap = this.Heatmap.bind(this)
    this.Boxplot = this.Boxplot.bind(this)
    this.Scatter = this.Scatter.bind(this)
    this.Bar = this.Bar.bind(this)


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
}



export function react_echarts( options, params ){
  return(
    <EchartsReact
      option = {options}
      onClick = {params['onClick']}
    />
  )
}

export class EchartsReact extends React.Component {
    // constructor(props, context) {
    //     super(props, context);
    // }

    /**
     * When mounting the eCharts, check if an onClick function is provided.
     * If so, add the infrustructure to support onClick functions
     */
    componentDidMount() {

      if( this.props.onClick !== undefined ){
        this.echartsInstance = this.echartsReactRef.getEchartsInstance();
        this.echartsInstance.on('click', this.onClickHandler.bind(this));
      }

    }

    // Call the onClick function and pass in the data as a parameter
    onClickHandler(params){
      this.props.onClick( params )
    };

    render() {
        return (
          <ReactEcharts
            {...this.props}
            ref={(e) => { this.echartsReactRef = e; }}
          />

        );
    }
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
