import sqlString from 'sqlstring';
import { EOL } from 'os';

export default {
  getInsert(data, tableName) {
    let { headers, rows } = data;
    let out = '';
    let lastRow = rows.length - 1;

    tableName = sqlString.escapeId(tableName);
    headers = headers.map(e => sqlString.escapeId(e)).join(', ');
    rows = rows.map(e => e.map(el => sqlString.escape(el)).join(', '));

    out += `INSERT INTO ${tableName} (${headers}) VALUES ${EOL}`;
    rows.map((e, i) => {
      out += `(${e})${lastRow === i ? ';' : ','}${EOL}`;
    });
    return out;
  },
  getCreateTable(data, tableName, collation) {
    let { headers } = data;

    tableName = sqlString.escapeId(tableName);
    headers = headers.map(e => sqlString.escapeId(e));

    let out = `CREATE TABLE ${tableName} (${EOL}\t`;
    out += headers.join(` VARCHAR(500) DEFAULT NULL,${EOL}\t`);
    out += ` VARCHAR(500) DEFAULT NULL${EOL})`;
    out += ` ENGINE=InnoDB DEFAULT CHARSET=${collation};${EOL + EOL}`;

    return out;
  },
};
