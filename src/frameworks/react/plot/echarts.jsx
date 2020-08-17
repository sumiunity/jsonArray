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


import React, {useState} from 'react';
import ReactEcharts from "echarts-for-react";

const debug = false



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
