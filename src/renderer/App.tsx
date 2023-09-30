import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import { ConfigProvider, Tabs, TabsProps } from 'antd';
import FaceList from './FaceList';
import FaceRec from './FaceRec';
import './App.css';

function Dashboard() {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '人脸库',
      children: <FaceList />,
    },
    {
      key: '2',
      label: '人脸识别',
      children: <FaceRec />,
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
        <div className="py-8 bg-white w-[1280px] h-4/5">
          <div className="text-3xl text-center">人脸识别应用</div>
          <div className="mt-8">
            <Tabs
              tabBarStyle={{ position: 'sticky', top: 0 }}
              tabPosition="left"
              items={items}
              style={{ height: 'calc(80vh - 100px)' }}
              className="overflow-auto"
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
