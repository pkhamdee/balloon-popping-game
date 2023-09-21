import React from 'react';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";
import background from '../bgimage.png'

function MainLayout({ children }) {

    const divBackgroundStyle = {
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover', 
        width: "100vw",
        height: "100vh",
      };

    return (
        <div style={divBackgroundStyle}>
            <header>
            <div className="flexGrow">
                <Link to="/">Home Screen</Link>
            </div>
            </header>
            <main>
                <div className='container mt-3 text-white'>
                    {children}
                </div>
                <ToastContainer/>
            </main>
        </div>
    )
}

export default MainLayout
