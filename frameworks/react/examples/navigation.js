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


export const Examples = [
  { menu: 'jsonArray Examples',
    name: 'Table',
    path:'/Table',
    component: Table,
    auth: 'public',
    show: true,
    admin: true,
  },

]
