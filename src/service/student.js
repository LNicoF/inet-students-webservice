import { getConnection } from '../lib/connection.js';

const entityTable = 'people';
const roleTable = 'students';
const idColumn = 'id';

const get = (id) =>
  new Promise(async (resolve) => {
    const connection = await getConnection();
    connection.query(
      `select * from ?? as a inner join ?? as b on a.?? = b.?? where a.?? = ?`,
      [ entityTable, roleTable, idColumn, idColumn, idColumn, id ],
      (err, result) => {
        if (err) throw err;
        resolve(result[0] ?? null);
      }
    );
  });

export default { get };
