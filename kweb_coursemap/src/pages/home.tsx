import { NavLink } from 'react-router-dom'
import './home.css'
import Header from "../components/Header";

function Home() {
    return (
      <div className="container">
        <Header />
        <div className="main">
          <NavLink to="/coursemap/cs" className="department">컴퓨터학과</NavLink>
          <NavLink to="/coursemap/ds" className="department">데이터과학과</NavLink>
          <NavLink to="/" className="department"></NavLink>
        </div>
      </div>
    );
}

export default Home