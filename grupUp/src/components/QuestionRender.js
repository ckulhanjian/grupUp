// src/components/QuestionStep.js
import React from 'react';
import InputRenderer from './inputRender';
// import { useFormData } from '../hooks/useFormData';

const QuestionStep = ({ question, formData, updateFormData }) => {
  const value = formData[question.id]; // value associated with key

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        {question.question}
      </h2>

      <InputRenderer
        question={question}
        value={value}
        updateFormData={updateFormData}
      />
    </div>
  );
};

export default QuestionStep;