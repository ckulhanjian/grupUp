export const startButton = `
  w-28 h-14 text-xl rounded-full 
  outline outline-2 outline-gray-300
  hover:outline-blue-400
`.trim();


export const backArrow = (currentStep) => `
    flex items-center space-x-2 px-4 py-2 rounded-lg transition-all 
    ${
        currentStep === 0 
        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`;

export const submitButton = 'flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors';

export const nextArrow = "flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors";