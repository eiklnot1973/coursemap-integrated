import { NavLink } from 'react-router-dom'
import './Modal.css'

const Modal = ({ isModalOpen, setIsModalOpen }: { isModalOpen: string; setIsModalOpen: (courseName: string) => void }) => {
  if (isModalOpen === '') return null;

  return (
    <div className="modal-backdrop" onClick={() => setIsModalOpen('')}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-left">
            <NavLink to="/comments" className="header-view-btn">전체보기</NavLink>
          </div>
          <h2 className="modal-title">{isModalOpen}</h2>
          <button className="modal-close-btn" onClick={() => setIsModalOpen('')}>&times;</button>
        </div>
        <div className="modal-body-content">
          <p className="modal-description">
            자료구조는 데이터를 효율적으로 사용할 수 있도록 조직화하는 방법을 배우는 과목입니다. 자료구조는 C, C++, 파이썬 등의 언어로 구현될 수 있습니다.
          </p>
          <div className="recommendation-section">
            <button className="recommendation-btn">추천 이수 순서</button>
            <div className="subjects-container">
              <div className="prerequisite-subjects">
                <h3>선이수 과목</h3>
                <div className="subject-card">
                  <h4>컴퓨터 프로그래밍 I</h4>
                  <ul>
                    <li className="comment-item">
                      <span>댓글 1</span>
                      <div className="like-container">
                        <span className="heart-icon">♥</span> 12
                      </div>
                    </li>
                    <li className="comment-item">
                      <span>댓글 2</span>
                      <div className="like-container">
                        <span className="heart-icon">♥</span> 8
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="subject-card">
                  <h4>컴퓨터 프로그래밍 II</h4>
                  <ul>
                    <li className="comment-item">
                      <span>댓글 1</span>
                      <div className="like-container">
                        <span className="heart-icon">♥</span> 24
                      </div>
                    </li>
                    <li className="comment-item">
                      <span>댓글 2</span>
                      <div className="like-container">
                        <span className="heart-icon">♥</span> 15
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="postrequisite-subjects">
                <h3>후이수 과목</h3>
                <div className="subject-card">
                  <h4>알고리즘</h4>
                  <ul>
                    <li className="comment-item">
                      <span>댓글 1</span>
                      <div className="like-container">
                        <span className="heart-icon">♥</span> 45
                      </div>
                    </li>
                    <li className="comment-item">
                      <span>댓글 2</span>
                      <div className="like-container">
                        <span className="heart-icon">♥</span> 30
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;