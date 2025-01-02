import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TestJump } from './TestJump';

const JumpTestApp: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path={process.env.PUBLIC_URL + "/test"} element={<TestJump />} />
                {/* 其他路由 */}
            </Routes>
        </Router>
    );
};

export default JumpTestApp;