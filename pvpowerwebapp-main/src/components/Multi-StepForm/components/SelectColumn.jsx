import { Select, Table } from "@radix-ui/themes";
import { useMultiStepReducer } from "../../../context/MultiStepFormProvider";

function SelectColumn({ title, objkey }) {
  const { state, dispatchMultiStep } = useMultiStepReducer();
  const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(i + 65));

  const usedLetters = letters.filter((letter) => Object.values(state.columnHeaders).includes(letter));

  letters.unshift("No Column");

  function handleSelectValueChange(value) {
    dispatchMultiStep({ type: "SET_COLUMN", payload: { [objkey]: value === "No Column" ? "" : value } });
  }
  return (
    <Table.Row>
      <Table.RowHeaderCell>{title} : </Table.RowHeaderCell>
      <Table.Cell>
        <Select.Root size={"1"} onValueChange={handleSelectValueChange} value={state.columnHeaders[objkey]}>
          <Select.Trigger placeholder="No Column">{state.columnHeaders[objkey]}</Select.Trigger>
          <Select.Content>
            <Select.Group>
              <Select.Label>Select Column of Variable</Select.Label>
              {letters.map((letter) => (
                <Select.Item
                  key={letter}
                  value={letter === "No Column" ? "No Column" : letter}
                  disabled={usedLetters.includes(letter)}
                >
                  {letter}
                </Select.Item>
              ))}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </Table.Cell>
    </Table.Row>
  );
}

export default SelectColumn;
