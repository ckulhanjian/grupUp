// src/components/QuestionStep.js
import React from 'react';
import InputRenderer from './inputRender';
// import { useFormData } from '../hooks/useFormData';

const QuestionStep = ({ question, formData, updateFormData }) => {
  const value = formData[question.id]; // value associated with key

  return (
    <div className="flex flex-col items-center py-2">
      <h2 className="text-5xl text-black mb-12 -mt-12">
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