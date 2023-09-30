/* eslint-disable react/jsx-props-no-spreading */
import { Button, Upload } from 'antd';
import icon from '../../assets/icon.png';
import {
  RcFile,
  UploadChangeParam,
  UploadFile,
  UploadProps,
} from 'antd/es/upload';
import { useEffect, useState } from 'react';

function ImageCard() {
  return (
    <div className=" ">
      <img src={icon} alt="" />
    </div>
  );
}

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

export default function FaceRec() {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imageUrl, setImageUrl] = useState<string>();

  const handleUpload = () => {
    const formData = new FormData();
    console.log(fileList[0]);
  };
  const props: UploadProps = {
    accept: 'image/*',
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    fileList,
    showUploadList: false,
  };

  useEffect(() => {
    if (fileList.length > 0) {
      getBase64(fileList[0] as RcFile, (url) => {
        setImageUrl(url);
      });
    } else {
      setImageUrl('');
    }
  }, [fileList]);
  return (
    <div>
      <Upload {...props}>
        <Button type="primary">新增人脸</Button>
      </Upload>
      <div className="mt-8">
        {imageUrl ? (
          <>
            <img src={imageUrl} alt="avatar" className="w-32 h-32 block mb-4" />
            <Button type="primary" onClick={handleUpload}>
              上传
            </Button>
          </>
        ) : (
          false
        )}
      </div>

      <div className="mt-4 grid grid-cols-4 overflow-y-auto ">
        {Array.from({ length: 23 }).map((_, i) => (
          <ImageCard />
        ))}
      </div>
    </div>
  );
}
