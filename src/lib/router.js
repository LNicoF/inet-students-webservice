import { buildBodyParams, getPathParams, getQueryParams, pathToRegex } from "./request-processor.js"

export const methods = {
  POST: 'post',
  GET: 'get',
  DELETE: 'delete',
}

let routes = {}
for ( const m of Object.values( methods ) ) {
  routes[m] = {}
}

/**
 * @param { ( res, params, body, query ) => {
 *   code: number = 200,
 *   contentType: string = 'application/json',
 *   content: string,
 * } } handler
 */
export const addRoute = ( method, path, handler ) => {
  routes[ method ][ path ] = handler
  let regex = methods
}

const extractPath = ( req ) => req.url.split( '?' )[ 0 ]

const findPath = ( method, requestPath ) => {
  for ( const [path] of Object.entries( routes[ method ] )) {
    const regex = pathToRegex( path )
    const isRegex = regex != path
    if ( !isRegex && path == requestPath ) {
      return path
    }
    const match = requestPath.match( new RegExp( regex ) )
    if ( match != null && match[0] == requestPath ) {
      return path
    }
  }
}

export const runRouter = async ( req, res ) => {
  const method = req.method.toLowerCase()
  const path = findPath( method, extractPath( req ) )
  const handler = routes[ method ][ path ]
  if (!handler ) {
    res.writeHead( 404, { 'Content-Type': 'text/html' } )
    res.end( '<h1>404</h1>')
    return
  }
  try {
    const qParams = await getQueryParams( req )
    const bParams = await buildBodyParams( req )
    const pParams = await getPathParams( path, req )
    // console.log( { pParams, bParams, qParams })
    let result = await handler( res, pParams, bParams, qParams )
    res.writeHead(
      result.code ?? 200,
      { 'Content-Type': result.contentType ?? 'application/json' }
    )
    res.end( result.content )
  } catch ( e ) {
    res.writeHead( 500, { 'Content-Type': 'text/plain' } )
    res.end( `<pre>${e}</pre>`)
    console.error( e )
  }
}
