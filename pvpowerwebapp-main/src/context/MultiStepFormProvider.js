import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { getHeaders } from "../api/headersFlow";
import { formReducer, initalState } from "../reducer/multiStepFormReducer";
const MultiStepFormContext = createContext();

function MultiStepFormProvider({ children }) {
  const [state, dispatchMultiStep] = useReducer(formReducer, initalState);
  const [savedHeaders, setSavedHeaders] = useState(null);

  useEffect(() => {
    async function getHeadersFlow() {
      const result = await getHeaders();
      if (result.status !== "success") {
        return;
      }

      setSavedHeaders(result.data.header);
    }
    getHeadersFlow();
  }, []);

  return (
    <MultiStepFormContext.Provider value={{ state, dispatchMultiStep, savedHeaders }}>
      {children}
    </MultiStepFormContext.Provider>
  );
}

export default MultiStepFormProvider;

export function useMultiStepReducer() {
  return useContext(MultiStepFormContext);
}
