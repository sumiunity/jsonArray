
import React from 'react';
import ReactEcharts from "echarts-for-react";

export default function EchartsReact( props ) {

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
      style={props.echartsStyle}
    />
  )
}
