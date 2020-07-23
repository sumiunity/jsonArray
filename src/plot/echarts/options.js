/**
 * echarts Options
 * =================
 *
 * Converts json arrays into echart option objects. This is
 * intended for customize plots
 *
 * :Author: Nik Sumikawa
 * :Date: July 7, 2020
 */


import {color} from '../Colors'
import jsonArray from '../../jsonArray'
import echartsAxis from './axis'

import { prepareBoxplotData } from 'echarts/extension/dataTool';

const debug = false




export default class echartsOptions extends Object {

  constructor(data) {
    super()


    this.json_array = data

    // cast the variable to a jsonArray type when it is a standard array
    if( (this.json_array instanceof jsonArray) == false ){
      this.json_array  = new jsonArray( this.json_array  )
    }

    // set the default plot parameters
    this.default()
  }


  // set the default plot parameters
  default(){

    // default animations to off for performance
    this.animation = false

    this.tooltip = {
        position: 'top',
        axisPointer: {
            type: 'shadow'
        }
    }
  }

  /**
   *   returns an object for generating a heatmap, similar to
   *   the calendar example but with data from a jsonArray
   *   example: https://echarts.apache.org/examples/en/editor.html?c=calendar-heatmap
   *
   * @param  {string} colx  column 1 name, which will be used for the x_axis
   * @param  {string} coly  column 2 name, which will be used for the y_axis
   * @param  {string} value column name, which will be used for the cell value
   * @param  {string} tooltip string used in the tool tip
   * @return {Array}       Array of x/y cooridnates
   */
  heatmap( colx, coly, value, tooltip='value' ){
    // returns an object for generating a heatmap, similar to
    // the calendar example but with data from a jsonArray
    // example: https://echarts.apache.org/examples/en/editor.html?c=calendar-heatmap


    // set the x axis values using the Axis class
    this.xAxis = new echartsAxis()
    this.xAxis.category({
      label: colx,
      values: this.json_array.unique(colx)
    })

    // set the y axis values using the Axis class
    this.yAxis = new echartsAxis()
    this.yAxis.category({
      label: coly,
      values: this.json_array.unique(coly)
    })


    this.grid = {
        height: '80%',
        top: '10%',
        show:true,
        backgroundColor: 'rgb(0, 128, 0)'
    }

    this.visualMap = {
        min: Math.min(...this.json_array.unique(value))*100,
        max: Math.max(...this.json_array.unique(value))*100,
        calculable: true,
        orient: 'vertical',
        left: 'left',
        bottom: '10%',
        inRange: {
          color: ['green', 'yellow','orange', 'red']
        }
    }

    this.series = [{
        name: tooltip,
        type: 'heatmap',
        data: this.json_array.map(function (item) {
            return [
              item[colx],
              item[coly],
              (Number(item[value])*100).toFixed(2)
            ]
          }),
        label: {
            show: true
        },
    }]

    delete this.json_array
  }


  /**
   * Convert the json_array to a boxplot object
   * @param  {string} col  column name
   */
  boxplot( col, y_axis ){

    const keys = this.data.unique( col )
    const groups = this.data.groupby([col])

    // group the data based on the unique column values
    var group_values = []
    for( var i=0; i < groups.length; i++ ){
      group_values.push(
        groups[i].json_obj.map(row => row.RATIO)
      )
    }

    // // leverage the echarts function to generate the data
    const echartsData = prepareBoxplotData(group_values)

    return {
        tooltip: {
            trigger: 'item',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '10%',
            right: '10%',
            bottom: '15%'
        },
        xAxis: {
            type: 'category',
            data: keys,
            boundaryGap: true,
            nameGap: 30,
            splitArea: {
                show: false
            },
            axisLabel: {
                formatter: '{value}'
            },
            splitLine: {
                show: false
            }
        },

        yAxis: {
            type: 'value',
            name: y_axis,
            splitArea: {
                show: true
            }
        },

        series: [
            {
                name: 'boxplot',
                type: 'boxplot',
                data: echartsData.boxData,
            },
            {
                name: 'outlier',
                type: 'scatter',
                data: echartsData.outliers
            }
        ]
      }
    }
}
