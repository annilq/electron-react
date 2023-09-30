/* eslint-disable react/jsx-props-no-spreading */
import { Button } from 'antd';
import { facefile } from './FaceRec';

export default function FaceList({ data = [] }: { data: facefile[] }) {
  const handleUpload = () => {
    window.electron.ipcRenderer.sendMessage('upload-img', { save: true });
  };

  return (
    <>
      <Button type="primary" onClick={handleUpload}>
        新增人脸
      </Button>
      <div className="mt-4 grid grid-cols-3 overflow-y-auto items-center justify-center ">
        {data.map((item, i) => (
          <img
            src={`atom://${item.path}`}
            className="w-64 h-64 object-cover"
            key={item.path}
          />
        ))}
      </div>
    </>
  );
}
