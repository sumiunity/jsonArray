
import propsToSeries from '../propsToSeries'

/**
 * Convert the json_array to a pie char
 * @param  {string} value  values for pie chart
 * @param  {string} label  name of each section
 */
export default function pie( props ){

  // format the data with and without a label (w/o is the default)
  var data = props.json_array.map(r => { return {value: r[props.value]}})
  if( props.__label__ !== undefined ){
    data = props.json_array.map(r => {
      return {
        value: r[props.value],
        name: r[props.__label__]
      }
    })
  }


  var Series = {
    type: 'pie',
    avoidLabelOverlap: false,
    radius: ['40%', '70%'],
    labelLine: {
                show: false
            },
    data: data
  }

  if( props.__label__ !== undefined ){
    Series['label'] = {
        show: false,
        position: 'center'
    }

    Series['emphasis'] = {
        label: {
            show: true,
            fontSize: '40',
            fontWeight: 'bold'
        }
    }
  }

  if( props.showPercent === true ){
    Series['label'] = {
        formatter: '{b|{b}：}{c}  {per|{d}%}  ',
        rich: {
          a: {
            color: '#6E7079',
            lineHeight: 22,
            align: 'center'
          },
          b: {
            color: '#4C5058',
            fontSize: 14,
            fontWeight: 'bold',
            lineHeight: 33
          },
          per: {
            color: '#fff',
            backgroundColor: '#4C5058',
            padding: [3, 4],
            borderRadius: 4
          }
        }
      }
  }

  Series = propsToSeries(props, Series)

  return [Series]

}
