import { Outlet, Route, Routes } from 'react-router';
import Login from './pages/sign/Login';
import Register from './pages/sign/Register';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ForgotPassword from './pages/sign/ForgotPassword';
import RecoverAccount from './pages/sign/RecoverAccount';
import WritingPage from './pages/WritingPage';
import Progress from './pages/Progress'

function Router() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login/" element={<Outlet />}
            >
                <Route index element={<Login />} />
                <Route path='forgot_password' element={<ForgotPassword />} />
                <Route path='recover_account' element={<RecoverAccount />} />
            </Route>
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            <Route path="/writing" element={<WritingPage />} />
            <Route path="/progress" element={<Progress />} />
            <Route path='*' element={<NotFound />} />
        </Routes >
    )
}

export default Router