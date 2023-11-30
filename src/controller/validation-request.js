import { addRoute, methods } from "../lib/router.js";
import service from "../service/validation-request.js";

addRoute( methods.GET, '/validation-requests/{studentId}', async ( _, { studentId } ) => {
    const validationRequest = await service.get( studentId )
    if ( !validationRequest ) {
        return {
            code: 404,
            content: '{"msg": "Validation request not found"}'
        }
    }
    return {
        content: JSON.stringify( validationRequest )
    }
} )

addRoute(
    methods.POST, '/validation-requests/{studentId}',
    async ( _, { studentId }, { is_valid: isValid } ) => {
        const validationRequest = service.validate( studentId, isValid )
        if ( !validationRequest ) {
            return {
                code: 404,
                content: '{"msg": "Validation request not found"}'
            }
        }
        return {
            content: JSON.stringify( validationRequest )
        }
    }
)
