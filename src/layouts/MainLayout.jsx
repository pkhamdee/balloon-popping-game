import React from 'react';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import background from '../bgimage.png'
import expo from '../expo.png'

function MainLayout({ children }) {

    const divBackgroundStyle = {
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover', 
        width: "100vw",
        //height: "100vh",
      };

    return (
        <div style={divBackgroundStyle}>
            <header>
            <div className="flexGrow">
                <img src={expo} height="15" alt='explore'/>
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
