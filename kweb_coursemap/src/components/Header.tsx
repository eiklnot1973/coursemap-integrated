import { NavLink } from "react-router-dom";
import "./Header.css";

function Header() {
  // 로그인 여부 판단
  const token = localStorage.getItem("accessToken");
  const nickname = localStorage.getItem("nickname");

  const handleLogout = () => {
    // 저장된 로그인 정보 제거
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    localStorage.removeItem("nickname");

    // 홈으로 이동, UI 리렌더링
    window.location.href = "/";
  };

  return (
    <div className="header">
      <NavLink to="/" className="title">정보대학 이수체계도</NavLink>

      {/* 로그인 여부에 따라 분기 */}
      {token ? (
        <div className="auth">
          <NavLink to="/profile">{nickname} 님</NavLink>
          <button className="logout-btn" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      ) : (
        <div className="auth">
          <NavLink to="/login">로그인</NavLink>
          <NavLink to="/signup">회원가입</NavLink>
        </div>
      )}
    </div>
  );
}

export default Header;