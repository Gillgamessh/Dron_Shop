import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

const App = () => {
  const [formData, setFormData] = useState({
    modelName: '',
    description: '',
    price: 0,
    bytes: '',
    fileExtension: '',
    size: 0,
  });

  const [availableModels, setAvailableModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [batteries, setBatteries] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData({
        ...formData,
        bytes: reader.result.split(',')[1],
        fileExtension: file.name.split('.').pop(),
        size: file.size,
      });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleCameraChange = (index, e) => {
    const updatedCameras = [...cameras];
    updatedCameras[index] = {
      ...updatedCameras[index],
      [e.target.name]: e.target.value,
    };
    setCameras(updatedCameras);
  };
  
  const handleBatteryChange = (index, e) => {
    const updatedBatteries = [...batteries];
    updatedBatteries[index] = {
      ...updatedBatteries[index],
      [e.target.name]: e.target.value,
    };
    setBatteries(updatedBatteries);
  };
  const addModel = async (evt) => {
    evt.preventDefault();

    try {
      const response = await fetch('http://localhost:5114/api/Drones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          modelName: formData.modelName,
          description: formData.description,
          price: parseFloat(formData.price),
          bytes: formData.bytes,
          fileExtension: formData.fileExtension,
          size: parseFloat(formData.size),
        }),
      });

      if (response.ok) {
        const modelData = await response.json();
        showSuccessAlert('Model added successfully!');
        addCamerasAndBatteries(modelData.modelId);

      } else {
        console.error('Error:', response.statusText);
        showErrorAlert('Something went wrong while adding the model. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      showErrorAlert('Something went wrong. Please try again.');
    }
  };

  const addCamerasAndBatteries = async () => {
    try {
      if (cameras.length === 0 && batteries.length === 0) {
        showErrorAlert('You don`t add info');
        return;
      }
      if (cameras.length > 0) {
      const cameraResponses = await Promise.all(
        cameras.map((camera) => {
          console.log('Sending camera data:', camera);
          return fetch('http://localhost:5114/api/Drones/AddCamera', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...camera,
            }),
          });
        })
      );
      }
      if (batteries.length > 0) {
      const batteryResponses = await Promise.all(
        batteries.map((battery) => {
          console.log('Sending battery data:', battery);
          return fetch('http://localhost:5114/api/Drones/AddBattery', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...battery,
            }),
          });
        })
      );
      }
  
  
      resetForm();
      resetCamerasAndBatteries();
  
      showSuccessAlert('Cameras and batteries have been added successfully. Thanks!');
    } catch (error) {
      console.error('Error:', error);
      showErrorAlert('Something went wrong while adding cameras and batteries. Please try again.');
    }
  };

  const deleteCamera = (index) => {
    const updatedCameras = [...cameras];
    updatedCameras.splice(index, 1);
    setCameras(updatedCameras);
  };

  const deleteBattery = (index) => {
    const updatedBatteries = [...batteries];
    updatedBatteries.splice(index, 1);
    setBatteries(updatedBatteries);
  };

  const addCamera = () => {
  setCameras([...cameras, { cameraName: '', modelId: selectedModel?.ModelId || 0, description: '', price: 0 }]);
};

const addBattery = () => {
  setBatteries([...batteries, { batteryName: '', modelId: selectedModel?.ModelId || 0, description: '', price: 0 }]);
};
  const resetForm = () => {
    setFormData({
      modelName: '',
      description: '',
      price: 0,
      bytes: '',
      fileExtension: '',
      size: 0,
    });
  };

  const resetCamerasAndBatteries = () => {
    setCameras([]);
    setBatteries([]);
  };

  const showSuccessAlert = (message) => {
    Swal.fire({
      title: 'Success!',
      text: message,
      type: 'success',
    });
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      title: 'Error!',
      text: message,
      type: 'error',
    });
  };

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('http://localhost:5114/api/Drones/GetDroneModels');
        if (response.ok) {
          const models = await response.json();
          setAvailableModels(models);
        } else {
          console.error('Error:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchModels();
  }, []);
  return (
    <main className="main-container">
      <div className="MainDiv">
        <h1>Add Model</h1>
        <Form className="mt-5 mb-5" encType="multipart/form-data">
          <div className="form-group">
            <Form.Control
              type="text"
              className="form-control"
              id="modelName"
              placeholder="Enter Model Name"
              name="modelName"
              value={formData.modelName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <Form.Label htmlFor="price">Price:</Form.Label>
            <Form.Control
              type="text"
              className="form-control"
              id="price"
              placeholder="Model Price"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <Form.Label htmlFor="image">Image:</Form.Label>
            <Form.Control
              type="file"
              className="form-control"
              id="bytes"
              name="bytes"
              onChange={handleImageChange}
            />
          </div>
          <div className="form-group">
            <Form.Label htmlFor="comment">Description:</Form.Label>
            <Form.Control
              as="textarea"
              className="form-control"
              rows="5"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <Button variant="primary" type="submit" onClick={addModel}>
            Submit
          </Button>
        </Form>

        <div className="form-group">
        <Form.Group controlId="modelSelect">
          <Form.Label>Select Model:</Form.Label>
          <Form.Control as="select" onChange={(e) => setSelectedModel(availableModels.find(model => model.ModelId === parseInt(e.target.value)))}>
            <option value={null}>Select a model</option>
            {availableModels.map((model) => (
              <option key={model.ModelId} value={model.ModelId}>
                {model.ModelName}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        </div>
        <div>
          <h2>Add Camera</h2>
          {cameras.map((camera, index) => (
            <Form key={index} className="mt-5 mb-5">
              <Form.Label>Camera {index + 1}:</Form.Label>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Enter Camera Name"
                  name="cameraName"
                  value={camera.cameraName}
                  onChange={(e) => handleCameraChange(index, e)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="price">Price:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Camera Price"
                  name="price"
                  value={camera.price}
                  onChange={(e) => handleCameraChange(index, e)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="description">Description:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="5"
                  placeholder="Camera Description"
                  name="description"
                  value={camera.description}
                  onChange={(e) => handleCameraChange(index, e)}
                />
              </Form.Group>
              <Button variant="danger" type="button" onClick={() => deleteCamera(index)}>
                Delete Camera
              </Button>
              <br />
            </Form>
          ))}
          <Button variant="primary" onClick={addCamera}>
            Add Camera
          </Button>
        </div>

        <div>
          <h2>Add Battery</h2>
          {batteries.map((battery, index) => (
            <Form key={index} className="mt-5 mb-5">
              <Form.Label>Battery {index + 1}:</Form.Label>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Enter Battery Name"
                  name="batteryName"
                  value={battery.batteryName}
                  onChange={(e) => handleBatteryChange(index, e)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="price">Price:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Battery Price"
                  name="price"
                  value={battery.price}
                  onChange={(e) => handleBatteryChange(index, e)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="description">Description:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="5"
                  placeholder="Battery Description"
                  name="description"
                  value={battery.description}
                  onChange={(e) => handleBatteryChange(index, e)}
                />
              </Form.Group>
              <Button variant="danger" type="button" onClick={() => deleteBattery(index)}>
                Delete Battery
              </Button>
              <br />
            </Form>
          ))}
          <Button variant="primary" onClick={addBattery}>
            Add Battery
          </Button>
        </div>
        <div>
          <Button variant="primary" onClick={addCamerasAndBatteries}>
            Submit Cameras and Batteries
          </Button>
        </div>
        </div>
    </main>
  );

 
};

export default App;
