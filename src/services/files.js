import fs from 'fs';
import path from 'path';
import AutodetectDecoderStream from 'autodetect-decoder-stream';
import xlsx from 'xlsx';
import csvReader from 'csv-reader';

function getCSVData(filepath, separator) {
  return new Promise((resolve, reject) => {
    let rows = [];
    try {
      let inputStream = fs.createReadStream(filepath)
        .pipe(new AutodetectDecoderStream({ defaultEncodig: '1258' }));

      inputStream
        .pipe(csvReader({
          trim: true,
          delimiter: separator,
          skipEmptyLines: true
        }))
        .on('data', row => rows.push(row))
        .on('end', data => {
          let headers = rows.shift();
          resolve({ headers, rows })
        })
        .on('error', reject);
    } catch (error) {
      reject(error);
    }
  })
}

function getExcelData(filepath, sheet) {
  return new Promise((resolve, reject) => {
    let parsed = xlsx.utils.sheet_to_json(workbook.Sheets[sheet])
    if (parsed.length <= 0) {
      reject(`The sheet ${sheet} does not have data.`);
    } else {
      let headers = Object.keys(parsed[0]);
      let rows = [];
      parsed.forEach(e => {
        let fields = [];
        Object.keys(e).forEach(i => fields.push(e[i]));
        rows.push(fields);
      })
      resolve({ headers, rows });
    }
  })
}

export default {
  fileExists(filepath) {
    return fs.existsSync(filepath);
  },
  getFileType(filepath) {
    let extension = path.extname(filepath);

    if (['.csv', '.CSV'].indexOf(extension) !== -1) {
      return 'CSV';
    } else if (['.xls', '.XLS', '.xlsx', '.XLSX'].indexOf(extension) !== -1) {
      return 'EXCEL';
    }

    return null;
  },
  getExcelSheets(filepath) {
    if (!this.fileExists(filepath)) return null;

    try {
      let workbook = xlsx.readFile(filepath);
      return workbook.SheetNames;
    } catch (error) {
      return null;
    }
  },
  getFileData(filepath, options) {
    if (!this.fileExists(filepath)) return false;

    if (this.getFileType(filepath) === 'CSV') {
      return getCSVData(filepath, options.separator);
    } else if (this.getFileType(filepath) === 'EXCEL') {
      return getExcelData(filepath, options.sheet);
    }

    return null;
  }
}