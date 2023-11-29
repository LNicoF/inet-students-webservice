/**
 * Apply memorization to a pure function.
 *
 * > Won't be as effective inside a function's scope
 *
 * @param { ( any ) => any } fn A pure function to apply memorization. Avoid multiple array parameters.
 * @returns { ( any ) => any } fn with memorization applied
 */
export const memorize = ( fn ) => {
  let results = {}
  return ( ...args ) => {
    let res = null
    if ( results[ args ] === undefined ) {
      res = results[ args ] = fn( ...args )
    }
    return res ?? results[ args ]
  }
}
