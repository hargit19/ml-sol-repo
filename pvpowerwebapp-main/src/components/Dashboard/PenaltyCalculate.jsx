import { Flex, Select, Spinner, Table } from "@radix-ui/themes";
import { useCallback, useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { toast } from "react-toastify";
import { getPenaltyFlow, savePenaltyFlow } from "../../api/predictedDataFlow";
import { calculatePenalty, penaltyBands } from "./CalculatePenalty";

const states = [
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Chattisgarh",
  "Gujarat",
  "Haryana",
  "Jharkhand",
  "Karnataka",
  "Madhya Pradesh",
  "Maharashtra",
  "Meghalaya",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
];

function ShowPenaltyBand({ selectedState }) {
  const selectedStatePenaltyBands = penaltyBands[selectedState];

  const bandKeys = Object.keys(selectedStatePenaltyBands).map(Number);

  return (
    <Table.Root size={"3"} variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Absolute Error in 15 minutes time block</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Deviation Charges in case of under or overinjection of Power</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {bandKeys.map((band, index) => {
          const penaltyRange =
            index === bandKeys.length - 1
              ? `>${band}%`
              : index === 0
              ? `<= ${bandKeys[index + 1]}%`
              : `>${band}% but <= ${bandKeys[index + 1]}%`;
          return (
            <Table.Row key={index}>
              <Table.RowHeaderCell>{penaltyRange}</Table.RowHeaderCell>
              <Table.Cell>{selectedStatePenaltyBands[band] || "None"}</Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Root>
  );
}

function ShowPenaltyGraph({ selectedState }) {
  const [penaltyData, setPenaltyData] = useState([]);

  async function handleGetPenalty() {
    const result = await getPenaltyFlow();
    console.log("Penalty Data:", result);
    if (result.status !== "success") {
      toast.error("Error in fetching penalty data");
      return;
    }

    const data = result.data.penalties;

    data.sort((a, b) => new Date(a.date) - new Date(b.date));
    setPenaltyData(data);
  }

  useEffect(() => {
    handleGetPenalty();
  }, []);

  if (!selectedState) {
    return null;
  }

  if (penaltyData.length === 0) {
    return "Error Loading Penalty Data";
  }

  // sort penaltyData by date

  const dateArray = penaltyData.map((data) => data.date);
  const quickErrorArrayState = penaltyData.map(
    (data) => data.penaltyCost.find((penalty) => penalty.state === selectedState).quickPenaltySum
  );
  const premiumErrorArrayState = penaltyData.map(
    (data) => data.penaltyCost.find((penalty) => penalty.state === selectedState).premiumPenaltySum
  );

  const errorPlotData = [
    {
      y: quickErrorArrayState,
      x: dateArray,
      type: "bar",
      name: "Quick",
      marker: { color: "green" },
      visible: true,
    },
    {
      y: premiumErrorArrayState,
      x: dateArray,
      type: "bar",
      name: "Premium",
      marker: { color: "blue" },
      visible: true,
    },
  ];

  const errorlayout = {
    title: `Penalties for ${selectedState}`,
    yaxis: {
      title: "Penalty Cost (in Rs.)",
      showgrid: false,
    },
    xaxis: {
      title: "Date",
      showgrid: false,
      showticklabels: true,
      type: "Date",
    },
    autosize: true,
  };

  return <Plot className="plot" data={errorPlotData} config={{ responsive: true }} layout={errorlayout} />;
}

function PenaltyCalculate({ quickErrors, premiumErrors, date }) {
  // const { state, dispatchMultiStep } = useMultiStepReducer();
  // const selectedState = state.state;

  function handleSelectValueChange(value) {
    // dispatchMultiStep({ type: "SET_SELECTED_STATE", payload: value });
    setSelectedState(value);
  }

  const [selectedState, setSelectedState] = useState(null);

  const [showPenalty, setShowPenalty] = useState(false);

  const [penaltySummary, setPenaltySummary] = useState({});

  useEffect(() => {
    if (selectedState) {
      setShowPenalty(false);
      const timer = setTimeout(() => {
        setShowPenalty(true);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setShowPenalty(false);
    }
  }, [selectedState]);

  let quickPenaltySum = 0;
  let premiumPenaltySum = 0;

  if (!!selectedState) {
    // const quickPenalties = quickErrors.map((error) => {
    //   return calculatePenalty(selectedState, Math.abs(error) / 10) * Math.abs(error);
    // });

    const quickPenalties = quickErrors.map((error) => {
      const penalty = calculatePenalty(selectedState, Math.abs(error) / 10);
    
      return (penalty !== null && penalty !== undefined) ? penalty * Math.abs(error) : 0;
    });

    const premiumPenalties = premiumErrors.map((error) => {
      return calculatePenalty(selectedState, Math.abs(error) / 10) * Math.abs(error);
  
    });

    const filteredQuickPenalties = quickPenalties.filter((penalty) => penalty !== null);
    
    const filteredPremiumPenalties = premiumPenalties.filter((penalty) => penalty !== null);
    

    quickPenaltySum = filteredQuickPenalties.reduce((acc, penalty) => acc + penalty, 0);
    
    premiumPenaltySum = filteredPremiumPenalties.reduce((acc, penalty) => acc + penalty, 0);
    
  }

  // const handleSavePenalty = useCallback(async () => {
  //   const penaltyCost = [];
  //   for (let i = 0; i < states.length; i++) {

  //     const quickPenalties = quickErrors.map((error) => {
  //       // console.log("Error Percentage in quick:", Math.abs(error) / 10);
  //       const penalty =  calculatePenalty(states[i], Math.abs(error) / 10) * Math.abs(error);
  //       console.log("Quick Penalty:", penalty);
  //       return (penalty !== null && penalty !== undefined) ? penalty * Math.abs(error) : 0;

  //     });

  //     const premiumPenalties = premiumErrors.map((error) => {
       
  //       const penalty =  calculatePenalty(states[i], Math.abs(error) / 10) * Math.abs(error);
  //       console.log("premium Penalty:", penalty);
  //       return (penalty !== null && penalty !== undefined) ? penalty * Math.abs(error) : 0;

  //     });

  //     const filteredQuickPenalties = quickPenalties.filter((penalty) => penalty !== null);
  //     const filteredPremiumPenalties = premiumPenalties.filter((penalty) => penalty !== null);

  //     const quickPenaltySum = filteredQuickPenalties.reduce((acc, penalty) => acc + penalty, 0);
  //     const premiumPenaltySum = filteredPremiumPenalties.reduce((acc, penalty) => acc + penalty, 0);

  //     penaltyCost.push({ state: states[i], quickPenaltySum, premiumPenaltySum });
  //   }

    

  //   const input = {
  //     date,
  //     penaltyCost,
  //   };

  //   const result = await savePenaltyFlow(input);

  //   if (result.status !== "success") {
  //     toast.error("Error in saving penalty data");
  //   }
  // }, [quickErrors, premiumErrors, date]);

  // useEffect(() => {
  //   handleSavePenalty();
  // }, [handleSavePenalty]);
  const handleSavePenalty = useCallback(async () => {
    const penaltyCost = [];
    const newPenaltySummary = {};
    
    for (let i = 0; i < states.length; i++) {
      const state = states[i];
      
      const quickPenalties = quickErrors.map((error) => {
        if (isNaN(error)) {
          return 0;
        }
        
        const penaltyRate = calculatePenalty(state, Math.abs(error) / 10);
        return (penaltyRate !== null && penaltyRate !== undefined) 
          ? penaltyRate * Math.abs(error) 
          : 0;
      });
  
      const premiumPenalties = premiumErrors.map((error) => {
        if (isNaN(error)) {
          return 0;
        }
        
        const penaltyRate = calculatePenalty(state, Math.abs(error) / 10);
        return (penaltyRate !== null && penaltyRate !== undefined) 
          ? penaltyRate * Math.abs(error) 
          : 0;
      });
  
      const quickPenaltySum = quickPenalties.reduce((acc, penalty) => acc + penalty, 0);
      const premiumPenaltySum = premiumPenalties.reduce((acc, penalty) => acc + penalty, 0);
      
      // Store in the summary object
      newPenaltySummary[state] = { quickPenaltySum, premiumPenaltySum };
      
      penaltyCost.push({ state, quickPenaltySum, premiumPenaltySum });
    }
  
    // Update the state with all penalty sums
    setPenaltySummary(newPenaltySummary);
    
    const input = {
      date,
      penaltyCost,
    };
  
    try {
      const result = await savePenaltyFlow(input);
      if (result.status !== "success") {
        toast.error("Error in saving penalty data");
      }
    } catch (error) {
      console.error("Error saving penalty flow:", error);
      toast.error("Error in saving penalty data");
    }
  }, [quickErrors, premiumErrors, date]);

  useEffect(() => {
    handleSavePenalty();
  }, [handleSavePenalty]);

  return (
    <div className="table-row">
      <div className="table-cell" style={{ backgroundColor: "white", padding: "1em" }}>
        <Flex gap={"3"} align={"center"} justify={"center"}>
          <h2 style={{ color: "#1f1914" }}>SELECT STATE: </h2>
          <Select.Root size={"3"} onValueChange={handleSelectValueChange} value={selectedState}>
            <Select.Trigger placeholder="Select an option">{selectedState || "Select an option"}</Select.Trigger>
            <Select.Content>
              <Select.Group>
                <Select.Label>Select your State</Select.Label>
                {states.map((state) => (
                  <Select.Item key={state} value={state}>
                    {state}
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </Flex>
        {selectedState && (
          <Spinner loading={!showPenalty}>
            <div className="penalty">
              <Flex direction={"column"} gap={"3"}>
                <ShowPenaltyBand selectedState={selectedState} />
                <h3 style={{ color: "#1f1914" }}>{`Total Penalty Sum (Quick Model): Rs. ${penaltySummary[selectedState].quickPenaltySum.toFixed(2)}`}</h3>
                <h3 style={{ color: "#1f1914" }}>{`Total Penalty Sum (Premium Model): Rs. ${penaltySummary[selectedState].premiumPenaltySum.toFixed(2)}`}</h3>
              </Flex>
            </div>
          </Spinner>
        )}
      </div>
      <div className="table-cell" style={{ backgroundColor: "white", padding: "1em" }}>
        <ShowPenaltyGraph selectedState={selectedState} />
      </div>
    </div>
  );
}

export default PenaltyCalculate;
