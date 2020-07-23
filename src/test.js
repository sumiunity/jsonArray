global.base_dir = './';

global.abs_path = function(path) {
  return base_dir + path;
}

global.include = function(file) {
  return require(abs_path('/' + file));
}

import jsonArray from './jsonArray'

class plotAxis extends jsonArray {

  constructor(array) {
    super(...array)
    this.params = {}
  }

  set label( label ){
    if( label !== undefined ){
      this.params.name = label
    }
  }

  category( label ){
    this.params = {
        type: 'category',
        splitArea: {
            show: true
        }
      }

    // set the label when provided
    this.label( label )

    // add the unique values for the axis when provided
    if( label !== undefined ){
      this.params['data'] = this.unique(label, true)
    }
  }


  value( label ){
    this.params = {
        type: 'value',
    }

    // set the label when provided
    this.label( label )
  }

}

const plot_axis = new plotAxis()
plot_axis.category()

console.log( plot_axis.params )
