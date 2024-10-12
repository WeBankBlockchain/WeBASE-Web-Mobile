import DetialPage from './pages/DetialPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WellcomePage from './pages/WellcomePage';

/**
 * todo
1、firstname lastname 中间有空格，需要通过接口传给后台（done）
2、详情界面原地刷新，重新加载数据（done）
3、主页按钮 start（done）
4、宽屏 max-width
5、资产描述
6、加name字段在详情里面
7、复制失败（done）
8、total count，解决滑动加载问题（done）
9、查看详情，需要连接钱包
10、翻译校对（done）
 */

//Dapp整体布局
function App() {
  return (
    <Router>
      <Routes>

        {/* 未定义的目录，重定向到主页 */}
        <Route path="*" element={<WellcomePage />} />
        <Route path={process.env.PUBLIC_URL + "/detail"} element={<DetialPage />} />
      </Routes>
    </Router>

  );
}

export default App;
