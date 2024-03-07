import React, { useState, useEffect } from 'react';
import { Link, useLocation , useHistory} from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';

const OrderPage = () => {
  const location = useLocation();
  const { state } = location;
  const { id, title, Price, exp_date } = state;
  const [cameras, setCameras] = useState([]);
  const [batteries, setBatteries] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [selectedBattery, setSelectedBattery] = useState(null);
  const [droneCount, setDroneCount] = useState(1);
  const savedUserEmail = localStorage.getItem('userEmail');
  const history = useHistory();
  
  const calculateTotalPrice = () => {
    let totalPrice = 0;

    if (selectedCamera) {
      totalPrice += selectedCamera.Price;
    }

    if (selectedBattery) {
      totalPrice += selectedBattery.Price;
    }

    return (totalPrice + Price) * droneCount;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const camerasResponse = await fetch(`http://localhost:5114/api/Users/GetCamerasById/${id}`);
        const batteriesResponse = await fetch(`http://localhost:5114/api/Users/GetBatteriesById/${id}`);

        if (camerasResponse.ok ) {
          const camerasData = await camerasResponse.json(); 
          setCameras(camerasData);  
        }
        if(batteriesResponse.ok){
           const batteriesData = await batteriesResponse.json();
           setBatteries(batteriesData);
        } else {
          console.error('Error fetching cameras or batteries');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleOrder = async () => {
    try {
      const totalPrice = calculateTotalPrice();
      const orderData = {
        modelId: id, 
        cameraId: selectedCamera.CameraId, 
        batteryId: selectedBattery.BatteryId,
        counter: droneCount,
        totalPrice: totalPrice,
        userEmail:savedUserEmail,

      };
  
      const response = await fetch('http://localhost:5114/api/Users/PlaceOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
  
      if (response.ok) {
        const result = await response.text();
        history.push({
          pathname: '/User/Product',
        });
        Swal.fire({
          icon: 'success',
          title: 'Order Placed Successfully. Thanks for sale!!!',
          text: result,
        });
      } else {
        const errorData = await response.text();
        Swal.fire({
          icon: 'error',
          title: 'Error Placing Order',
          text: errorData.error || response.statusText,
        });
      }
    } catch (error) {
      console.error('Error:', error);
  
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An unexpected error occurred.',
      });
    }
  };

  return (
    <div style={{ display: 'block', width: 700, padding: 30 }} className="form_new">
      <h1>Order: {title}</h1>
      <Form>
        <Form.Group controlId="cameraSelect">
          <Form.Label>Select Camera:</Form.Label>
          <Form.Control as="select" onChange={(e) => setSelectedCamera(cameras.find(c => c.CameraId === parseInt(e.target.value)))}>
            <option value={null}>Select Camera</option>
            {cameras.map((camera) => (
              <option key={camera.CameraId} value={camera.CameraId}>
                {camera.CameraName} {' $' + camera.Price}
              </option>
            ))}
          </Form.Control>
          {selectedCamera && (
            <Form.Group controlId="cameraDescription">
              <Form.Label>Description:</Form.Label>
              <Form.Control as="textarea" rows={1} value={selectedCamera.Description} readOnly />
            </Form.Group>
          )}
        </Form.Group>

        <Form.Group controlId="batterySelect">
          <Form.Label>Select Battery:</Form.Label>
          <Form.Control as="select" onChange={(e) => setSelectedBattery(batteries.find(b => b.BatteryId === parseInt(e.target.value)))}>
            <option value={null}>Select Battery</option>
            {batteries.map((battery) => (
              <option key={battery.BatteryId} value={battery.BatteryId}>
                {battery.BatteryName}{' $' + battery.Price}
              </option>
            ))}
          </Form.Control>
          {selectedBattery && (
            <Form.Group controlId="batteryDescription">
              <Form.Label>Description:</Form.Label>
              <Form.Control as="textarea" rows={1} value={selectedBattery.Description} readOnly />
            </Form.Group>
          )}
        </Form.Group>

        <Form.Group controlId="droneCount">
          <Form.Label>Number of Drones:</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter number of drones"
            value={droneCount}
            onChange={(e) => setDroneCount(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="button" onClick={handleOrder}>
          Order
        </Button>
        <Form.Group controlId="totalPrice">
          <Form.Label>Total Price:</Form.Label>
          <Form.Control type="text" value={`$${calculateTotalPrice()}`} readOnly />
        </Form.Group>
      </Form>
    </div>
  );
};

export default OrderPage;