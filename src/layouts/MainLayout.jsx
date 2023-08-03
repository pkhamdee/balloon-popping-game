import React from 'react';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";

function MainLayout({ children }) {
    return (
        <div>
            <header>
            <div className="flexGrow">
                <Link to="/">Home Screen</Link>
            </div>
            </header>
            <main>
                <div className='container mt-3'>
                    {children}
                </div>
                <ToastContainer/>
            </main>
        </div>
    )
}

export default MainLayout
