import styled from 'styled-components';
import bgImage1 from '../assets/blue2.svg';

export const startButton = `
  w-32 h-14 text-base rounded-full mt-4
  outline outline-2 outline-gray-300 
  hover:outline-black hover:outline-4
`.trim();


export const backArrow = (currentStep) => `
    flex items-center space-x-2 px-4 py-2 rounded-lg transition-all 
    ${
        currentStep === 0 
        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`;

export const submitButton = 'flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors';

export const nextArrow = "flex items-center space-x-2 px-4 py-2 bg-stone-400 text-white rounded-lg hover:bg-stone-700 transition-colors";

export const BgHome = styled.div`
  background-image: url(${bgImage1});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  width: 100%;
`;
