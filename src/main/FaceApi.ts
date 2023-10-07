/* eslint-disable prettier/prettier */
import fs from 'fs';
import { machineIdSync } from 'node-machine-id';

import client from './FaceClient';
import { deleteImg } from './util';

const imageType = 'BASE64';
const groupId = machineIdSync(true)?.split('-')[0];
const userId = groupId;
// console.log('groupId', groupId);

export async function detectFace(filepath: string) {
  const image = fs.readFileSync(filepath, { encoding: 'base64' });
  // 调用人脸检测
  return client
    .detect(image, imageType)
    .then(function (result) {
      console.log('detect', JSON.stringify(result));

      return result;
    })
    .catch(function (err) {
      // 如果发生网络错误
      console.log(err);
    });
}

export async function addFace(filepath: string) {
  const image = fs.readFileSync(filepath, { encoding: 'base64' });
  // 调用人脸检测
  return client
    .addUser(image, imageType, groupId, userId)
    .then(function (result) {
      console.log('addFace', JSON.stringify(result));
      return result;
    })
    .catch(function (err) {
      // 如果发生网络错误
      console.log(err);
    });
}

export async function searchFace(filepath: string) {
  const image = fs.readFileSync(filepath, { encoding: 'base64' });
  // 调用人脸检测
  const options = {};
  options.max_user_num = '1';
  return client
    .search(image, imageType, groupId)
    .then(function (result) {
      console.log('searchFace', JSON.stringify(result));
      return result;
    })
    .catch(function (err) {
      // 如果发生网络错误
      console.log(err);
    });
}

export async function deleteFace(event, faceName: string) {
  // console.log(faceName, groupId, faceName);
  const faceToken = faceName.split('.')[0];
  // 调用人脸检测
  return client
    .faceDelete(userId, groupId, faceToken)
    .then(function (result) {
      console.log('delete', JSON.stringify(result));
      if (result.error_code === 0) {
        deleteImg(event, faceName);
      }
      return result;
    })
    .catch(function (err) {
      // 如果发生网络错误
      console.log(err);
    });
}
