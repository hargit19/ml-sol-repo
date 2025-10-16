import { Table, TextField } from "@radix-ui/themes";
import * as React from "react";
import { useMultiStepReducer } from "../../../context/MultiStepFormProvider";
import SelectColumn from "../components/SelectColumn";
import { Box, Button, Checkbox, DataList, Dialog, Flex, RadioCards, Select, Text } from "@radix-ui/themes";

function StepTwo() {
  const [dialogOpen, setDialogOpen] = React.useState(true); // open by default
  const { state, dispatchMultiStep } = useMultiStepReducer();

  function handleDataStartRow(e) {
    dispatchMultiStep({ type: "SET_DATA_START_ROW", payload: e.target.value });
  }

  if (state.isDateTimeSameColumn && state.columnHeaders.time !== "") {
    dispatchMultiStep({ type: "SET_COLUMN", payload: { time: "" } });
  }
  if (state.mode !== "pvPower" && state.columnHeaders.pvPower !== "") {
    dispatchMultiStep({ type: "SET_COLUMN", payload: { pvPower: "" } });
  }

  return (
    <>
      <div style={{ fontSize: "14px", marginBottom: "7px" }}>
        Please select the columns in your data files according to following variables:
      </div>
      <Table.Root variant="surface">
        <Table.Body>
          <SelectColumn title="Date" objkey="date" />
          {state.isDateTimeSameColumn ? null : <SelectColumn title="Time" objkey="time" />}
          <SelectColumn title="Air Temp" objkey={"airTemp"} />
          <SelectColumn title="Wind Speed" objkey={"windSpeed"} />
          <SelectColumn title="RH" objkey={"RH"} />
          <SelectColumn title="Solar Radiation" objkey={"solarRadiation"} />
          <SelectColumn title="Passive Cloud Cover" objkey={"passiveCloudCover"} />
          <SelectColumn title="Dew Pt. Temp" objkey={"dewPtTemp"} />
          <SelectColumn title="Rainfall" objkey={"rainfall"} />
          {state.mode === "pvPower" && <SelectColumn title="PV Power" objkey={"pvPower"} />}
          <Table.Row>
            <Table.RowHeaderCell>
              From which row does the data start? (excluding headers)
            </Table.RowHeaderCell>
            <Table.Cell>
              <TextField.Root
                type="number"
                size="2"
                onChange={handleDataStartRow}
                value={state.dataStartRow}
                
              />
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>

      {/* Radix Themes Dialog */}
      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Content maxWidth="850px">
          <Dialog.Title>Disclaimer</Dialog.Title>
          <Dialog.Description size="2" mb="4" color="gray">
            1. Be extra careful while filling the column names in the upcoming dialog box. <br></br><br></br>
           
            2. Match the columns in the same manner as from the excel file that you are uploading. Making the wrong matching will result in wrong calculation and display of data. <br></br><br></br>
            
            3. Ensure the date and time are in their correct format. (Example - Date: 12-10-2025 : Time: 12:45:15)<br></br><br></br>

            4. Use the following image as a reference to the format of the file to be uploaded. (Only include the relevant columns according to your need.)<br></br><br></br>
            <img src="/demo.png" style={{height: "18rem" , width : "100%"}} ></img>

          </Dialog.Description>

          <Flex gap="3" mt="4" justify="end">
            <Button variant="soft" color="gray" onClick={() => setDialogOpen(false)}>
              Close
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}

export default StepTwo;
