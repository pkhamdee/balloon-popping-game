import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import MainLayout from '../layouts/MainLayout';
import { env } from '../env'

function Merchant() {

  const scrollVertical = {
    width: '350px',
    height: '600px',
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
    backgroundColor: '#fff',
    height: '100vh',
  };

  const toastOptions = {
    autoClose: 1000,
    pauseOnHover: true,
  }

  const [players, setPlayers] = useState([]);
  const [merchant, setMerchant] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [temp, setTemp] = useState(0);

  //const [updateState] = React.useState();
  //const forceUpdate = React.useCallback(() => updateState({}), []);

  const fetchPlayers = async () => {
    const result = await axios.get(env.REACT_APP_DATASOURCE_PLAYERS_LINK);
    setPlayers(await result.data);
  }

  const fetchMerchant = async () => {
    const result = await axios.get(env.REACT_APP_DATASOURCE_MERCHANT_LINK);
    if(result.data.length !== 0 ){
      setMerchant(result.data[result.data.length-1]);
      setIsOpen(merchant.status);
    } else {
      console.log('Merchant is empty');
      setMerchant([]);
    }
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
      ...merchant, price: Number(e.target.value)
    });
  }
  const setMerchantHint = (e) => {
    setMerchant({
      ...merchant, hint: e.target.value
    });
  }

  const removePlayer = (player) => {
    axios.delete(`${env.REACT_APP_DATASOURCE_PLAYERS_LINK}/${player.id}`)
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

    axios.patch(`${env.REACT_APP_DATASOURCE_MERCHANT_LINK}/${merchant.id}`, {
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

    axios.patch(`${env.REACT_APP_DATASOURCE_MERCHANT_LINK}/${merchant.id}`, {
      status: true,
      product: merchant.product,
      image: merchant.image,
      price: merchant.price,
      hint: merchant.hint
    }).then(function (response) {
      setIsOpen(true);
      toast(`Game started`, toastOptions);
    }).catch(function (error) {
      toast(`Oops! Please try again.`, toastOptions);
    });


    players.map((filter) => {
      axios.delete(`${env.REACT_APP_DATASOURCE_PLAYERS_LINK}/${filter.id}`)
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
          toast(`Oops! Please try again.`, toastOptions);
        });
    }
    );

    fetchMerchant();
  }

  const endGame = async (event) => {
    event.preventDefault();

    //update merchant status
    axios.patch(`${env.REACT_APP_DATASOURCE_MERCHANT_LINK}/${merchant.id}`, {
      status: false,
      product: merchant.product,
      image: merchant.image,
      price: merchant.price,
      hint: merchant.hint
    }).then(function (response) {
      setIsOpen(false);
      toast(`Merchandise status updated!`, toastOptions);
    }).catch(function (error) {
      toast(`Oops! Please try again.`, toastOptions);
    });

    fetchMerchant();

    if (players && players.length > 0) {

      //filter winner
      const closest1 = players.reduce(function (prev, curr) {
        return (Math.abs(curr.price - merchant.price) <= Math.abs(prev.price - merchant.price) ? curr : prev);
      });

      const filterPlayer = players.filter(player => player.price !== closest1.price);
      const closest2 = filterPlayer.reduce(function (prev, curr) {
        return (Math.abs(curr.price - merchant.price) <= Math.abs(prev.price - merchant.price) ? curr : prev);
      });

      var loseGame = [];

      if(Math.abs(closest1.price - merchant.price) < Math.abs(closest2.price - merchant.price)) {
        //keep closest1
         loseGame = players.filter(player => player.price !== closest1.price);
      } else if(Math.abs(closest1.price - merchant.price) === Math.abs(closest2.price - merchant.price)) {
        //keep both
         loseGame = players.filter(player => player.price !== closest1.price && player.price !== closest2.price );
      } else {
        //keep closest2
         loseGame = players.filter(player => player.price !== closest2.price);
      } 

      loseGame.map((filter) => {
        axios.delete(`${env.REACT_APP_DATASOURCE_PLAYERS_LINK}/${filter.id}`)
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

    //forceUpdate();
  }

  return (
    <MainLayout>
      <div className='row'>
        <div className='col-lg-5 mb-4'>
          <div className='px-3 text-left text-black'>
            <h2 className='px-2 text-white'>Merchandise</h2>
            <div className='item px-3 text-lelf'>
              <img src={merchant.image} className="img-fluid" alt={merchant.product} />
            </div>
            <form onSubmit={updateMerchant}>
              Product <input type="text" value={merchant ? merchant.product : ""} size="30" onChange={setMerchantProduct} /> <br></br>
              Image URL <input type="text" value={merchant ? merchant.image : ""} size="30" onChange={setMerchantImage} /> <br></br>
              Price <input type="text" value={merchant ? merchant.price : ""} onChange={setMerchantPrice} /> <br></br>
              <span className="red-text">Hint</span> <input type="text" value={merchant ? merchant.hint : ""} size="30" onChange={setMerchantHint} /> <br></br>
              Game status : {isOpen ? <span className="green-text bg-warning">Started</span> : <span className="red-text bg-warning">Ended</span>}
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
          <div className='table-responsive bg-white' style={scrollVertical}>
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
                  <td>{key+1}</td>
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
