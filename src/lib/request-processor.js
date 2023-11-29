import { memorize } from "./memorization.js"

export const getQueryParams = async ( req ) => {
  const url = req.url.split( '?' )[ 1 ]
  let params = {}
  for ( const [k,v] of new URLSearchParams( url ) ) {
    params[ k ] = v
  }
  return params
}

export const buildBodyParams = ( req ) => new Promise( ( resolve ) => {
  let data = '', params = {}
  req.on( 'data', chunk => (data += chunk.toString()) )
  req.on( 'end', () => {
    if ( data.length > 0 ) {
      params = JSON.parse( data )
    }
    resolve( params ) ;
  })
} )

const pathParamRegex = /\/{([A-Za-z_-]+)}/g
const pathValueRegex = '/([^\"\\/]+)'

const getPathParamsNames = memorize( ( path ) => {
  const names = []
  const matches = path.matchAll( pathParamRegex )
  for ( const [ _, name ] of matches ) {
    names.push( name )
  }
  return names
} )

const pairPathArgs = ( names, values ) => {
  let params = {}
  let i = -1
  for ( const value of values ) {
    if ( i < 0 ) { ++i ; continue }
    console.log( { name: names[ i ], value } )
    params[ names[i] ] = value
    ++i
  }
  return params
}

export const pathToRegex = memorize(
  ( path ) => path.replaceAll( pathParamRegex, pathValueRegex)
)

/**
   * @param { string } path '/path/{arg1}/to/resource/{arg2}/'
   * @returns { object } { arg1: value, arg2: value }
   */
export const getPathParams = async ( path, req ) => {
  const names = getPathParamsNames( path )
  const pathAsRegex = pathToRegex( path )
  const regex = new RegExp( pathAsRegex, 'g' )
  // console.log( { pathAsRegex, regex: regex.toString() } )
  for ( const matches of req.url.matchAll( regex ) ) {
    return pairPathArgs( names, matches )
  }
}
