// src/components/MultiStepForm.js
import React, { useState } from 'react';
import { getQuestionsArray } from '../data/schema';
import { useFormData } from '../hooks/useFormData';
import QuestionStep from './QuestionRender';
import { backArrow, nextArrow, submitButton } from '../styles/styles';

const MultiStepForm = () => {
  const questions = getQuestionsArray();
  const [currentStep, setCurrentStep] = useState(0);
  const { formData, updateFormData, resetForm } = useFormData();

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
    resetForm(); // Uncomment to reset form after submission
    setCurrentStep(0);
  };

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      
      <QuestionStep
        question={currentQuestion}
        formData={formData}
        updateFormData={updateFormData}
      />

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        {/* back button */}
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className={backArrow(currentStep)}>
          <span>&#8593;</span>
        </button>

        {/* next button or submit */}
        {isLastStep ? (
          <button onClick={handleSubmit} className={submitButton}>
            <span>Submit</span>
          </button>
        ) : (
          <button onClick={nextStep} className={nextArrow}>
            <span>&#8595;</span>
          </button>
        )}
      </div>

      {/* Debug: Show current form data */}
      {/* <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-2">Current Form Data:</h3>
        <pre className="text-sm text-gray-600 overflow-x-auto">
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div> */}
    </div>
  );
};

export default MultiStepForm;