import { appendFileSync, readFileSync, writeFileSync } from 'fs';
import { join as joinPath } from 'path';

class FileHandler {
  constructor(folder, filename) {
    this.pathname = joinPath(__appdir, folder, filename);
  }

  read(isJSON = false) {
    try {
      const data = readFileSync(this.pathname, 'utf8');

      if (isJSON) return JSON.parse(data);

      return data;
    } catch (error) {
      throw error;
    }
  }

  write(data) {
    try {
      writeFileSync(this.pathname, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
      throw error;
    }
  }

  append(data) {
    try {
      appendFileSync(this.pathname, `${data}\n`, 'utf8');
    } catch (error) {
      throw error;
    }
  }
}

export default FileHandler;
