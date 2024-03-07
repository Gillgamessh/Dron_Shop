import React , { useState, useEffect } from 'react';
import "./style/Card.css";
import Card from "./Card";
const altStyles = ['batman', 'blackpanter', 'arthur', 'kashima'];

function App() {
  const [cardsData, setCardsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5114/api/Drones/GetDroneModels');
        const data = await response.json();
        setCardsData(data);
      } catch (error) {
        console.error('Error get data:', error);
      }
    };

    fetchData();
  }, []); 

  return (
    <div className="container">
      <div className="row">
        {cardsData.map((card, index) => (
          <Card
            key={index}
            id ={card.ModelId}
            title={card.ModelName}
            Price={card.Price} 
            alt={altStyles[index % altStyles.length]}
            exp_date={card.Description} 
            Bytes={card.Bytes}
            FileExtension={card.FileExtension}
            Size={card.Size}
          />
        ))}
      </div>
    </div>
  );
}

export default App;