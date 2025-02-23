import { Link, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import "./Home.css"; // Import regular CSS

function Home() {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div>
      <div className="Container">
        <form>
          <button
            className="homeButtonItem"
            type="button"
            onClick={() => navigate("/RenewSubscription")}
          >
            تجديد الأشتراك
          </button>

          <button
            className="homeButtonItem"
            type="button"
            onClick={() => navigate("/NewSubscription")}
          >
            إشتراك جديد
          </button>

          <br/><br/>
          <input className="homeInputItem" type="text" placeholder="بحث عن لاعب " />
        </form>
      </div>
      <Outlet />
    </div>
  );
}

export default Home;
