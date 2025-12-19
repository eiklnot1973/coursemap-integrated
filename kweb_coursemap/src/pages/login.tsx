import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css'

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/auth/login', {
                username,
                password,
            });

            const token = response.data.accessToken;
            const user = response.data.user;

            localStorage.setItem('accessToken', token);
            localStorage.setItem('username', user.username);
            localStorage.setItem('nickname', user.nickname);
            
            alert('로그인 성공');
            navigate('/profile'); // 프로필 페이지로 이동
        } catch (err) {
            console.error(err);
            alert('아이디 또는 비밀번호가 잘못되었습니다.');
        }
    };    

    return (
        <div className="login-layout">
        <div className="login-container">
            <NavLink to="/"><div className="login-title">정보대학 이수체계도</div></NavLink>
            <form onSubmit={handleLogin}>
                <div>
                    <input type="text" placeholder="아이디" required value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                    <input type="password" placeholder="비밀번호" required value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div>
                    <button type="submit">로그인</button>
                </div>
            </form>
        </div>
        </div>
    );
}

export default Login;