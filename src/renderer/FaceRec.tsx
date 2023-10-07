/* eslint-disable react/jsx-props-no-spreading */
import { Alert, Button } from 'antd';
import { useEffect, useState } from 'react';
import Empty from './noface';

export interface facefile {
  name: string;
  path: string;
}
export default function FaceRec({ data = [] }: { data: facefile[] }) {
  const [facefile, setFile] = useState<facefile>();

  const handleUpload = () => {
    window.electron.ipcRenderer.sendMessage('rec-img');
  };

  useEffect(() => {
    const unsubscribe = window.electron.ipcRenderer.on(
      'upload-img-for-rec',
      (file: facefile) => {
        setFile(file);
      },
    );
    return unsubscribe;
  }, []);

  let tip = '上传照片后显示检测结果';
  let type = 'info';
  if (facefile) {
    if (facefile.result) {
      tip = '识别成功';
      type = 'success';
    } else {
      tip = (
        <div>
          识别失败<div>该照片未注册到人脸库</div>
        </div>
      );
      type = 'error';
    }
  }
  if (data.length === 0) {
    return <Empty />;
  }
  return (
    <div>
      <div className="mt-4 grid grid-cols-2 ">
        <div className="flex flex-col items-center gap-4">
          <div className="flex justify-center items-center w-64 h-64 border border-gray-200 border-solid">
            {facefile && (
              <img
                // src={`atom://${facefile.path}`}
                src={`file://${facefile.path}`}
                className="w-64 h-64 object-cover"
              />
            )}
          </div>

          <Button type="primary" onClick={handleUpload}>
            上传照片
          </Button>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="flex justify-center items-center w-64 h-64 border border-gray-200 border-solid">
            <Alert type={type} message={tip} />
          </div>
        </div>
      </div>
    </div>
  );
}
