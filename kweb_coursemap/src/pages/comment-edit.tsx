import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import './comment-edit.css';
import Header from "../components/Header";

function CommentEdit() {
  const { commentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const initialContent = location.state?.content ?? "";
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);

    try {
        const accessToken = localStorage.getItem("acessToken");

        await axios.patch(
            `/courses/comments/${commentId}`,
            {
                content, 
                relations: [], //관계 다루는 로직 추후 추가
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            }
        );

        // 성공 시
        navigate('/profile');
    } catch (error) {
        alert('백엔드X');
    } finally {
        setLoading(false);
    }

    
  }

  return (
    <div className="container">
        <Header />
        <div className="comment-edit">
            <textarea
                className="comment-edit-textarea"
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <div className="input-actions">
                <button className="cancel-btn" onClick={() => navigate("/profile")}>취소</button>
                <button className={`submit-btn ${!content.trim() ? 'disabled' : ''}`}  onClick={handleSave} disabled={loading}>저장</button>
            </div>
        </div>

    </div>
  );
}

export default CommentEdit;
