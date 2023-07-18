import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import MainLayout from '../layouts/MainLayout';

function Player() {

  const toastOptions = {
    autoClose: 400,
    pauseOnHover: true,
  }

  const [players, setPlayers] = useState([]);
  const [merchant, setMerchant] = useState([]);
  const [playerId, setPlayerId] = useState(0);

  //reload
  const [temp, setTemp] = useState(0);

  //input field
  const [price, setPrice] = useState(0);
  const [playerName, setPlayerName] = useState("");

  const fetchPlayers = async () => {
    const result = await axios.get(process.env.REACT_APP_DATASOURCE_PLAYERS_LINK);
    setPlayers(await result.data);
  }

  const fetchMerchant = async () => {
    const result = await axios.get(process.env.REACT_APP_DATASOURCE_MERCHANT_LINK);
    setMerchant(await result.data);
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

    if(playerName.trim() !== ""){

      if(playerId > 0) {
        //update
        axios.put(`${process.env.REACT_APP_DATASOURCE_PLAYERS_LINK}/${playerId}`, {
          id: playerId, 
          name: playerName, 
          price: price
      }
      )
        .then(function (response) {
          console.log(response);
          toast(`Updated ${playerName}`, toastOptions);
        })
        .catch(function (error) {
          console.log(error);
          toast(`Oops! Please try again or refresh browser`, toastOptions);
        });
  
  
      } else {
        //add
  
        //find name in players
        //check if the adding product exist
        let findNameInPlayers = await players.find(i => {
          return i.name.toLowerCase() === playerName.toLowerCase()
        });
  
        if(!findNameInPlayers) {
          fetchPlayers();
          let newPlayerId = 1;
          if (players.length > 0) {
            newPlayerId = Math.max.apply(null, players.map(function (o) { return o.id; })) + 1;
          } 

          axios.post(process.env.REACT_APP_DATASOURCE_PLAYERS_LINK, {
            id: newPlayerId,
            name: playerName,
            price: price
          }).then(function (response) {
            setPlayerId(newPlayerId);
            toast(`Added ${playerName} to Game`, toastOptions);
          })
          .catch(function (error) {
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
        <div className='col-lg-6 mb-4'>
          <div className='px-3 text-left'>
            <h2 className='px-2 text-black'>Player</h2>
            <div className='item px-3 text-lelf'>
              <img src={merchant.image} className="img-fluid" alt={merchant.product} />
            </div>
            <b>Product</b> {merchant ? merchant.product : ""} <br></br>
            <b><span className="red-text">Hint</span></b> {merchant ? merchant.hint : ""} <br></br><br></br>
            <form onSubmit={handleSubmit}>
              What's is your name ?
              <input type="text" onChange={(e) => setPlayerName(e.target.value)} value={playerName} /> <br></br>
              How much do things really cost?
              <input style={{ width: '80px' }} type="number" onChange={(e) => setPrice(e.target.value.replace(/\+|-/ig, ''))} value={price} /> <br></br><br></br>
              <button className='btn btn-primary btn-sm' type="submit" > Send </button>
            </form>
          </div>
        </div>

        <div className='col-lg-4 mb-4 text-left'>
          <h2 className='px-2 text-back'>Charts Overview</h2>
          <div className='table-responsive bg-white'>
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
                  <td>{player.id}</td>
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
