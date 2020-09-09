/**
 * plugins Test
 * =====================
 *
 * Test the functionality of the various plugins
 *
 * :Author: Nik Sumikawa
 * :Date: Aug 03, 2020

 */

import {from_file} from '../plugins/fromCsv.js'
const fs = require('fs');


//
test("Pluggin : csv parser", () => {

  fs.readFile('src/tests/data.csv', 'utf8', function (err, file) {

   const json_array = from_file(file)
   expect(json_array.length).toBe( 5 );
   expect(json_array.columns.length).toBe( 4 );

  });
});
