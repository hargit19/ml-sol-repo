import { Box, Button, Checkbox, DataList, Dialog, Flex, RadioCards, Select, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useMultiStepReducer } from "../../../context/MultiStepFormProvider";

const dateFormatMapping = {
  1: "Date Month Year",
  2: "Month Date Year",
  3: "Year Date Month",
  4: "Year Month Date",
};

function StepOne({ lat, long, setCurrentStep }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { state, dispatchMultiStep, savedHeaders } = useMultiStepReducer();

  useEffect(() => {
    if (savedHeaders.columnHeaders) {
      console.log("Saved Headers:", savedHeaders.columnHeaders);
      setDialogOpen(true);
    }
  }, [savedHeaders]);

  function handleDateTimeSameCheckbox() {
    dispatchMultiStep({ type: "TOGGLE_DATE_TIME_SAME_COLUMN" });
  }

  function handleDateFormatChange(value) {
    dispatchMultiStep({ type: "SET_DATE_FORMAT", payload: value });
  }

  function handleRadioChange(value) {
    dispatchMultiStep({ type: "SET_RADIO_VALUE", payload: value });
  }

  function handleUseSavedHeaders() {
    dispatchMultiStep({ type: "USE_SAVED_HEADERS", payload: savedHeaders });
    setCurrentStep(3);
    setDialogOpen(false);
  }

  return (
    <>
      <Box maxWidth="600px">
        <Flex direction={"column"} gap={"6"}>
          <DataList.Root size="2">
            <DataList.Item align="center">
              <DataList.Label minWidth="88px">
                <Text as="span" weight={"bold"}>
                  {"Latitude".toUpperCase()}
                </Text>
              </DataList.Label>
              <DataList.Value>{lat.toFixed(2)}</DataList.Value>
            </DataList.Item>
            <DataList.Item align="center">
              <DataList.Label minWidth="88px">
                <Text as="span" weight={"bold"}>
                  {"Longitude".toUpperCase()}
                </Text>
              </DataList.Label>
              <DataList.Value>{long.toFixed(2)}</DataList.Value>
            </DataList.Item>
          </DataList.Root>
          <div>Choose Calculation you want to perform</div>
          <Flex direction="column" width="100%" align={"center"}>
            <RadioCards.Root columns={"2"} onValueChange={handleRadioChange} value={state.mode}>
              <RadioCards.Item value="pvPower">
                <Flex direction="column" width="100%" align={"center"}>
                  <Text size={"2"} weight="bold">
                    PV Power
                  </Text>
                </Flex>
              </RadioCards.Item>
              <RadioCards.Item value="solarRadiation">
                <Flex direction="column" width="100%" align={"center"}>
                  <Text weight="bold">Solar Radiation</Text>
                </Flex>
              </RadioCards.Item>
            </RadioCards.Root>
          </Flex>
          

          {/* <Text as="label" size="3">
            <Flex gap="2">
              <Checkbox
                variant="classic"
                color="green"
                checked={state.isDateTimeSameColumn}
                onCheckedChange={handleDateTimeSameCheckbox}
              />
              Are date and time in same column?
            </Flex>
          </Text> */}

<Text as="label" size="3">
  Are date and time in same column?
<Flex gap="3" align="center" mt="2">
  <label>
    <input
      type="radio"
      name="dateTimeSame"
      value="yes"
      checked={state.isDateTimeSameColumn === true}
      onChange={() => handleDateTimeSameCheckbox(true)}
    />
    Yes
  </label>
  <label>
    <input
      type="radio"
      name="dateTimeSame"
      value="no"
      checked={state.isDateTimeSameColumn === false}
      onChange={() => handleDateTimeSameCheckbox(false)}
    />
    No
  </label>
</Flex>
</Text>



          <Flex gap={"2"}>
            Select Format of Date:
            <Select.Root onValueChange={handleDateFormatChange} value={state.dateFormat}>
              <Select.Trigger placeholder="Select an option">
                {dateFormatMapping[state.dateFormat] || "Select an option"}
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  <Select.Label>Date Format</Select.Label>
                  <Select.Item value="1">Date Month Year</Select.Item>
                  <Select.Item value="2">Month Date Year</Select.Item>
                  <Select.Item value="3">Year Date Month</Select.Item>
                  <Select.Item value="4">Year Month Date</Select.Item>
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </Flex>
        </Flex>
      </Box>


<Dialog.Root open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <Dialog.Content width={"20vw"}>
          <Dialog.Title>Saved Headers</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Do you want to use the saved Headers?
          </Dialog.Description>

          <Flex gap="3" mt="4" justify="end">
            <Button onClick={handleUseSavedHeaders}>Yes</Button>
            <Button variant="soft" color="gray" onClick={() => setDialogOpen(false)}>
              No
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
  
      
    </>
  );
}

export default StepOne;
