import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './profile-edit.css';

function ProfileEdit() {

    // 닉네임
    const [newNickname, setNewNickname] = useState('');
    const [nicknameError, setNicknameError] = useState('');

    const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewNickname(value);

        if (value.length < 2 || value.length > 10) {
            setNicknameError('닉네임은 2자 이상 10자 이하여야 합니다.');
        } else {
            setNicknameError('');
        }
    };

    // 비밀번호
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewPassword(value);

        const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
        if (!pwRegex.test(value)) {
            setPasswordError('새 비밀번호는 영문, 숫자를 모두 포함하고 8자 이상 20자 이하여야 합니다.');
        } else {
            setPasswordError('');
        }
    };

    const navigate = useNavigate();

    // 닉네임 변경
    const handleUpdateNickname = async () => {
        if (nicknameError || newNickname === '') {
            alert('닉네임은 2자 이상 10자 이하여야 합니다.');
            return;
        }

        try {
            const token = localStorage.getItem('accessToken');
            await axios.patch(
                '/auth/nickname',
                { newNickname },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert('닉네임 변경 완료');
            navigate("/profile");

        } catch (err) {
            console.error(err);
            alert('닉네임 변경 실패');
        }
    };

    // 비밀번호 변경
    const handleUpdatePassword = async () => {
        if (passwordError || newPassword === '') {
            alert('비밀번호는 영문, 숫자를 모두 포함하고 8자 이상 20자 이하여야 합니다.');
            return;
        }

        try {
            const token = localStorage.getItem('accessToken');
            await axios.patch(
                '/auth/password',
                { oldPassword, newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert('비밀번호 변경 완료');
            navigate('/profile');

        } catch (err) {
            console.error(err);
            alert('비밀번호 변경 실패');
        }
    };

    return (
        <div className="edit-layout">
            <div className="edit-container">
                <NavLink to="/"><div className="edit-title">정보대학 이수체계도</div></NavLink>

                {/* 닉네임 변경 영역 */}
                <div className="section">
                    {nicknameError && <p className="error-text">{nicknameError}</p>}
                    <input type="text" placeholder="새 닉네임" value={newNickname} onChange={handleNicknameChange} />
                    <button onClick={handleUpdateNickname}>닉네임 변경</button>
                </div>

                {/* 비밀번호 변경 영역 */}
                <div className="section">
                    {passwordError && <p className="error-text">{passwordError}</p>}
                    <input type="password" placeholder="현재 비밀번호" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                    <input type="password" placeholder="새 비밀번호" value={newPassword} onChange={handleNewPasswordChange} />
                    <button onClick={handleUpdatePassword}>비밀번호 변경</button>
                </div>

            </div>
        </div>
    );
}

export default ProfileEdit;
