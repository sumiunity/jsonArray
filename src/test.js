
export function hello(){
    console.log('helloworld')
    }

hello()


const test_data = [
  { TEST: "OBJECT1", VALUE: 1 },
  { TEST: "OBJECT2", VALUE: 2 },
  { TEST: "OBJECT2", VALUE: 3 },
  { TEST: "OBJECT3", VALUE: 3 },
]



export default class jsonArray extends Array{

  constructor(array) {
    super(...array);
  }

  add( obj ){
    this.push( obj )
  }

  top(limit=10){
    console.log( this.sort((a, b) => (a.TEST > b.TEST ? -1 : 1)).slice(0, limit) )
  }

  map( col ){
    const values = [...this].filter(r => r[col] === 'OBJECT2' )
    this = values

    console.log( 'here---', this )
    return new jsonArray( values )
  }

}
