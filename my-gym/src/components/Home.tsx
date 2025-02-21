import { Link } from 'react-router-dom';
import {Outlet } from 'react-router-dom';
function Home() {
  return (
    <div>
      <h1>Welcome to my gym</h1>
      <p>Get fit with us</p>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/work">Work</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  );
}
export default Home;