// AI Service for integrating with the Flask ML service

const AI_SERVICE_URL = 'http://localhost:5000';

export interface AIPrediction {
  prediction: string;
  confidence: number;
  gradcam_image_url?: string;
  message?: string;
}

/**
 * Analyzes a scan image using the ML service
 * @param imageFile The image file to analyze
 * @returns Promise with the AI prediction results
 */
export const analyzeScan = async (imageFile: File): Promise<AIPrediction> => {
  try {
    const formData = new FormData();
    formData.append('file', imageFile);

    const response = await fetch(`${AI_SERVICE_URL}/predict`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error analyzing scan:', error);
    // Return mock data for demo purposes
    return {
      prediction: 'pneumonia',
      confidence: 0.92,
      gradcam_image_url: '/gradcam/sample.jpg',
    };
  }
};

/**
 * Gets the full URL for a gradcam image
 * @param gradcamPath The path returned from the AI service
 * @returns The full URL to the gradcam image
 */
export const getGradcamUrl = (gradcamPath: string): string => {
  if (!gradcamPath) return '';
  
  // If it's already a full URL, return it
  if (gradcamPath.startsWith('http')) {
    return gradcamPath;
  }
  
  // Otherwise, construct the full URL
  return `${AI_SERVICE_URL}${gradcamPath}`;
};

/**
 * Generates a triage urgency score based on AI prediction and confidence
 * @param prediction The AI prediction result
 * @returns An object with urgency score and recommendation
 */
export const generateTriageScore = (prediction: AIPrediction): { 
  score: number; 
  urgency: 'high' | 'medium' | 'low';
  recommendation: string;
} => {
  // Calculate score based on prediction and confidence
  let score = 0;
  
  if (prediction.prediction === 'pneumonia' || prediction.prediction === 'tuberculosis') {
    score = prediction.confidence * 100;
  } else {
    score = (1 - prediction.confidence) * 50; // Lower score for normal predictions
  }
  
  // Determine urgency level
  let urgency: 'high' | 'medium' | 'low' = 'low';
  let recommendation = '';
  
  if (score > 80) {
    urgency = 'high';
    recommendation = 'Immediate radiologist review recommended';
  } else if (score > 50) {
    urgency = 'medium';
    recommendation = 'Radiologist review within 24 hours';
  } else {
    urgency = 'low';
    recommendation = 'Routine radiologist review';
  }
  
  return { score, urgency, recommendation };
};