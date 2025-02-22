import { Outlet } from "react-router-dom";
import yup from 'yup';
export function Form() {
    const ipcRenderer = (window as any).ipcRenderer;
    return (
        <div>
            <form  onSubmit={(e) => {
                e.preventDefault();
                console.log(new FormData(e.target as HTMLFormElement).get("name"));
                ipcRenderer.send('name', new FormData(e.target as HTMLFormElement).get("name"));
            }}>
                <input type="text" name="name" placeholder="Enter your name" required/>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
    }