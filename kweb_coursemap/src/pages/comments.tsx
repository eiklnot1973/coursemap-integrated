import { useState, useEffect, useRef } from 'react';
import './comments.css';
import Header from '../components/Header';
import { NavLink } from 'react-router-dom'

const CURRENT_USER = 'CurrentUser';

const initialComments = [
  {
    id: 1,
    user: '유저1',
    date: '15일 전',
    timestamp: new Date('2025-12-4').getTime(),
    content: '#선이수: 컴퓨터 프로그래밍 I\n예시 댓글입니다.',
    likes: 13,
    isLiked: true,
  },
  {
    id: 2,
    user: '유저2',
    date: '7일 전',
    timestamp: new Date('2025-12-12').getTime(),
    content: '#후이수: 알고리즘\n예시 댓글입니다.',
    likes: 7,
    isLiked: false,
  },
];

const CommentItem = ({ comment, onDelete, onEdit }: {onDelete: (id: number) => void; onEdit: (id: number, content: string) => void; comment: { id: number; user: string; date: string; timestamp: number; content: string; likes: number; isLiked: boolean }; }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [showMenu, setShowMenu] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const isOwner = comment.user === CURRENT_USER;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onEdit(comment.id, editText);
      setIsEditing(false);
      setShowMenu(false);
    }
  };

  const handleCancelEdit = () => {
    setEditText(comment.content);
    setIsEditing(false);
    setShowMenu(false);
  };
  
  return (
    <div className="course-comment-item">
      <div className="profile-image-placeholder"></div>
      <div className="course-comment-body">
        <div className="course-comment-meta">
          <span className="course-comment-username">{comment.user}</span>
          <span className="course-comment-date">{comment.date}</span>
        </div>

        {!isEditing ? (
          <div className="course-comment-content">{comment.content.split('\n').map((line, index) => ( <p key={index}>{line}</p> ))}</div>
        ) : (
          <div className="edit-container">
            <input 
              type="text" 
              className="comment-field edit-field" 
              value={editText} 
              onChange={(e) => setEditText(e.target.value)}
              autoFocus
            />
            <div className="input-actions">
              <button className="cancel-btn" onClick={handleCancelEdit}>취소</button>
              <button 
                className={`submit-btn ${!editText.trim() ? 'disabled' : ''}`} 
                onClick={handleSaveEdit}
                disabled={!editText.trim()}
              >
                수정
              </button>
            </div>
          </div>
        )}

        <div className="course-comment-actions">
          <div className="like-container">
            {comment.isLiked ? (
              <svg viewBox="0 0 24 24" className="icon heart-filled"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
            ) : (
              <svg viewBox="0 0 24 24" className="icon heart-outline"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
            )}
            <span className="like-count">{comment.likes}</span>
          </div>
        </div>
      </div>

      {isOwner && !isEditing && (
        <div className="menu-container" ref={menuRef}>
          <button className="menu-trigger" onClick={() => setShowMenu(!showMenu)}>
            <svg viewBox="0 0 24 24" className="icon"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>
          </button>
          {showMenu && (
            <div className="menu-dropdown">
              <div onClick={() => setIsEditing(true)}>
                <svg viewBox="0 0 24 24" className="menu-icon"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
                수정
              </div>
              <div onClick={() => onDelete(comment.id)}>
                <svg viewBox="0 0 24 24" className="menu-icon"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
                삭제
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

const CommentInput = ({ onAddComment }: { onAddComment: (text: string) => void }) => {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = () => {
    if (!text.trim()) return;
    onAddComment(text);
    setText('');
    setIsFocused(false);
  };

  return (
    <div className="course-comment-input-container">
      <textarea
        placeholder="댓글 추가..."
        className="course-comment-textarea"
        rows={3}
        value={text}
        onFocus={() => setIsFocused(true)}
        onChange={(e) => setText(e.target.value)}
      />
      {(isFocused || text) && (
          <div className="input-actions">
            <button 
              className="cancel-btn" 
              onClick={() => {
                setText('');
                setIsFocused(false);
              }}
            >
              취소
            </button>
            <button 
              className={`submit-btn ${!text.trim() ? 'disabled' : ''}`} 
              onClick={handleSubmit}
              disabled={!text.trim()}
            >
              등록
            </button>
          </div>
        )}
    </div>
  );
};

function Comments() {
  const [comments, setComments] = useState(initialComments);
  const [sortType, setSortType] = useState('top');
  const [isSortOpen, setIsSortOpen] = useState(false);

  const getSortedComments = () => { 
    const sorted = [...comments];
    return sortType === 'top' 
      ? sorted.sort((a, b) => b.likes - a.likes)
      : sorted.sort((a, b) => b.timestamp - a.timestamp);
  };

  const handleAddComment = (text: string) => {
    const newComment = {
      id: Date.now(),
      user: CURRENT_USER,
      avatar: '',
      date: '방금 전',
      timestamp: Date.now(),
      content: text,
      likes: 0,
      isLiked: false,
    };
    setComments([newComment, ...comments]);
  };

  const handleDeleteComment = (id: number) => {
    setComments(comments.filter(comment => comment.id !== id));
  };

  const handleEditComment = (id: number, newContent: string) => {
    setComments(comments.map(comment => 
      comment.id === id ? { ...comment, content: newContent } : comment
    ));
  };

  return (
    <div className="page-container">
      <Header />

      <div className="main-content">
        <div className="course-header">
          <NavLink to="/coursemap/cs" className="back-button">
            <svg viewBox="0 0 24 24" className="icon back-icon"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>
            뒤로가기
          </NavLink>
          <h2>자료구조</h2>
        </div>

        <div className="course-description">
          <p>자료구조는 데이터를 효율적으로 사용할 수 있도록 조직화하는 방법을 배우는 과목입니다.</p>
          <p>자료구조는 C, C++, 파이썬 등의 언어로 구현될 수 있습니다.</p>
        </div>

        <div className="course-comments-section-header">
          <span className="course-comments-count">댓글 {comments.length}개</span>
          <div className="sort-container">
            <button className="sort-btn" onClick={() => setIsSortOpen(!isSortOpen)}>
              <span>정렬 기준</span>
              <svg viewBox="0 0 24 24" className="icon dropdown-icon"><path d="M7 10l5 5 5-5z"></path></svg>
            </button>

            {isSortOpen && (
              <div className="sort-dropdown">
                <div onClick={() => { setSortType('top'); setIsSortOpen(false); }}>좋아요순</div>
                <div onClick={() => { setSortType('newest'); setIsSortOpen(false); }}>최신순</div>
              </div>
            )}
          </div>
        </div>

        <CommentInput onAddComment={handleAddComment} />

        {getSortedComments().map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onDelete={handleDeleteComment}
            onEdit={handleEditComment}
          />
        ))}

      </div>
    </div>
  );
}

export default Comments;