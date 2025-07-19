// src/components/InputRenderer.js
// import { useFormData } from '../hooks/useFormData';

const InputRenderer = ({ question, value, updateFormData }) => {
  const { id, type, options = [], placeholder } = question;

  const handleChange = (newValue) => updateFormData(id, newValue);

  const renderMultiSelect = () => (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => {
            const updated = value.includes(option)
              ? value.filter((v) => v !== option)
              : [...value, option];
            handleChange(updated);
          }}
          className={`px-4 py-2 rounded-full border-2 transition-all ${
            value.includes(option)
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );

  const renderSingleSelect = () => (
    <div className="space-y-2">
      {options.map((option) => (
        <label key={option} className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name={id}
            value={option}
            checked={value === option}
            onChange={() => handleChange(option)}
            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <span className="text-gray-700">{option}</span>
        </label>
      ))}
    </div>
  );

  const renderTextInput = () => (
    <input
      type={type === 'email' ? 'email' : 'text'}
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      placeholder={placeholder}
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  );

  switch (type) {
    case 'multi-select':
      return renderMultiSelect();
    case 'single-select':
      return renderSingleSelect();
    case 'text':
      return renderTextInput();
    default:
      return <div className="text-red-500">Unknown question type: {type}</div>;
  }
};

export default InputRenderer;