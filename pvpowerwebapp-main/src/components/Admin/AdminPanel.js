import { Box, Tabs } from "@radix-ui/themes";
import { ToastContainer } from "react-toastify";
import PaymentsTable from "./PaymentsTable";
import PlanTable from "./PlanTable";
import UserTable from "./UserTable";

function AdminPanel() {
  return (
    <div className="plot__container">
      <Tabs.Root defaultValue="users">
        <Tabs.List>
          <Tabs.Trigger value="users">User</Tabs.Trigger>
          <Tabs.Trigger value="payments">Payments</Tabs.Trigger>
          <Tabs.Trigger value="plans">Plans</Tabs.Trigger>
        </Tabs.List>

        <Box pt="3">
          <Tabs.Content value="users">
            <UserTable />
          </Tabs.Content>

          <Tabs.Content value="payments">
            <PaymentsTable />
          </Tabs.Content>

          <Tabs.Content value="plans">
            <PlanTable />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default AdminPanel;
