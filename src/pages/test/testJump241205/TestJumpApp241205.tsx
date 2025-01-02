import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TestJumpPage } from './TestJumpPage';

const TestJumpApp241205: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path={process.env.PUBLIC_URL + "/testpage/:id"} element={<TestJumpPage />} />
            </Routes>
        </Router>
    );
};

export default TestJumpApp241205;