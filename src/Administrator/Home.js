import React, { useState, useEffect } from 'react';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FixedSizeList } from 'react-window';
import { Form, Button } from 'react-bootstrap';
import AutoSizer from 'react-virtualized-auto-sizer';
import Swal from 'sweetalert2';

function Home() {
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [orders, setOrders] = useState([]);
  const [chartData, setChartData] = useState([]);

  const renderRow = ({ index, style, data }) => (
    <div style={{ ...style, display: "flex", alignItems: "center", borderBottom: "1px solid lightgrey" }}>
      <p>
        <Form.Label>Customer:</Form.Label> {data.orders[index].UserName}
      </p>
      <p>
        <Form.Label>Drone Model:</Form.Label> {data.orders[index].DroneModel}
      </p>
      <p>
        <Form.Label>Order Date:</Form.Label> {new Date(data.orders[index].OrderDate).toLocaleDateString()}
      </p>
      <p>
        <Form.Label>Total Price:</Form.Label> ${data.orders[index].TotalPrice}
      </p>
      <Button onClick={() => data.handleViewOrder(data.orders[index].OrderId)}>View</Button>
    </div>
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productCountResponse = await fetch('http://localhost:5114/api/Statistic/ModelCount');
        const orderCountResponse = await fetch('http://localhost:5114/api/Statistic/OrderCount');
        const customerCountResponse = await fetch('http://localhost:5114/api/Statistic/UserCount');

        const productCountData = await productCountResponse.json();
        const orderCountData = await orderCountResponse.json();
        const customerCountData = await customerCountResponse.json();

        setProductCount(productCountData || 0);
        setOrderCount(orderCountData || 0);
        setCustomerCount(customerCountData || 0);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5114/api/Statistic/GetOrders');
        if (response.ok) {
          const data = await response.json();
          setOrders(data);

          const monthlyData = data.reduce((acc, order) => {
            const orderDate = new Date(order.OrderDate);
            const month = orderDate.toLocaleString('default', { month: 'long' });

            if (!acc[month]) {
              acc[month] = 1;
            } else {
              acc[month]++;
            }

            return acc;
          }, {});

          const chartData = Object.keys(monthlyData).map((month) => ({
            month,
            orders: monthlyData[month],
          }));

          setChartData(chartData);
        } else {
          console.error('Error fetching orders:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching orders:', error.message);
      }
    };

    fetchOrders();
    fetchData();
  }, []);

  const handleViewOrder = (orderId) => {
    const order = orders.find((order) => order.OrderId === orderId);
    if (order) {
      Swal.fire({
        title: `Order ${orderId} Details`,
        html: `
          <p><strong>Customer:</strong> ${order.UserName}</p>
          <p><strong>Drone Model:</strong> ${order.DroneModel}</p>
          <p><strong>Camera:</strong> ${order.CameraName}</p>
          <p><strong>Battery:</strong> ${order.BatteryName}</p>
          <p><strong>Order Date:</strong> ${new Date(order.OrderDate).toLocaleDateString()}</p>
          <p><strong>Total Price:</strong> $${order.TotalPrice}</p>
        `,
        icon: 'info',
      });
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Order not found',
        icon: 'error',
      });
    }
  };

  return (
    <main className='main-container'>
      <div className='main-title'>
        <h3>DASHBOARD</h3>
      </div>
      <div className='main-cards'>
        <div className='card'>
          <div className='card-inner'>
            <h3>PRODUCTS</h3>
            <BsFillArchiveFill className='card_icon' />
          </div>
          <h1>{productCount}</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>ORDERS</h3>
            <BsFillGrid3X3GapFill className='card_icon' />
          </div>
          <h1>{orderCount}</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>CUSTOMERS</h3>
            <BsPeopleFill className='card_icon' />
          </div>
          <h1>{customerCount}</h1>
        </div>
      </div>
      <h3>Order</h3>
      <div className='charts' style={{ maxHeight: '450px', overflowY: 'auto' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AutoSizer>
            {({ height, width }) => (
              <FixedSizeList
                height={height}
                itemCount={orders.length}
                itemSize={100}
                width={width}
                itemData={{ orders, handleViewOrder }}
              >
                {renderRow}
              </FixedSizeList>
            )}
          </AutoSizer>
        </ResponsiveContainer><ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="orders" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
    </main>
  );
}

export default Home;