import { DataList, Text } from "@radix-ui/themes";
import { useMultiStepReducer } from "../../../context/MultiStepFormProvider";

const mappedHeaders = {
  date: "Date",
  time: "Time",
  airTemp: "Air Temp",
  windSpeed: "Wind Speed",
  RH: "RH",
  solarRadiation: "Solar Radiation",
  passiveCloudCover: "Passive Cloud Cover",
  dewPtTemp: "Dew Pt. Temp",
  rainfall: "Rainfall",
  pvPower: "PV Power",
};

function DataListItem({ title, value }) {
  return (
    <DataList.Item align="center">
      <DataList.Label minWidth="88px">
        <Text as="span" weight="bold">
          {mappedHeaders[title].toUpperCase()}
        </Text>
      </DataList.Label>
      <DataList.Value>{value}</DataList.Value>
    </DataList.Item>
  );
}

function DataListColumns() {
  const { state } = useMultiStepReducer();
  

  return (
    <div className="relative">
      {/* Actual Data List */}
      <DataList.Root size="1" className="relative z-0">
        {Object.entries(state.columnHeaders).map(([key, value]) => {
          if (value === "") return null;
          return <DataListItem key={key} title={key} value={value} />;
        })}
      </DataList.Root>
    </div>
  );
}

export default DataListColumns;
