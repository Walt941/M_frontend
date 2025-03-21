import { Outlet, Route, Routes } from 'react-router';
import Login from './pages/sign/login';
import Register from './pages/sign/register';
import Home from './pages/Home';
import NotFound from './pages/not_found';
import ForgotPassword from './pages/sign/forgot_password';
import RecoverAccount from './pages/sign/recover_account';
import WritingPage from './pages/WritingPage';

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

            <Route path='*' element={<NotFound />} />
        </Routes >
    )
}

export default Router