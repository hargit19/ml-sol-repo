import { Box, Tabs } from "@radix-ui/themes";
import UserHistoy from "./UserHistoy";
import ValidationHistory from "./ValidationHistory";

function History() {
  return (
    <div className="main__container">
      <Tabs.Root defaultValue="history">
        <Tabs.List size="3">
          <Tabs.Trigger value="history">History</Tabs.Trigger>
          <Tabs.Trigger value="validation">Validation</Tabs.Trigger>
        </Tabs.List>

        <Box pt="3">
          <Tabs.Content value="history">
            <UserHistoy />
          </Tabs.Content>

          <Tabs.Content value="validation">
            <ValidationHistory />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </div>
  );
}

export default History;
