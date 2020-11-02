/**
 * Routes
 * ============
 *
 * Routing used by the ReactFramework for the jsonArray Examples
 *
 * @author Nik Sumikawa
 * @date Nov 2, 2020
 */


import Table from "./Table"

import ECharts from "./ECharts"
import Excel from "./Excel"


export const Examples = [
  { menu: 'jsonArray',
    name: 'Table',
    path:'/Table',
    component: Table,
    auth: 'public',
    show: true,
    admin: true,
  },

  { menu: 'jsonArray',
    name: 'ECharts',
    path:'/ECharts',
    component: ECharts,
    auth: 'public',
    show: true,
    admin: true,
  },

  { menu: 'jsonArray',
    name: 'Excel',
    path:'/Excel',
    component: Excel,
    auth: 'public',
    show: true,
    admin: true,
  },
]
