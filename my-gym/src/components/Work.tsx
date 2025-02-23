import { Outlet } from "react-router-dom";
function Work () {
const electron = (window as any).electron;
const homeDir = electron?.homeDir?.() || "Not available";

console.log(homeDir);
    return (
        <div>
            asd
            <a href="https://www.youtube.com/watch?v=2J2t7Nzr4yQ">Workout plan for u !</a>
            <br/>
            <Outlet />
            <ul>
                <li>
                    <a href="#">Home Directory: </a>
                </li>
                <li>
                    <a href="#">OS Version: </a>
                </li>
            </ul>
        </div>
    )
}
export default Work;