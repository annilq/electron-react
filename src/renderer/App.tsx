import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import { ConfigProvider, Tabs, TabsProps } from 'antd';
import FaceList from './FaceList';
import FaceRec, { facefile } from './FaceRec';
import './App.css';

function Dashboard() {
  const [fileList, setFileList] = useState<facefile[]>([]);

  const getLocalFiles = async () => {
    const files = await window.electron.getFiles();
    setFileList(files);
  };

  useEffect(() => {
    // console.log(window.electron);
    getLocalFiles();

    const uns = window.electron.ipcRenderer.on('upload-img-end', (arg) => {
      // eslint-disable-next-line no-console
      getLocalFiles();
    });
    const uns2 = window.electron.ipcRenderer.on('delete-img-end', (arg) => {
      // eslint-disable-next-line no-console
      getLocalFiles();
    });
    return () => {
      uns();
      uns2();
    };
  }, []);

  const remove = (fileName: string) => {
    window.electron.ipcRenderer.sendMessage('delete-img', fileName);
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '人脸库',
      children: <FaceList data={fileList} onDelete={remove} />,
    },
    {
      key: '2',
      label: '人脸识别',
      children: <FaceRec data={fileList} />,
    },
  ];
  return (
    <ConfigProvider
      componentSize="large"
      theme={{
        token: {
          fontSize: 16,
        },
      }}
    >
      <div className="h-screen w-screen bg-blue-100 flex flex-col justify-center items-center text-2xl overflow-hidden">
        <div className="container py-8 bg-white h-4/5">
          <div className="text-3xl text-center">人脸识别应用</div>
          <div className="mt-8">
            <Tabs
              tabBarStyle={{ position: 'sticky', top: 0 }}
              tabPosition="left"
              items={items}
              style={{ height: 'calc(80vh - 100px)' }}
              className="overflow-auto"
              destroyInactiveTabPane
            />
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
