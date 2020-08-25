/**
 * App Template
 * ================
 *
 * Basic page structure for the app including any headers, footers, etc.
 *
 * :Author: Nik Sumikawa
 * :Date: June 21, 2020
 */

import React from 'react';

import { renderRoutes } from 'react-router-config';



export default function App({ route }){
  return (

    <div>
      {renderRoutes(route.routes)}
      <div><h2>"replace with footer or remove"</h2></div>
    </div>

  );
};
