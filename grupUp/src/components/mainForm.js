// src/components/MultiStepForm.js
import React, { useState } from 'react';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getQuestionsArray } from '../data/schema';
import { useFormData } from '../hooks/useFormData';
// import ProgressBar from './ProgressBar';
import QuestionStep from './QuestionRender';

const MultiStepForm = () => {
  const questions = getQuestionsArray();
  const [currentStep, setCurrentStep] = useState(0);
  const { formData, updateFormData, handleInputChange } = useFormData();

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Calculate total weight for scoring (if needed)
    const totalWeight = questions.reduce((sum, q) => sum + q.weight, 0);
    
    const submissionData = {
      answers: formData,
      totalWeight,
      timestamp: new Date().toISOString()
    };
    
    console.log('Form submitted:', submissionData);
    alert('Form submitted successfully! Check console for data.');
    
    // You can add your submission logic here
    // resetForm(); // Uncomment to reset form after submission
  };

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* <ProgressBar currentStep={currentStep} totalSteps={questions.length} /> */}
      
      <QuestionStep
        question={currentQuestion}
        formData={formData}
        updateFormData={updateFormData}
        handleInputChange={handleInputChange}
      />

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
            currentStep === 0 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {/* <ChevronLeft size={20} /> */}
          <span>Previous</span>
        </button>

        {isLastStep ? (
          <button
            onClick={handleSubmit}
            className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <span>Submit</span>
          </button>
        ) : (
          <button
            onClick={nextStep}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>Next</span>
            {/* <ChevronRight size={20} /> */}
          </button>
        )}
      </div>

      {/* Debug: Show current form data */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-2">Current Form Data:</h3>
        <pre className="text-sm text-gray-600 overflow-x-auto">
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default MultiStepForm;