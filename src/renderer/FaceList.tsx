/* eslint-disable react/jsx-props-no-spreading */
import { Button } from 'antd';
import { facefile } from './FaceRec';
import Empty from './noface';

export default function FaceList({
  data = [],
  onDelete,
}: {
  data: facefile[];
  onDelete: (fileName: string) => void;
}) {
  const handleUpload = () => {
    window.electron.ipcRenderer.sendMessage('upload-img', { save: true });
  };

  return (
    <>
      <Button type="primary" onClick={handleUpload}>
        新增人脸
      </Button>
      {data.length === 0 ? <Empty /> : false}
      <div className="mt-4 grid grid-cols-3 overflow-y-auto items-center justify-center ">
        {data.map((item, i) => (
          <div key={item.path} className="relative">
            <div
              onClick={() => onDelete(item.name)}
              className="absolute right-1 top-1 bg-orange-500 text-white rounded-lg px-4 text-sm cursor-pointer"
            >
              删除
            </div>
            <img
              // src={`atom://${item.path}`}
              src={`file://${item.path}`}
              className="w-full aspect-square"
            />
          </div>
        ))}
      </div>
    </>
  );
}
