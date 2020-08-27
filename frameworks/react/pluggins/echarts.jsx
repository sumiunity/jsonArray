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

import jsonArray from '../../../jsonArray'

var json_array


// Sets the global json array value with the provided data. Checks
// to ensure that the data is the proper type and converts it if
// it is not
export function set( array ){

  json_array = array
  // ensure that the value is jsonArray
  if( !(array instanceof jsonArray) ){
    json_array = new jsonArray( array );
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

export default class EchartsReact extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

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

  const options = json_array.echartsOptions

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

  const options = json_array.echartsOptions

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

  const options = json_array.echartsOptions

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

  const options = json_array.echartsOptions

  return(
    <EchartsReact
      {...props}
      option = {options.bar(props)}
      />
  )
}
