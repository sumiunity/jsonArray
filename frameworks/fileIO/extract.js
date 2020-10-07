/**
 * Extract
 * ===================
 *
 * Routines for extracting data to the local desktop
 * in various formats
 *
 * @author Nik Sumikawa
 * @date Oct 7, 2020
 */

const Papa = require("papaparse")


/**
 * Pushes the data into a downloadable location
 * and posts the interface to enable downlaodign
 * @param  {Blob}   data       Blob containing the data
 * @param  {string} filename  file name
 * @return {None}
 */
function browserInterface( data, filename ){

  var url = window.URL.createObjectURL(data);

  var link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);

  document.body.appendChild(link);

  link.click();

  // Clean up and remove the link
  link.parentNode.removeChild(link);
}

/**
 * Formats the data as a csv file and push it into a dowloadble location
 * @param  {Array}   data     DataFrame containing the data 
 * @param  {string} filename  file name
 * @return {None}
 */
export function toCsv( data, filename='file.csv' ){

  var csv = Papa.unparse(data);
  var csvData = new Blob([csv], {type: 'text/csv;charset=utf-8;'});

  browserInterface( csvData, filename )
}
