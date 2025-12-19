/* import { NavLink } from 'react-router-dom' */
import DiagramCS from "./diagram-cs";
import Header from "../components/Header";
import { useState } from "react";
import Modal from "../components/Modal";

function CoursemapCS() {
  const [isModalOpen, setIsModalOpen] = useState('');

  return (
    <div className="container">
      <Header />
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90vw',
        height: '70px',
        color: 'black',
        backgroundColor: '#f1f1f1',
        padding: '1rem 2rem',
        boxSizing: 'border-box',
        margin: '35px 5vw 0 5vw'
      }}>
        <div className="title">컴퓨터학과</div>
      </div>
      <div style={{
        width: '90vw',
        height: '1000px',
        boxSizing: 'border-box',
        margin: '0 5vw 0 5vw',
        border: '1px solid #cfcfcf'
      }}>
        <DiagramCS setIsModalOpen={setIsModalOpen} />
      </div>
      <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
    );
}

export default CoursemapCS