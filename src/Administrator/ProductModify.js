import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

const ModifyAndDeletePage = () => {
  const [formData, setFormData] = useState({
    modelName: '',
    description: '',
    price: 0,
    bytes: '',
    fileExtension: '',
    size: 0,
  });
  const [formDataCamera, setFormDataCamera] = useState({
    cameraName: '',
    price: 0,
    description: '',
  });
  const [availableModels, setAvailableModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [batteries, setBatteries] = useState([]);
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const camerasResponse = await fetch(`http://localhost:5114/api/Users/GetCamerasById/${selectedModel.ModelId}`);
        const batteriesResponse = await fetch(`http://localhost:5114/api/Users/GetBatteriesById/${selectedModel.ModelId}`);

        if (camerasResponse.ok) {
          const camerasData = await camerasResponse.json();
          console.log(camerasData);
          setCameras(camerasData);
        }

        if (batteriesResponse.ok) {
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
  }, [selectedModel]);
  useEffect(() => {
    if (selectedModel) {
      setFormData({
        modelName: selectedModel.ModelName,
        description: selectedModel.Description,
        price: selectedModel.Price,
        bytes: '',
        fileExtension: selectedModel.FileExtension,
        size: selectedModel.Size,
      });
      setFormDataCamera({
        cameraName: selectedModel.CameraName,
        description: selectedModel.Description,
        price: selectedModel.Price,
      });
      
    } else {
      setFormDataCamera({
        cameraName: '',
        description: '',
        price: 0,
      });
      setFormData({
        modelName: '',
        description: '',
        price: 0,
        bytes: '',
        fileExtension: '',
        size: 0,
      });
    }
  }, [selectedModel]);
  

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
  const handleModify = async () => {
    if (!selectedModel) {
      console.error('No model selected for modification');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5114/api/Drones/ModifyModel/${selectedModel.ModelId}`, {
        method: 'PUT',
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
        console.log('Model modified successfully');
      } else {
        console.error('Error modifying model:', response.statusText);
      }
    } catch (error) {
      console.error('Error modifying model:', error);
    }
  };

  const handleDelete = async () => {
    try {
      if (!selectedModel) {
        console.error('No model selected for deletion');
        return;
      }
  
      const response = await fetch(`http://localhost:5114/api/Drones/DeleteModel/${selectedModel.ModelId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        console.log('Model deleted successfully');
      } else {
        console.error('Error deleting model:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting model:', error);
    }
  };






  const handleCameraChange = (index, e) => {
    const updatedCameras = [...cameras];
    updatedCameras[index][e.target.name] = e.target.value;
    setCameras(updatedCameras);
  };
  

  const handleDeleteCamera = async (index) => {
    try {
      const cameraToDelete = cameras[index];
      const response = await fetch(`http://localhost:5114/api/Camera/${cameraToDelete.CameraId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        const updatedCameras = [...cameras];
        updatedCameras.splice(index, 1);
        setCameras(updatedCameras);
        console.log('Camera deleted successfully');
      } else {
        console.error('Error deleting camera');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleUpdateCamera = async (index) => {
    try {
      const cameraToUpdate = cameras[index];
      const response = await fetch(`http://localhost:5114/api/Camera/${cameraToUpdate.CameraId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cameraToUpdate),
      });
  
      if (response.ok) {
        console.log('Camera updated successfully');
      } else {
        console.error('Error updating camera');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
    <div>
      <h1>Data model</h1>
      <Form className="mt-5 mb-5" encType="multipart/form-data">
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

        <Button variant="primary" onClick={handleModify}>
          Modify
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
        
      </Form>
    </div>
    {/* <div>
    <h1>Camera</h1>
    {cameras.map((camera, index) => (
  <Form key={index} className="mt-5 mb-5">
    <Form.Label>Camera {index + 1}:</Form.Label>
    <Form.Group>
      <Form.Control
        type="text"
        placeholder="Enter Camera Name"
        name="CameraName"
        value={camera.CameraName}
        onChange={(e) => handleCameraChange(index, e)}
      />
    </Form.Group>
    <Form.Group>
      <Form.Label htmlFor="price">Price:</Form.Label>
      <Form.Control
        type="text"
        placeholder="Camera Price"
        name="Price"
        value={camera.Price}
        onChange={(e) => handleCameraChange(index, e)}
      />
    </Form.Group>
    <Form.Group>
      <Form.Label htmlFor="description">Description:</Form.Label>
      <Form.Control
        as="textarea"
        rows="5"
        placeholder="Camera Description"
        name="Description"
        value={camera.Description}
        onChange={(e) => handleCameraChange(index, e)}
      />
    </Form.Group>
    <Button variant="danger" type="button" onClick={() => handleDeleteCamera(index)}>
      Delete Camera
    </Button>
    <Button variant="primary" onClick={() => handleUpdateCamera(index)}>
        Update
      </Button>
      <br />
  </Form>
  
))}
    </div> */}
        {/* <div>
      <h1>Modify Battery</h1>
      <label>Select Battery:</label>
      <select onChange={(e) => setSelectedBattery(e.target.value)}>
        <option value={null}>Select a battery</option>
        {batteries.map((battery) => (
          <option key={battery.BatteryID} value={battery.BatteryID}>
            {battery.BatteryName}
          </option>
        ))}
      </select>
      </div> */}
      </>
  );
};

export default ModifyAndDeletePage;