// Define the penalty bands for each state
const penaltyBands = {
  "Andhra Pradesh": {
    0: 0,
    15: 0.5,
    25: 1,
    35: 1.5,
  },
  "Assam": {
    0: 0,
    10: 0.5,
    20: 1,
    30: 1.5,
  },
  "Bihar": {
    0: 0,
    15: 0.5,
    25: 1,
    35: 1.5,
  },
  "Chattisgarh": {
    0: null,
    15: 0.5,
    25: 1,
    35: 1.5,
  },
  "Gujarat": {
    0: null,
    12: 0.25,
    20: 0.5,
    28: 0.75,
  },
  "Haryana": {
    0: null,
    10: 0.5,
    20: 1,
    30: 1.5,
  },
  "Jharkhand": {
    0: null,
    15: 0.5,
    25: 1,
    35: 1.5,
  },
  "Karnataka": {
    0: null,
    15: 0.5,
    25: 1,
    35: 1.5,
  },
  "Madhya Pradesh": {
    0: null,
    10: 0.5,
    20: 1,
    30: 1.5,
  },
  "Maharashtra": {
    0: null,
    15: 0.5,
    25: 1,
    35: 1.5,
  },
  "Meghalaya": {
    0: null,
    15: 0.5,
    25: 1,
    35: 1.5,
  },
  "Punjab": {
    0: null,
    15: 0.5,
    25: 1,
    35: 1.5,
  },
  "Rajasthan": {
    0: null,
    15: 0.5,
    25: 1,
    35: 1.5,
  },
  "Tamil Nadu": {
    0: null,
    10: 0.25,
    20: 0.5,
    30: 1,
  },
  "Telangana": {
    0: null,
    15: 0.5,
    25: 1,
    35: 1.5,
  },
  "Tripura": {
    0: null,
    10: 0.5,
    20: 1,
    30: 1.5,
  },
  "Uttar Pradesh": {
    0: null,
    15: 0.5,
    25: 1,
    35: 1.5,
  },
};

// Function to calculate penalty
// function calculatePenalty(state, errorPercentage) {
  
//   console.log("Error Percentage:", errorPercentage);
//   const bands = penaltyBands[state];
  
//   const bandKeys = Object.keys(bands).map(Number);
//   console.log("Band Keys:", bandKeys);

//   // Find the band for the given error percentage
//   const band = bandKeys.find((band) => errorPercentage < band);
//   console.log("Band:", band);
//   return band ? (bands[band] ? bands[band] : 0) : bands[bandKeys[bandKeys.length - 1]];
// }

function calculatePenalty(state, errorPercentage) {
  const bands = penaltyBands[state];
  if (!bands) return 0;
  
  const bandKeys = Object.keys(bands).map(Number).sort((a, b) => a - b);
  
  // Handle case where error is larger than all bands
  if (errorPercentage >= bandKeys[bandKeys.length - 1]) {
    return bands[bandKeys[bandKeys.length - 1]] || 0;
  }
  
  // Find the appropriate band
  for (let i = 0; i < bandKeys.length - 1; i++) {
    if (errorPercentage >= bandKeys[i] && errorPercentage < bandKeys[i + 1]) {
      return bands[bandKeys[i]] || 0;
    }
  }
  
  return 0; // Default fallback
}

// Export the calculatePenalty function and penaltyBands object
export { calculatePenalty, penaltyBands };
