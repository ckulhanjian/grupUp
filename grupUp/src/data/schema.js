export const questions = {
  "name": {
    "type":"text",
    "question":"Enter your name"
  },
  "hobbies": {
    "type": "multi-select",
    "question": "Select at least 5 hobbies & interests",
    "options": ["Cooking", "Dancing", "Hiking", "Gaming", "Music", 
      "Volunteering", "Reading", "Travel", "Art", "Fitness", "Tech", "Sports", "Writing", 
      "Photography","Card Games","Cars","Fashion", "Politics","Biking","Animals","Video Games",
      "Gym","Drawing","Painting","Architecture","Movies","TV"],
    "weight": 1
  },

  "intention_out": {
    "type": "multi-select",
    "question": "When I go out I want to...",
    "options": ["Have a good time & be spontaneous", "Meet people and have good conversation", "Enjoy the event I came for", "Listen to music and dance", "Explore the location", "Make new friends", "Try new things", "Relax and unwind"],
    "weight": 1
  },

  "intention_by_event": {
    "type": "mode-group",
    "question": "Choose your mood at specific events and decidie how you'd prefer others to respond:",
    "events": [
      "Club", "Concert", "Festival", "House Party", "Street Fair"
    ],
    "choices": ["Dance", "Chill", "Meet People", "Vibe", "Observe", "Any"],
    "per_event": {
      "self": "YOUR Answer",
      "expected": "OTHERS Answer"
    },
    "weight": 2
  },

  "money": {
    "type": "scale",
    "question": "What are your spending habits when you go out?",
    "options": [
      "I only buy essentials",
      "Budget when it doesn’t compromise experience",
      "Not concerned with money!",
      "Varies"
    ],
    "weight": 1
  },

  "transportation": {
    "type": "scale",
    "question": "What is your transportation preference?",
    "options": [
      "Uber/Lyft is preferred",
      "Walk when able",
      "I like to drive",
      "Not comfortable with strangers driving",
      "Varies"
    ],
    "weight": 1
  },

  "diet": {
    "type": "multi-select",
    "question": "Do you have any dietary restrictions?",
    "options": [
      "Vegan",
      "Low/No sugar",
      "Vegetarian",
      "Pescetarian",
      "No dairy",
      "None",
      "Other",
    ],
    // "follow_ups": {
    //   "q6_similar_response": {
    //     "type": "boolean",
    //     "question": "Should others respond similarly?"
    //   },
    //   "q6_accommodate": {
    //     "type": "boolean",
    //     "question": "Are you willing to accommodate others’ dietary restrictions?"
    //   }
    // },
    "weight": 1
  },

  "social_battery": {
    "type": "multi-select",
    "question": "How do you recharge your social battery?",
    "options": [
      "Time with family & friends",
      "Going out and meeting new people",
      "Doing exercise",
      "Being creative",
      "Television/Movies",
      "A nice meal"
    ],
    "weight": 1
  },

  // "q8_humor": {
  //   "type": "text",
  //   "question": "How would you describe your sense of humor?",
  //   "optional": true
  // },

  "stress": {
    "type": "scale",
    "question": "How do you handle stress or conflict?",
    "options": [
      "I don't...I shutdown",
      "For the most part I stay calm",
      "Ngl I freak out",
    ],
    "weight": 1
  },

  "traits": {
    "type": "nested-select",
    "question": "Pick one trait from each category:",
    "options": {
      "Work Ethic": ["Driven", "Flexible", "Laid-back"],
      "Fitness": ["Active", "Balanced", "Sedentary"],
      "Social": ["More friends", "Intimate friends", "Loner"]
    },
    "weight": 1
  },

  "fun_facts": {
    "type": "multi-text",
    "question": "Share 3 fun facts about yourself!",
    "optional": true
  }
}

// array of key-value pairs from question data
export const getQuestionsArray = () => {
  return Object.entries(questions).map(([id, questionData]) => ({
    id,
    ...questionData
  }));
};

// Generate initial form data based on question types
export const generateInitialFormData = () => {
  const initialData = {};
  
  Object.entries(questions).forEach(([id, question]) => {
    switch (question.type) {
      case 'scale':
      case 'select':
        initialData[id] = [];
        break;
      case 'multi-select':
        initialData[id] = [];
        break;
      case 'mode-group':
        // Initialize nested structure for mode-group
        initialData[id] = {};
        question.events.forEach(event => {
          initialData[id][event] = {
            self: [],
            expected: []
          };
        });
        break;
      case 'multi-text':
        initialData[id] = Array(3).fill("");
        break;
      case 'nested-select':
        initialData[id] = {};
        Object.keys(question.options).forEach((category) => {
          initialData[id][category] = "";
        });
        break;
      default:
        initialData[id] = '';
    }
  });
  
  return initialData;
};

/* 
1. multi-select
2. single-select
3. mode-group
4. text

*/