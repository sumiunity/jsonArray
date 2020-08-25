// import React from 'react';


// import Example from 'views/Example';
import NotFoundPage from './views/NotFoundPage'
import Table from './views/Table'

import App from './App'


export var Routes = [
  {
    component: App,
    routes: [

      {
        // ...SsrExample,
        path: "/",
        exact: true,
        component: Table,
        ...Table,
      },
      {
        ...NotFoundPage,
      }
    ]
  },

]
