import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { env } from '../env'
import { QRCodeCanvas } from "qrcode.react";
import background from '../bgimage.png'
import expo from '../expo.png'
import Confetti from 'react-confetti'

function MainPage() {

    const scrollVertical = {
        width: '350px',
        height: '580px',
        overflowX: 'scroll',
        overflowY: 'scroll'
    };

    const centerAlign = {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    };

    const containerStyle = {
        ...centerAlign,
        //backgroundColor: '#000',
        //height: '100vh',
    };

    const textContainerStyle = {
        ...centerAlign,
    };

    const textStyle = {
        color: '#ffffff',
        fontFamily: 'sans-serif',
        fontSize: '2.5em',
        textTransform: 'uppercase'
    };
    const subTextStyle = {
        color: '#ffffff',
        fontFamily: 'sans-serif',
        fontSize: '1.5em',
        //textTransform: 'uppercase'
    };

    const priceTextStyle = {
        color: 'yellow',
        fontFamily: 'sans-serif',
        fontSize: '1.5em',
        //textTransform: 'uppercase'
    };
    const smallTextStyle = {
        color: '#ffffff',
        fontFamily: 'sans-serif',
        fontSize: '1.0em',
        //textTransform: 'uppercase'
    };

    const divBackgroundStyle = {
        ...containerStyle,
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        width: "100vw",
        //height: "100vw",
    };

    const [players, setPlayers] = useState([]);
    const [merchant, setMerchant] = useState([]);

    const playerUrl = window.location.href + "player";

    const [temp, setTemp] = useState(0);

    const fetchPlayers = async () => {
        const result = await axios.get(env.REACT_APP_DATASOURCE_PLAYERS_LINK);
        setPlayers(await result.data);
    }

    const fetchMerchant = async () => {
        const result = await axios.get(env.REACT_APP_DATASOURCE_MERCHANT_LINK);

        if (await result.data.length !== 0) {
            //get latest row to use
            setMerchant(result.data[result.data.length - 1]);
        } else {
            console.log('Merchant is empty');
            setMerchant([]);
        }
    }

    useEffect(() => {
        setInterval(() => {
            setTemp((prevTemp) => prevTemp + 1)
        }, 1000)
    }, []);

    useEffect(() => {
        fetchPlayers();
    }, [temp]);

    useEffect(() => {
        fetchMerchant();
    }, [temp]);


    return (


        <div style={divBackgroundStyle}>

            <>{!merchant.status ? <Confetti
                size={5}
                shape="circle"
                wind={0}
                gravity={0.01}
                numberOfPieces={200}
            /> : null}</>

            <div class="container">
                <div class="row">
                    <div class="col">
                        <img src={expo} height="15" />
                    </div>
                    <div class="col-8">
                        <br></br>
                        <h1 style={textStyle}> S M Jahangir's Price is Right </h1>
                    </div>
                </div>
            </div>

            <div className='container mt-4'>
                <div className='row'>
                    <div className='col-lg-4 mb-4 text-center'>
                        <h1 style={subTextStyle}>{merchant.product}</h1>
                        <h1 style={priceTextStyle}>{merchant.status ? "" : `The Price is $ ${merchant.price}`}</h1>
                        <div className='product-item px-3 text-center'>
                            <img src={merchant.image} className="img-fluid" alt={merchant.product} />
                        </div>
                    </div>

                    <div className='col-lg-4 mb-4 text-center'>
                        <h1 style={subTextStyle}>Scan to Play</h1>
                        <h1 style={smallTextStyle}>{playerUrl}</h1>
                        <div class="text-center" style={{ height: "auto", margin: "0 auto", maxWidth: 256, width: "100%" }}>
                            <QRCodeCanvas
                                id="Your price is right"
                                size={256}
                                bgColor="#ffffff"
                                level={"H"}

                                value={playerUrl}
                                includeMargin='true'
                            />
                        </div>
                    </div>

                    <div className='col-lg-4 mb-4 text-left'>
                        <h1 class="text-center" style={subTextStyle}>Contestants</h1>
                        <h1 style={subTextStyle}>Charts Overview</h1>
                        <div className='table-responsive bg-white' style={scrollVertical}>
                            <table className='table table-responsive table-white table-hover'>
                                <thead>
                                    <tr>
                                        <td>#</td>
                                        <td>Name</td>
                                        <td>Price</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {players ? players.map((player, key) => <tr key={key} >
                                        <td>{key + 1}</td>
                                        <td>{player.name}</td>
                                        <td>{player.price}</td>
                                    </tr>)
                                        : 'No player'}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default MainPage
