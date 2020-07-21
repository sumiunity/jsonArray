/**
 * JSON Array Duplicates
 * =========================
 *
 * Routines for managing duplicates in a json array
 *
 * :Author: Nik Sumikawa
 * :Date: Feb 4, 2020
 */

import _ from 'lodash'


const debug = false

// removes duplicate json objects from the array
export function dropDuplicates(arr) {
    var cleaned = [];
    arr.forEach(function(itm) {
        var unique = true;
        cleaned.forEach(function(itm2) {
            if (_.isEqual(itm, itm2)) unique = false;
        });
        if (unique)  cleaned.push(itm);
    });
    return cleaned;
}
