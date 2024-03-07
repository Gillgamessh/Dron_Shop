import React, { useState } from 'react';
import { Link , useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import { useAuth } from '../AuthContext';

export default function Card(props) {
  const [selected, setSelected] = useState(false);
  const history = useHistory();  
  const { user } = useAuth();  
  const toggleSelection = () => {
    setSelected(!selected);
  };

  let CardName = `color_bg ${props.alt}`;
  let { id, title, Price, exp_date, Bytes, FileExtension, Size } = props;
  const imageSrc = `data:image/${FileExtension};base64,${Bytes}`;
  const handleOrderClick =  () => {
    if (user) {
      history.push({
        pathname: '/User/Order',
        state: {
          id: id,
          title: title,
          Price: Price,
          exp_date: exp_date,
        },
      });
    } else {
        history.push({
          pathname: '/User/Login',
        });

        Swal.fire({
          icon: 'error',
          title: 'Unauthorized Access',
          text: 'You need to be logged in to place an order.',
        });
    }
  };
  return (
    <div className={`wrapper ${selected ? 'selected' : ''}`} onClick={toggleSelection}>
      <div className={CardName}></div>
      <div className="card_img" style={{ "backgroundImage": `url(${imageSrc})` }}></div>
      <div className="cardInfo">
        <h1>{title}</h1>
        <p className="date_">{exp_date}</p>
        <div className="action">
          <div className="priceGroup">
            <p className="price newPrice">${Price}</p>
          </div>
          <Link onClick={ handleOrderClick}>
            <div className={`cart ${selected ? 'selected' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                <path d="M2 6h10l10 40h32l8-24H16"></path>
                <circle cx="23" cy="54" r="4"></circle>
                <circle cx="49" cy="54" r="4"></circle>
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}