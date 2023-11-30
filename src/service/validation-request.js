import { getConnection } from "../lib/connection.js"
import student from "./student.js"

const GET_QUERY = `
select c.created_at, c.is_validated, d.created_at as validated_at, d.ok as is_valid, b.id as student_id
from validation_request a
  inner join students b on a.student_id = b.id
  left join validation_requests c on a.request_id = c.id
  left join validation_requests_validations d on d.request_id = c.id
where student_id = ?`

const get = ( studentId ) => new Promise( async ( resolve ) => {
    const connection = await getConnection()
    connection.query(GET_QUERY, [ studentId ], async ( err, res ) => {
        if ( err ) throw err
        res = res[0]
        resolve( {
            'created-at': res.created_at,
            'is-validated': res.is_validated,
            'validated-at': res.validated_at,
            'is-valid': res.is_valid,
            'student': await student.get( res.student_id ),
        } )
    })
} )

const updateValidation = ( requestId, isValid ) => new Promise( async ( resolve ) => {
    const connection = await getConnection()
    connection.query(
        `update validation_requests_validations a
            left join validation_requests b on a.request_id = b.id
            left join validation_request c on c.request_id = b.id
        set is_valid = ? where request_id = ?`,
        [ isValid, requestId ],
        ( err, res ) => {
            if ( err ) throw err
            console.log( 'updateValidation', { res } )
            resolve('')
        }
    )
} )

const createValidation = ( studentId, isValid ) => new Promise( async ( resolve ) => {
    const connection = getConnection()
    connection.beginTransaction( ( err ) => {
        if ( err ) {
            return connection.rollback( () => { throw err } )
        }
        let requestId
        connection.query(
            `select a.id from validation_requests a
                inner join validation_request b on a.id = b.request_id
            where b.student_id = ?`,
            [ studentId ],
            ( err, res ) => {
                if ( err ) {
                    return connection.rollback( () => { throw err } )
                }
                requestId = res[0].id
            }
        )
        connection.query(
            `insert into validation_requests_validations( request_id, is_valid )
             values( ?, ? )`,
            [ requestId, isValid ],
            ( err ) => {
                if ( err ) {
                    return connection.rollback( () => { throw err } )
                }
            }
        )
        connection.query(
            `update validation_requests
             set is_validated = 1
             where id = ?`,
            [ requestId ],
            ( err ) => {
                if ( err ) {
                    return connection.rollback( () => { throw err } )
                }
                connection.commit( ( err ) => {
                    if ( err ) {
                        return connection.rollback( () => { throw err } )
                    }
                    resolve( '' )
                } )
            }
        )
    } )
} )

const validate = async ( studentId, isValid ) => {
    if ( await get( studentId )[ 'is-validated' ] == false ) {
        return await createValidation( studentId, isValid ) ;
    } else {
        return await updateValidation( studentId, isValid ) ;
    }
} )

export default { get }
