import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './signup.css';

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');

    // 아이디, 비번, 닉네임 검증
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [nicknameError, setNicknameError] = useState("");    

    const navigate = useNavigate();

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setUsername(e.target.value);

        if (value.length < 5 || value.length > 20) {
            setUsernameError("아이디는 5자 이상 20자 이하여야 합니다.");
        } else {
            setUsernameError("");
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);

        const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;

        if (!pwRegex.test(value)) {
            setPasswordError("비밀번호는 영문, 숫자를 모두 포함하고 8자 이상 20자 이하여야 합니다.");
        } else {
            setPasswordError("");
        }
    };

    const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNickname(value);

        if (value.length < 2 || value.length > 10) {
            setNicknameError("닉네임은 2자 이상 10자 이하여야 합니다.");
        } else {
            setNicknameError("");
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();    


        try {
            await axios.post('/auth/signup', {
                username,
                password,
                nickname
            });

            alert('회원가입 성공');
            navigate('/login'); // 로그인 페이지로 이동
        } catch (err) {
            console.error(err);
            alert('회원가입 실패');
        }
    };


    return (
        <div className="signup-layout">
        <div className="signup-container">
            <NavLink to="/"><div className="signup-title">정보대학 이수체계도</div></NavLink>
            <form onSubmit={handleSignup}>
                <div>
                    {usernameError && <p className="error-text">{usernameError}</p>}
                    <input type="text" placeholder="아이디" required value={username} onChange={handleUsernameChange} />
                </div>
                <div>
                    {passwordError && <p className="error-text">{passwordError}</p>}
                    <input type="password" placeholder="비밀번호" required value={password} onChange={handlePasswordChange} />
                </div>
                <div>
                    {nicknameError && <p className="error-text">{nicknameError}</p>}
                    <input type="text" placeholder="닉네임" required value={nickname} onChange={handleNicknameChange} />
                </div>
                <div>
                    <button type="submit">회원가입</button>
                </div>
            </form>
        </div>
        </div>
    );
}

export default Signup;