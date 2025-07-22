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
  const [submitted, setSubmitted] = useState(false);
  const [testing, isTesting] = useState(true);

  // 👇 move these here, not inside conditional
  const [devView, setDevView] = useState(false);
  const [topUsers, setTopUsers] = useState([]);
  const [graphUrl, setGraphUrl] = useState('');

  const nextStep = (e) => {
    if (e) e.preventDefault(); // Prevent form submission
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = (e) => {
    if (e) e.preventDefault(); // Prevent form submission
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e, data = formData) => {
    console.log('🔴 SUBMIT HANDLER CALLED - START');
    
    if (e) {
      console.log('🔴 Event object exists, calling preventDefault');
      e.preventDefault();
      e.stopPropagation(); // Also stop event bubbling
    }
    
    const dataToSubmit = data || formData;
    console.log('🔴 Data to submit:', dataToSubmit);
    
    // Set loading/submitted state immediately to show something happened
    console.log('🔴 Setting submitted to true');
    setSubmitted(true);
    
    // Add a small delay to see if it shows
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      console.log('🔴 Starting API call');
      
      // TEMPORARY: Skip API call to test if that's the issue
      console.log('🔴 SKIPPING API CALL FOR TESTING');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // Fake successful response for testing
      const result = {
        graphGenerated: true,
        graphUrl: '../public/graph.png',
        topUsers: [
          { name: 'Test User 1', similarityScore: 95 },
          { name: 'Test User 2', similarityScore: 87 }
        ]
      };
      
      /* COMMENTED OUT FOR TESTING
      const response = await fetch("http://localhost:3001/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataToSubmit)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();  
      */
      
      console.log("🔴 API Success:", result);

      // Update the results after API call
      if (result.graphGenerated && result.graphUrl) {
        console.log('🔴 Setting graph URL:', result.graphUrl);
        setGraphUrl(`http://localhost:3001${result.graphUrl}?t=${Date.now()}`);
      }
      if (result.topUsers) {
        console.log('🔴 Setting top users:', result.topUsers);
        setTopUsers(result.topUsers);
      }
      
    } catch (error) {
      console.error("🔴 API Error:", error);
      // Show error but keep submitted state true so user can see what happened
      setTopUsers([]);
      setGraphUrl('');
    }
    
    console.log('🔴 SUBMIT HANDLER CALLED - END');
  };

  if (submitted) {
      return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">🎉 Submission Complete!</h1>
          <button
            type="button" // Explicitly set button type
            onClick={(e) => {
              e.preventDefault();
              setDevView(!devView);
            }}
            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded">
            {devView ? 'Switch to User View' : 'Switch to Developer View'}
          </button>
        </div>

        {/* Debug info */}
        <div className="mb-4 p-3 bg-gray-100 rounded text-sm">
          <strong>Debug Info:</strong><br/>
          Graph URL: {graphUrl || 'None'}<br/>
          Top Users Count: {topUsers.length}<br/>
          Current View: {devView ? 'Developer' : 'User'}
        </div>

        {devView ? (
          <div id="developer-view">
            <h3 className="text-xl font-semibold mb-2">Developer View: Compatibility Graph</h3>
            {graphUrl ? (
              <div>
                <p className="mb-2">Loading graph from: {graphUrl}</p>
                <img 
                  src={graphUrl} 
                  alt="Compatibility Graph" 
                  className="max-w-full"
                  onLoad={() => console.log('Graph loaded successfully')}
                  onError={(e) => console.error('Graph failed to load:', e)}
                />
              </div>
            ) : (
              <p>No graph available. Check console for API response details.</p>
            )}
          </div>
        ) : (
          <div id="user-view">
            <h3 className="text-xl font-semibold mb-2">Top Compatible Users</h3>
            {topUsers.length > 0 ? (
              <ul className="list-disc pl-5">
                {topUsers.map((user, i) => (
                  <li key={i}>
                    {user.name} – Similarity: {user.similarityScore}%
                  </li>
                ))}
              </ul>
            ) : (
              <div>
                <p>No top matches found.</p>
                <p className="text-sm text-gray-600 mt-2">
                  Check the browser console for API response details.
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* Add a reset button for testing */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setSubmitted(false);
            setDevView(false);
            setTopUsers([]);
            setGraphUrl('');
            setCurrentStep(0);
            resetForm();
          }}
          className="mt-4 px-4 py-2 text-white bg-gray-600 hover:bg-gray-700 rounded">
          Start Over
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;

  return (
    <div className="m-60 mt-56" onSubmit={(e) => {
      console.log('🔴 FORM SUBMIT EVENT DETECTED - PREVENTING');
      e.preventDefault();
      e.stopPropagation();
    }}>
      {testing ? (
        <div className="space-y-4">
          <button 
            type="button" // Explicitly set button type
            onClick={(e) => {
              console.log('🟢 Test button clicked');
              e.preventDefault(); // 🛑 Stop the form from reloading the page
              e.stopPropagation(); // Stop event bubbling
              handleSubmit(e, {
                "name": "The Rock",
                "hobbies": ["Tech", "Gaming", "Architecture", "Movies", "Card Games"],
                "intention_out": ["Enjoy the event I came for", "Relax and unwind", "Make new friends", "Try new things", "Explore the location"],
                "intention_by_event": {
                  "Club": { "self": ["Observe"], "expected": ["Chill"] },
                  "Concert": { "self": ["Any"], "expected": ["Any"] },
                  "Festival": { "self": ["Chill"], "expected": ["Dance"] },
                  "House Party": { "self": ["Chill"], "expected": ["Observe"] },
                  "Street Fair": { "self": ["Meet People"], "expected": ["Chill"] }
                },
                "money": ["I only buy essentials"],
                "transportation": ["Not comfortable with strangers driving"],
                "diet": ["Other", "None", "Vegetarian", "No dairy", "Low/No sugar"],
                "social_battery": ["Being creative", "Time with family & friends", "Television/Movies", "Going out and meeting new people", "A nice meal"],
                "stress": ["I don't...I shutdown"],
                "traits": {
                  "Work Ethic": "Flexible",
                  "Fitness": "Balanced",
                  "Social": "Loner"
                },
                "fun_facts": [
                  "I build model cities in my spare time",
                  "I know every Oscar winner since 1990",
                  "I competed in a national chess tournament"
                ]
              });
            }}
            className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600">
            Test Submit
          </button>
          
          <button 
            type="button"
            onClick={(e) => {
              console.log('🟢 Use Real Form button clicked');
              e.preventDefault();
              e.stopPropagation();
              isTesting(false);
            }}
            className="ml-4 px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600">
            Use Real Form
          </button>
        </div>
      ) : (
        <>
        <div
          key={currentQuestion}
          className="transition-all duration-500 ease-in-out transform opacity-100 translate-y-0"
          onSubmit={(e) => {
            console.log('🔴 NESTED FORM SUBMIT DETECTED - PREVENTING');
            e.preventDefault();
            e.stopPropagation();
            return false;
          }}
        >
          <QuestionStep
            question={currentQuestion}
            formData={formData}
            updateFormData={updateFormData}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-10">
          {/* back button */}
          <button
            type="button" // Explicitly set button type
            onClick={(e) => {
              console.log('🟢 Back button clicked');
              e.preventDefault();
              e.stopPropagation();
              prevStep(e);
            }}
            disabled={currentStep === 0}
            className={backArrow(currentStep)}>
            <span>&#x2190;</span>
          </button>

          {/* next button or submit */}
          {isLastStep ? (
            <button 
              type="button" // Explicitly set button type
              onClick={(e) => {
                console.log('🟢 Final submit button clicked');
                e.preventDefault();
                e.stopPropagation();
                handleSubmit(e);
              }} 
              className={submitButton}>
              <span>Submit</span>
            </button>
          ) : (
            <button 
              type="button" // Explicitly set button type
              onClick={(e) => {
                console.log('🟢 Next button clicked');
                e.preventDefault();
                e.stopPropagation();
                nextStep(e);
              }} 
              className={nextArrow}>
              <span>&#x2192;</span>
            </button>
          )}
        </div>
        </>
      )}
    </div>
  );
};

export default MultiStepForm;