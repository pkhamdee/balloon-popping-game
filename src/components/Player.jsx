import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import MainLayout from '../layouts/MainLayout';
import { env } from '../env';

function Player() {

  const scrollVertical = {
    width: '350px',
    height: '500px',
    overflowX: 'scroll',
    overflowY: 'scroll'
};

  const toastOptions = {
    autoClose: 1000,
    pauseOnHover: true,
  }

  const [players, setPlayers] = useState([]);
  const [merchant, setMerchant] = useState([]);
  const [playerId, setPlayerId] = useState(0);

  //reload
  const [temp, setTemp] = useState(0);

  const [price, setPrice] = useState(0);
  const [playerName, setPlayerName] = useState("");

  const fetchPlayers = async () => {
    const result = await axios.get(env.REACT_APP_DATASOURCE_PLAYERS_LINK);
    setPlayers(await result.data);
  }

  const fetchMerchant = async () => {
    const result = await axios.get(env.REACT_APP_DATASOURCE_MERCHANT_LINK);
    //if many, get last record
    if (result.data.length !== 0) {
      setMerchant(result.data[result.data.length - 1]);
    } else {
      console.log('Merchant is empty');
      setMerchant([]);
    }
  }

  useEffect(() => {
    setInterval(() => {
      setTemp((prevTemp) => prevTemp + 1)
    }, 2000)
  }, []);

  useEffect(() => {
    fetchPlayers();
  }, [temp]);

  useEffect(() => {
    fetchMerchant();
  }, [temp]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (playerName.trim() !== "") {

      //used to add before, it is update case
      if (playerId > 0) {

        axios.patch(`${env.REACT_APP_DATASOURCE_PLAYERS_LINK}/${playerId}`, {
          name: playerName.trim(),
          price: Number(price)
        }).then(function (response) {
          toast(`${playerName}, Thank you for submitting your price ${price}`, toastOptions);
        }).catch(function (error) {
          console.log(error);
          toast(`Oops! Please try again or refresh browser`, toastOptions);
        });

      } else {
        //add
        //find name in players and check if the adding name is exist
        let findNameInPlayers = await players.find(i => {
          return i.name.toLowerCase() === playerName.toLowerCase()
        });

        if (!findNameInPlayers) {
          //add new player
          axios.post(env.REACT_APP_DATASOURCE_PLAYERS_LINK, {
            name: playerName.trim(),
            price: Number(price)
          }).then(function (response) {
            setPlayerId(response.data.id);
            toast(`${playerName}, Thank you for submitting your price ${price}`, toastOptions);
          }).catch(function (error) {
            console.log(error);
            toast(`Oops! Please try again.`, toastOptions);
          });

        } else {
          toast(`Oops! Name already in use.`, toastOptions);
        }
      }

      fetchPlayers();
    } else {
      toast(`Oops! Names can't be empty`, toastOptions);
    }

  }

  return (
    <MainLayout>
      <div className='row'>
        <div className='col-lg-5 mb-4'>
          <div className='px-3 text-left text-white'>
            <h2 className='px-2 text-white'>Player</h2>
            <div className='item px-3 text-lelf'>
              <img src={merchant.image} className="img-fluid" alt={merchant.product} />
            </div>
            <b>Product</b> {merchant ? merchant.product : ""} <br></br>
            <b><span className="yellow-text">Hint</span></b> {merchant ? merchant.hint : ""} <br></br><br></br>
            <form onSubmit={handleSubmit}>
              What's is your name ?
              <input type="text" onChange={(e) => setPlayerName(e.target.value)} value={playerName} /> <br></br>
              How much do things really cost?
              <input style={{ width: '80px' }} type="number" onChange={(e) => setPrice(e.target.value.replace(/\+|-/ig, ''))} value={price} /> <br></br><br></br>
              <button className='btn btn-primary btn-sm' type="submit" disabled={!merchant.status}> Send </button>
            </form>
          </div>
        </div>

        <div className='col-lg-4 mb-4 text-left'>
          <h2 className='px-2 text-white'>Charts Overview</h2>
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
                  <td>{key+1}</td>
                  <td>{player.name}</td>
                  <td>{player.price}</td>
                </tr>)
                  : 'No player'}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default Player
