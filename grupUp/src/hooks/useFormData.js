// src/hooks/useFormData.js
/*
This hook gives you:
	•	A formData state object
	•	A way to update form fields
	•	A way to handle multiselects
	•	A way to handle grouped mode toggles
	•	A way to reset the form
*/

import { useState } from 'react';
import { generateInitialFormData } from '../data/schema';

export const useFormData = () => {
  const [formData, setFormData] = useState(generateInitialFormData());

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev, // keep previous data in form intact
      [field]: value
    }));
  };

  const handleInputChange = (field, value, type) => {
    setFormData(prev => {
      if (type === 'multi-select') {
        // Handle multi-select (array of selected options)
        return {
          ...prev,
          [field]: prev[field].includes(value)
            ? prev[field].filter(item => item !== value) // Remove if exists
            : [...prev[field], value] // Add if not exists
        };
      } else if (type === 'select') {
        // Handle select (single selected option)
        return {
          ...prev,
          [field]: value // Set the selected value
        };
      } else if (type === 'text') {
        // Handle text input (set the text value)
        return {
          ...prev,
          [field]: value // Set the text value
        };
      }
      return prev; // Default return (no change)
    });
  };

  const resetForm = () => {
    setFormData(generateInitialFormData());
  };

  return {
    formData,
    updateFormData,
    handleMultiSelectChange,
    handleModeGroupChange,
    resetForm
  };
};