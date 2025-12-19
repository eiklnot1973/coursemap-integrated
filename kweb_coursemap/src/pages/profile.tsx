import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './profile.css';
import Header from "../components/Header";

// Course type 정의
type Course = {
  name: string;
  code: string;
}

// 댓글 type 정의
type MyComment = {
  id: number;
  course: Course;
  content: string;
}

function Profile() {
    const [username, setUsername] = useState<string | null>(null);
    const [nickname, setNickname] = useState<string | null>(null);
    const [comments, setComments] = useState<MyComment[]>([]);
    
    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        const storedNickname = localStorage.getItem("nickname");

        if (storedUsername) setUsername(storedUsername);
        else setUsername("dummy_username");

        if (storedNickname) setNickname(storedNickname);
        else setNickname("더미닉네임");

        const fetchMyComments = async () => {
          try {
            const token = localStorage.getItem("accessToken");

            const res = await axios.get("/courses/my-comments", {
              headers: {Authorization: `Bearer ${token}`}
            });

            if (!Array.isArray(res.data)) {
              throw new Error("GET /courses/my-comments failed");
            }

            const mappedComments: MyComment[] = res.data.map((c:any) => ({
              id: c.id,
              course: {
                name: c.course.name,
                code: c.course.code,
              },
              content: c.content,
            }));

            setComments(mappedComments);
          } catch (error) {
            console.error("백엔드 연결 실패. 더미 데이터 사용.", error);

            setComments([
              {id: 1, course: {name: '자료구조', code: 'COSE213'}, content:"예시 댓글입니다1"},
              {id: 2, course: {name: '알고리즘', code: 'COSE214'}, content:"예시 댓글입니다2"},
              {id: 3, course: {name: '컴퓨터구조', code: 'COSE222'}, content:"예시 댓글입니다3"},
              {id: 4, course: {name: '운영체제', code: 'COSE341'}, content:"예시 댓글입니다4"},
              {id: 5, course: {name: '데이터베이스', code: 'COSE371'}, content:"예시 댓글입니다5"},

            ]);
          }
        }

        fetchMyComments();
    }, []);
    
    return (
      <div className="container">
        <Header />
        <div className="profile-main">
          <div className="profile-section">
            <div className="profile-title">내 프로필</div>
            <div className="profile-card">
              <div className="profile-image"></div>
              <div>
                <div className="profile-nickname">{nickname} 님</div>
                <div className="profile-username">{username}</div>
              </div>
            </div>
            <NavLink to="/profile-edit" className="edit-btn">프로필 수정</NavLink>
          </div>
          <div className="comments-section">
            <div className="profile-title">내가 작성한 댓글</div>
            <div className="comment-grid">
              {comments.map((item) => (
                <div key={item.id} className="comment-box">
                  <div className="comment-course">
                    {item.course.name} {item.course.code}
                  </div>
                  <div className="comment-content">
                    {item.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div> 
    );
}

export default Profile