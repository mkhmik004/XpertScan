'use client';

import { useState, useRef, useEffect } from 'react';
import { Button, ButtonGroup, Card, Form, Row, Col } from 'react-bootstrap';

interface PacsToolsProps {
  imageUrl: string;
  onMeasurement?: (measurement: { x1: number, y1: number, x2: number, y2: number, distance: number }) => void;
}

const PacsTools: React.FC<PacsToolsProps> = ({ imageUrl, onMeasurement }) => {
  const [zoom, setZoom] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [measuring, setMeasuring] = useState(false);
  const [measurement, setMeasurement] = useState<{ x1: number, y1: number, x2: number, y2: number, distance: number | null }>({ 
    x1: 0, y1: 0, x2: 0, y2: 0, distance: null 
  });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Load image when component mounts or imageUrl changes
  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      if (imageRef.current) {
        imageRef.current.src = imageUrl;
      }
      drawImage();
    };
  }, [imageUrl]);
  
  // Redraw image when zoom, contrast, or brightness changes
  useEffect(() => {
    drawImage();
  }, [zoom, contrast, brightness]);
  
  const drawImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = imageRef.current;
    
    if (!canvas || !ctx || !img) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas dimensions to match image
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Apply zoom
    const scaleFactor = zoom / 100;
    ctx.scale(scaleFactor, scaleFactor);
    
    // Draw image
    ctx.filter = `contrast(${contrast}%) brightness(${brightness}%)`;
    ctx.drawImage(img, 0, 0, img.width, img.height);
    
    // Draw measurement line if measuring
    if (measuring && measurement.x1 !== measurement.x2 && measurement.y1 !== measurement.y2) {
      ctx.beginPath();
      ctx.moveTo(measurement.x1, measurement.y1);
      ctx.lineTo(measurement.x2, measurement.y2);
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Display measurement text
      if (measurement.distance) {
        ctx.font = '14px Arial';
        ctx.fillStyle = 'red';
        ctx.fillText(`${measurement.distance.toFixed(2)} px`, 
          (measurement.x1 + measurement.x2) / 2, 
          (measurement.y1 + measurement.y2) / 2 - 10);
      }
    }
  };
  
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!measuring) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (measurement.x1 === 0 && measurement.y1 === 0) {
      // First click - set start point
      setMeasurement({ ...measurement, x1: x, y1: y });
    } else {
      // Second click - set end point and calculate distance
      const x2 = x;
      const y2 = y;
      const distance = Math.sqrt(
        Math.pow(x2 - measurement.x1, 2) + Math.pow(y2 - measurement.y1, 2)
      );
      
      const newMeasurement = { 
        x1: measurement.x1, 
        y1: measurement.y1, 
        x2, 
        y2, 
        distance 
      };
      
      setMeasurement(newMeasurement);
      if (onMeasurement) {
        onMeasurement(newMeasurement);
      }
      
      // Reset for next measurement
      setTimeout(() => {
        setMeasurement({ x1: 0, y1: 0, x2: 0, y2: 0, distance: null });
      }, 2000);
    }
  };
  
  const toggleMeasuring = () => {
    setMeasuring(!measuring);
    if (!measuring) {
      setMeasurement({ x1: 0, y1: 0, x2: 0, y2: 0, distance: null });
    }
  };
  
  return (
    <Card className="mb-4">
      <Card.Header>
        <h5>PACS Tools</h5>
      </Card.Header>
      <Card.Body>
        <Row className="mb-3">
          <Col>
            <div className="position-relative" style={{ overflow: 'auto', maxHeight: '500px' }}>
              <canvas 
                ref={canvasRef} 
                onClick={handleCanvasClick}
                style={{ cursor: measuring ? 'crosshair' : 'default' }}
              />
              <img 
                ref={imageRef} 
                src={imageUrl} 
                alt="Scan" 
                style={{ display: 'none' }} 
              />
            </div>
          </Col>
        </Row>
        
        <Row className="mb-3">
          <Col md={4}>
            <Form.Label>Zoom: {zoom}%</Form.Label>
            <Form.Range 
              min={50} 
              max={200} 
              step={10} 
              value={zoom} 
              onChange={(e) => setZoom(parseInt(e.target.value))} 
            />
          </Col>
          <Col md={4}>
            <Form.Label>Contrast: {contrast}%</Form.Label>
            <Form.Range 
              min={50} 
              max={150} 
              step={5} 
              value={contrast} 
              onChange={(e) => setContrast(parseInt(e.target.value))} 
            />
          </Col>
          <Col md={4}>
            <Form.Label>Brightness: {brightness}%</Form.Label>
            <Form.Range 
              min={50} 
              max={150} 
              step={5} 
              value={brightness} 
              onChange={(e) => setBrightness(parseInt(e.target.value))} 
            />
          </Col>
        </Row>
        
        <ButtonGroup>
          <Button 
            variant={measuring ? "danger" : "primary"} 
            onClick={toggleMeasuring}
          >
            {measuring ? "Cancel Measurement" : "Measure"}
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => {
              setZoom(100);
              setContrast(100);
              setBrightness(100);
            }}
          >
            Reset
          </Button>
        </ButtonGroup>
      </Card.Body>
    </Card>
  );
};

export default PacsTools;