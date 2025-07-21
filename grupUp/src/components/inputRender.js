// src/components/InputRenderer.js
// import { useFormData } from '../hooks/useFormData';

const InputRenderer = ({ question, value, updateFormData }) => {
  const { id, type, options = [], placeholder, events, choices, per_event,  } = question;

  const handleChange = (newValue, context = {}) => {
    if (question.type === "mode-group") {
      const { eventName, subType } = context;
      updateFormData(id, {
        ...value,
        [eventName]: {
          ...value[eventName],
          [subType]: [newValue]
        }
      });
    } 
    else if (question.type === "multi-text") {
      const currentFacts = Array.isArray(value) ? [...value] : ["", "", ""];
      while (currentFacts.length < 3) {
        currentFacts.push("");
      }
      currentFacts[context] = newValue;
      updateFormData(id, currentFacts);
    } 
    else if (question.type === "nested-select") {
      const { category } = context; // context must include category
      const updated = { ...value, [category]: newValue };
      updateFormData(id, updated);
    }
    else {
      updateFormData(id, newValue);
    }
  };

  const renderMultiText = () => (
  <div className="space-y-4">
    {[0, 1, 2].map((i) => (
      <input
        key={i}
        value={value?.[i] || ""} // <- each input gets its own index
        onChange={(e) => handleChange(e.target.value, i)}
        placeholder={`fact #${i + 1}`}
        className="w-full p-2 border rounded"
      />
    ))}
  </div>
);

  const renderModeGroup = () => (
  <div className="space-y-4 text-sm">
    {/* Header Row */}
    <div className="grid grid-cols-3 font-semibold text-xl mb-2">
      <span className="text-left">Event</span>
      <span className="text-left">{per_event?.self || "You"}</span>
      <span className="text-left">{per_event?.expected || "Others"}</span>
    </div>

    {/* One row per event */}
    {events.map((event) => (
      <div key={event} className="grid grid-cols-3 gap-4 items-center">
        <span className="text-left font-medium">{event}</span>

        {/* You / self */}
        <select
          className={`w-full border rounded-full px-2 py-2 
            ${value[event]?.self[0] ? "bg-pink-400 border-pink-600 text-white" : "bg-stone-100 border-gray-300"}
            `}
          value={value[event]?.self[0] || ""}
          onChange={(e) =>
            handleChange(e.target.value, { eventName: event, subType: "self" })
          }
        >
          <option value="">Select</option>
          {choices.map((choice) => (
            <option key={choice} value={choice}>
              {choice}
            </option>
          ))}
        </select>

        {/* Others / expected */}
        <select
          className={`w-full border rounded px-2 py-2 
            ${value[event]?.expected[0] ? "bg-red-400 border-red-600 text-white" : "bg-stone-100 border-gray-300"}
            `}
          value={value[event]?.expected[0] || ""}
          onChange={(e) =>
            handleChange(e.target.value, { eventName: event, subType: "expected" })
          }
        >
          <option value="">Select</option>
          {choices.map((choice) => (
            <option key={choice} value={choice}>
              {choice}
            </option>
          ))}
        </select>
      </div>
    ))}
  </div>
);

  const renderMultiSelect = () => (
    <div className="flex flex-wrap gap-2 justify-center">
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
              ? 'bg-pink-400 text-white border-pink-500'
              : 'bg-white text-gray-700 border-gray-300 hover:border-pink-400'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );

  const renderSingleSelect = () => (
    <div className="space-y-2 text-base">
      {options.map((option) => (
        <label key={option} className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name={id}
            value={option}
            checked={value === option}
            onChange={() => handleChange(option)}
            className="w-4 h-4 text-pink-600 border-gray-300 focus:ring-pink-500"
          />
          <span className="text-gray-700">{option}</span>
        </label>
      ))}
    </div>
  );

  const renderScale = () => (
    <div className="w-full">
    {/* <div className="text-base font-medium mb-4">{question.question}</div> */}

    <div className="relative w-full flex justify-between items-center">
      {/* Background line behind dots */}
      <div className="absolute top-1 left-4 right-4 h-1 bg-slate-300 z-0 transform " />

      {/* Dots with labels */}
      {options.map((option, index) => (
        <label key={option} className="flex flex-col items-center z-10 cursor-pointer">
          <input
            type="radio"
            name={id}
            value={option}
            checked={value === option}
            onChange={() => handleChange(option)}
            className="sr-only"
          />
          <div
            className={`w-4 h-4 rounded-full border-2 transition-colors
              ${value === option ? "bg-pink-600 border-pink-600" : "bg-white border-gray-400"}`}
          />
          <span className="mt-2 text-sm text-center w-42">{option}</span>
        </label>
      ))}
    </div>
  </div>
  )

  const renderTextInput = () => (
    <input
      type={type === 'email' ? 'email' : 'text'}
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      placeholder={placeholder}
      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  );

  const renderNestedSelect = () => (
    <div className="space-y-4">
      {Object.entries(options).map(([category, choices]) => (
        <div key={category}>
          <label className="block font-semibold text-lg mb-2">{category}</label>
          <select value={value?.[category] || ""}
          onChange = {(e) => handleChange(e.target.value, { category })}
          className = {`w-full border px-3 py-2 rounded ${value[category] 
          ? "bg-pink-400 bg-outline-pink-600 text-white" : "bg-stone-200"}`}>
            <option value="">Select One</option>
            {choices.map((choice) => (
              <option key={choice} value={choice}>
                {choice}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  )

  switch (type) {
    case 'multi-select':
      return renderMultiSelect();
    case 'select':
      return renderSingleSelect();
    case 'text':
      return renderTextInput();
    case 'multi-text':
      return renderMultiText();
    case 'mode-group':
      return renderModeGroup();
    case 'scale':
      return renderScale();
    case 'nested-select':
      return renderNestedSelect();
    default:
      return <div className="text-red-500">Unknown question type: {type}</div>;
  }
};

export default InputRenderer;