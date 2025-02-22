import { Link } from 'react-router-dom';
import {Outlet } from 'react-router-dom';
import {Form} from './Form';
function Home() {
  return (
    <div>
      <img src='' alt =''/>
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