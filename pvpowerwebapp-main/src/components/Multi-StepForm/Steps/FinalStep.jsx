import { CheckCircledIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Box, Callout, Flex, Separator, Text } from "@radix-ui/themes";
import { useState } from "react";
import { useMultiStepReducer } from "../../../context/MultiStepFormProvider";
import getDataFile from "../../../utils/excelFileVerify";
import DataListColumns from "../components/DataListColumns";
import style from "./FinalStep.module.css";

function FinalStep({ setFileStatus }) {
  const { state, dispatchMultiStep } = useMultiStepReducer();
  const [messageDis, setMessageDis] = useState(null);

  async function handleFileChange(event) {
    const file = event.target.files[0];
    const result = await getDataFile(file, state);

    if (result.status === "error") {
      setMessageDis({ status: result.status, message: result.message });
      return;
    }
    setMessageDis({ status: result.status, message: result.message });
    dispatchMultiStep({ type: "SET_DATA", payload: result.data });
    setFileStatus(true);
  }
  return (
    <Box>
      <Flex direction={"column"} gap={"4"}>
        <DataListColumns />
        <Separator orientation="horizontal" size="4" />
        <div>
          <Text as="p" size={"2"} weight={"medium"}>
            Upload your .xlsx, .csv or .xls file:
          </Text>
          <input type="file" className={style.FileInput} onChange={handleFileChange} accept=".xlsx, .xls, .csv" style={{backgroundColor : "white" , color : "gray" , border : "none"}} />
        </div>
        {messageDis && (
          <Callout.Root color={messageDis.status === "error" ? "red" : "green"} size={"1"}>
            <Callout.Icon>
              {messageDis.status === "error" ? <ExclamationTriangleIcon /> : <CheckCircledIcon />}
            </Callout.Icon>
            <Callout.Text style={{ marginBottom: "0" }}>{messageDis.message}</Callout.Text>
          </Callout.Root>
        )}
      </Flex>
    </Box>
  );
}

export default FinalStep;
