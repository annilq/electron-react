/* eslint-disable prettier/prettier */
import fs from 'fs';
import { machineIdSync } from 'node-machine-id';

import client from './FaceClient';
import { deleteImg } from './util';

const messMap = {
  222202: '未检测到人脸',
  222209: 'face token不存在  ',
  222300: '人脸图片添加失败  ',
  223105: '该人脸已存在',
  223106: '该人脸不存在',
  223115: '人脸光照不好',
  223116: '人脸不完整',
  223114: '人脸模糊',
  223113: '人脸有被遮挡',
};

const imageType = 'BASE64';
const groupId = 'group';
const userId = machineIdSync(true)?.split('-')[0];

export async function detectFace(event, filepath: string) {
  const image = fs.readFileSync(filepath, { encoding: 'base64' });
  // 调用人脸检测
  return client
    .detect(image, imageType)
    .then(function (result) {
      console.log('detect', JSON.stringify(result));
      if (result.error_code !== 0) {
        event.sender.send(
          'message',
          messMap[result?.error_code] || result?.error_msg,
        );
      }
      return result;
    })
    .catch(function (err) {
      // 如果发生网络错误
      event.sender.send('message', err.message);
    });
}

export async function addFace(event, filepath: string) {
  const image = fs.readFileSync(filepath, { encoding: 'base64' });
  // 调用人脸检测
  return client
    .addUser(image, imageType, groupId, userId)
    .then(function (result) {
      console.log('addFace', JSON.stringify(result));
      if (result.error_code !== 0) {
        event.sender.send(
          'message',
          messMap[result?.error_code] || result?.error_msg,
        );
      }
      return result;
    })
    .catch(function (err) {
      // 如果发生网络错误
      event.sender.send('message', err.message);
    });
}

export async function searchFace(event, filepath: string) {
  const image = fs.readFileSync(filepath, { encoding: 'base64' });
  // 调用人脸检测
  const options = {};
  options.max_user_num = '1';
  return client
    .search(image, imageType, groupId)
    .then(function (result) {
      console.log('searchFace', JSON.stringify(result));
      if (result.error_code !== 0) {
        event.sender.send(
          'message',
          messMap[result?.error_code] || result?.error_msg,
        );
      }
      return result;
    })
    
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
      } else {
        event.sender.send(
          'message',
          messMap[result?.error_code] || result?.error_msg,
        );
      }
      return result;
    })
    .catch(function (err) {
      // 如果发生网络错误
      event.sender.send('message', err.message);
    });
}
