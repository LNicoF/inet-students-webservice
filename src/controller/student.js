import { addRoute, methods } from '../lib/router.js';
import service from '../service/student.js';

addRoute(methods.GET, '/students/{id}', async (_, { id }) => {
  const student = await service.get( id );
  if (student == null) {
    return {
      code: 404,
      content: JSON.stringify({
        msg: 'Student not found',
      }),
    };
  }
  return {
    content: JSON.stringify(student),
  };
});
