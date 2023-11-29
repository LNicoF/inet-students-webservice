import { getConnection } from '../lib/connection.js';

const entityTable = 'people';
const roleTable = 'students';
const idColumn = 'id';

const get = (id) =>
  new Promise(async (resolve) => {
    const connection = await getConnection();
    connection.query(
      `select * from ?? inner join ?? on ??.?? = ??.?? where ??.?? = ?`,
      [
        entityTable,
        roleTable,
        roleTable,
        idColumn,
        entityTable,
        idColumn,
        roleTable,
        idColumn,
        id,
      ],
      (err, result) => {
        if (err) throw err;
        resolve(result[0] ?? null);
      }
    );
  });

export default { get };
