// import React from 'react';


// import Example from 'views/Example';
import NotFoundPage from './views/NotFoundPage'
import Table from './views/Table'
import ExcelComponentTest from './views/Excel'

import App from './App'


export var Routes = [
  {
    component: App,
    routes: [

      {
        path: "/",
        exact: true,
        component: Table,
        ...Table,
      },
      {
        path: "/excel",
        exact: true,
        component: ExcelComponentTest,
        ...ExcelComponentTest,
      },


      {
        ...NotFoundPage,
      }
    ]
  },

]
