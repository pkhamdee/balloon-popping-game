import React, { useState, useEffect } from 'react';
import { StyledBalloon } from './Balloon.styles';
import { random, randomColor } from './utils';
import mojs from "@mojs/core";
import axios from 'axios';
import soundbible from './soundbible.mp3'
import { env } from './env'
import QRCode from "react-qr-code";

function Balloon() {

    const [players, setPlayers] = useState([]);
    const [merchant, setMerchant] = useState([]);

    const from = window.location.href+"player";

    const [temp, setTemp] = useState(0);

    const fetchPlayers = async () => {
        const result = await axios.get(env.REACT_APP_DATASOURCE_PLAYERS_LINK);
        setPlayers(await result.data);
    }

    const fetchMerchant = async () => {
        const result = await axios.get(env.REACT_APP_DATASOURCE_MERCHANT_LINK);

        if (await result.data.length !== 0) {
            setMerchant(result.data[result.data.length - 1]);
        } else {
            console.log('Merchant is empty');
            setMerchant([]);
        }
    }

    const colors = ['yellow', 'green', 'blue', 'red', 'orange', 'purple'];
    const popVolumeLevel = 0.2;
    const loop = false;
    const hangOnTop = true;
    const supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;

    const centerAlign = {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    };

    const containerStyle = {
        ...centerAlign,
        backgroundColor: '#000',
        height: '100vh',
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
        textTransform: 'uppercase'
    };

    const priceTextStyle = {
        color: 'yellow',
        fontFamily: 'sans-serif',
        fontSize: '1.5em',
        textTransform: 'uppercase'
    };

    useEffect(() => {
        setInterval(() => {
            setTemp((prevTemp) => prevTemp + 1)
        }, 15000)
    }, []);

    useEffect(() => {
        fetchPlayers();
    }, [temp]);

    useEffect(() => {
        fetchMerchant();
    }, [temp]);

    const delay = random(0, 4);
    //const hasMsg = random(0, 2);
    const duration = 10 + random(1, 5);
    const left = random(10, 70); // random init left value to fly
    const [show, setShow] = useState(true);
    const [visible, setVisible] = useState(true);

    const popBalloon = (e) => {

        const audio = new Audio(soundbible);
        audio.volume = popVolumeLevel;

        let t = e.currentTarget;
        let color = t.getAttribute('color');
        const burst = new mojs.Burst({
            radius: { 30: 100 },
            parent: t,
            count: 10,
            className: 'show',
            children: {
                fill: [color],
                angle: { 0: 180 },
                delay: 'stagger(0, 25)',
                shape: ['circle', 'polygon'],
            }
        });
        audio.play();
        burst.replay();
        // setVisible(false)
        t.style.visibility = 'hidden';
        setTimeout(() => {
            setShow(false)
        }, 2000);
    };

    return (

        <div style={containerStyle}>

            <div style={textContainerStyle}>
                <h1 style={textStyle}> The Price is Right </h1>
                <h1 style={priceTextStyle}>{merchant.status ? "" : `The Price is $ ${merchant.price}`}</h1>
                <br></br>
                <div className='product-item px-3 text-center'>
                    <img src={merchant.image} className="img-fluid" alt={merchant.product} />
                </div>
                <br></br>
                <br></br>
                <h1 style={subTextStyle}> Scan to play..</h1>
                <div class="text-center" style={{ height: "auto", margin: "0 auto", maxWidth: 200, width: "100%" }}>
                    <QRCode
                        size={256}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        value={from}
                        viewBox={`0 0 256 256`}
                    />
                </div>
            </div>

            <div id='portal-balloons'>
                <div className="set-of-balloons">

                    {players.map((player) => (

                        <StyledBalloon
                            color={randomColor(colors)}
                            onClick={supportsTouch ? popBalloon : null}
                            onDoubleClickCapture={supportsTouch ? null : popBalloon}
                            animate={{
                                delay,
                                duration,
                                rotate: random(20, 25),
                                left,
                                loop,
                                hangOnTop,
                            }}
                            show={show}
                            visible={visible}
                        >
                            <div className="string"></div>
                            <span className="msg">{player.name} - {player.price} $</span>

                        </StyledBalloon>

                    ))}

                </div>
            </div>
        </div>
    )
}

export default Balloon
