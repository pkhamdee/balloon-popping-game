import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import MainLayout from '../layouts/MainLayout';

function Merchant() {

  const toastOptions = {
    autoClose: 400,
    pauseOnHover: true,
  }

  const [players, setPlayers] = useState([]);
  const [merchant, setMerchant] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [temp, setTemp] = useState(0);

  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const fetchPlayers = async () => {
    const result = await axios.get(process.env.REACT_APP_DATASOURCE_PLAYERS_LINK);
    setPlayers(await result.data);
  }

  const fetchMerchant = async () => {
    const result = await axios.get(process.env.REACT_APP_DATASOURCE_MERCHANT_LINK);
    setMerchant(await result.data);
    setIsOpen(merchant.status);
  }

  useEffect(() => {
    merchant ? setIsOpen(merchant.status) : setIsOpen(false);
  },[merchant]);

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
  }, []);

  const centerAlign = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  };

  const containerStyle = {
    ...centerAlign,
    backgroundColor: '#fff',
    height: '100vh',
  };

  const setMerchantProduct = (e) => {
    setMerchant({
      ...merchant, product: e.target.value
    });
  }
  const setMerchantImage = (e) => {
    setMerchant({
      ...merchant, image: e.target.value
    });
  }
  const setMerchantPrice = (e) => {
    setMerchant({
      ...merchant, price: e.target.value
    });
  }
  const setMerchantHint = (e) => {
    setMerchant({
      ...merchant, hint: e.target.value
    });
  }

  const removePlayer = (player) => {
    axios.delete(`${process.env.REACT_APP_DATASOURCE_PLAYERS_LINK}/${player.id}`)
      .then(function (response) {
        console.log(response);
        toast(`Deleted ${player.id}`, toastOptions);
      })
      .catch(function (error) {
        console.log(error);
        toast(`Oops! Please try again.`, toastOptions);
      });

    fetchPlayers();
  }

  const updateMerchant = async (event) => {
    event.preventDefault();

    axios.put(process.env.REACT_APP_DATASOURCE_MERCHANT_LINK, {
      product: merchant.product,
      image: merchant.image,
      price: merchant.price,
      hint: merchant.hint,
      status: merchant.status
    })
      .then(function (response) {
        console.log(response);
        toast(`Updated ${merchant.product}`, toastOptions);
      })
      .catch(function (error) {
        console.log(error);
        toast(`Oops! Please try again.`, toastOptions);
      });
  }


  const startGame = async (event) => {
    event.preventDefault();

    axios.put(process.env.REACT_APP_DATASOURCE_MERCHANT_LINK, {
      status: true,
      product: merchant.product,
      image: merchant.image,
      price: merchant.price,
      hint: merchant.hint
    })
      .then(function (response) {
        setIsOpen(true);
        toast(`Game started`, toastOptions);
      })
      .catch(function (error) {
        toast(`Oops! Please try again.`, toastOptions);
      });

     fetchMerchant();
     forceUpdate();
  }


  const endGame = async (event) => {
    event.preventDefault();

    //update merchant status
    axios.put(process.env.REACT_APP_DATASOURCE_MERCHANT_LINK, {
      status: false,
      product: merchant.product,
      image: merchant.image,
      price: merchant.price,
      hint: merchant.hint
    })
      .then(function (response) {
        setIsOpen(false);
        toast(`Merchandise status updated!`, toastOptions);
      })
      .catch(function (error) {
        toast(`Oops! Please try again.`, toastOptions);
      });
    fetchMerchant();

    if (players && players.length > 0) {

      //filter winner
      const closest = players.reduce(function (prev, curr) {
        return (Math.abs(curr.price - merchant.price) < Math.abs(prev.price - merchant.price) ? curr : prev);
      });

      const filterPlayer = players.filter(player => player.price !== closest.price);
      filterPlayer.map((filter) => {
        axios.delete(`${process.env.REACT_APP_DATASOURCE_PLAYERS_LINK}/${filter.id}`)
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
            toast(`Oops! Please try again.`, toastOptions);
          });
      }
      );

      fetchPlayers();
      toast(`Found Winner`, toastOptions);

    } else {
      toast(`No player found`, toastOptions);
    }

    forceUpdate();
  }

  return (
    <MainLayout>

      <div className='row'>
        <div className='col-lg-6 mb-4'>
          <div className='px-3 text-left'>
            <h2 className='px-2 text-black'>Merchandise</h2>
            <div className='item px-3 text-lelf'>
              <img src={merchant.image} className="img-fluid" alt={merchant.product} />
            </div>
            <form onSubmit={updateMerchant}>
              Product <input type="text" value={merchant ? merchant.product : ""} size="30" onChange={setMerchantProduct} /> <br></br>
              Image URL <input type="text" value={merchant ? merchant.image : ""} size="30" onChange={setMerchantImage} /> <br></br>
              Price <input type="text" value={merchant ? merchant.price : ""} onChange={setMerchantPrice} /> <br></br>
              <span className="red-text">Hint</span> <input type="text" value={merchant ? merchant.hint : ""} size="30" onChange={setMerchantHint} /> <br></br>
              Game status : {isOpen ? <span className="green-text">Started</span> : <span className="red-text">Ended</span>}
              <br></br><br></br>
              <button className='btn btn-primary btn-sm' type="submit"> Update </button>
              &nbsp; &nbsp; &nbsp;
              <button className='btn btn-primary btn-sm' onClick={startGame}> Start Game </button>
              &nbsp; &nbsp; &nbsp;
              <button className='btn btn-danger btn-sm' onClick={endGame}> End Game </button>
            </form>
          </div>
          <br></br>
        </div>

        <div className='col-lg-4 mb-4 text-left'>
          <h2 className='px-2 text-back'>Player</h2>
          <div className='table-responsive bg-white'>
            <table className='table table-responsive table-white table-hover'>
              <thead>
                <tr>
                  <td>#</td>
                  <td>Name</td>
                  <td>Price</td>
                  <td></td>
                </tr>
              </thead>
              <tbody>
                {players ? players.map((player, key) => <tr key={key} >
                  <td>{player.id}</td>
                  <td>{player.name}</td>
                  <td>{player.price}</td>
                  <td>
                    <button className='btn btn-danger btn-sm' onClick={() => removePlayer(player)}>Remove</button>
                  </td>
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

export default Merchant
