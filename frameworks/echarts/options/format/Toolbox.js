
import { toolbox as features } from 'echarts/lib/langEN'

// adds a toolbox to the chart to enable user interaction
export default function Toolbox( option, props ){

  option['toolbox'] = {
    show: true,
    feature: {
        dataZoom: {
          title: 'Zoom',
          show: true
        },
        saveAsImage: { title: 'Save', show: true},
        restore: {title: 'Restore', show: true},
    }
  }

  return option

}
