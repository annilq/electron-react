/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import fs from 'fs';
import { app } from 'electron';

export const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

export const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

export const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

export const facedir = path.join(getAssetPath(), 'face');

export const loadImgs = async () => {
  const files = fs.readdirSync(facedir);
  const imageFiles = files
    .filter((file) => {
      const extension = path.extname(file).toLowerCase();
      return extension === '.jpg' || extension === '.png';
    })
    .map((file) => ({
      name: path.basename(file),
      path: path.join(facedir, file),
    }));
  return imageFiles;
};

export const saveImgFromPath = async (filepath: string) => {
  const fileName = path.join(facedir, path.basename(filepath));
  fs.copyFileSync(filepath, fileName);
};

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}
