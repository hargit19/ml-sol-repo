import { BadgeIcon, BarChartIcon, CircleBackslashIcon, ResetIcon, SketchLogoIcon } from "@radix-ui/react-icons";
import { AlertDialog, Badge, Button, Flex, Table } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { blockUserFlow, getAllPaymentsFlow, unblockUserFlow } from "../../api/adminFlow";

function UserBlockDialog({ userId, active, setPayments }) {
  async function handleBlockUser(userId) {
    const result = await blockUserFlow(userId);
    if (result.status !== "success") {
      toast.error("Error blocking user. Please try again.");
      return;
    }
    toast.success("User blocked successfully");
    setPayments((prev) =>
      prev.map((payment) =>
        payment.userId._id === userId ? { ...payment, userId: { ...payment.userId, active: false } } : payment
      )
    );
  }

  async function handleUnblockUser(userId) {
    const result = await unblockUserFlow(userId);
    if (result.status !== "success") {
      toast.error("Error unblocking user. Please try again.");
      return;
    }
    toast.success("User unblocked successfully");
    setPayments((prev) =>
      prev.map((payment) =>
        payment.userId._id === userId ? { ...payment, userId: { ...payment.userId, active: true } } : payment
      )
    );
  }

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        {active ? (
          <Button size={"1"} color="red">
            <CircleBackslashIcon />
            Block User
          </Button>
        ) : (
          <Button size={"1"} color="purple">
            <ResetIcon />
            Unblock User
          </Button>
        )}
      </AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>Revoke access</AlertDialog.Title>
        <AlertDialog.Description size="2">
          {active
            ? "Are you sure? This user will no longer be able to access the website."
            : "Are you sure? This user will be able to access the website."}
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            {active ? (
              <Button color="red" onClick={() => handleBlockUser(userId)}>
                <CircleBackslashIcon />
                Block User
              </Button>
            ) : (
              <Button color="purple" onClick={() => handleUnblockUser(userId)}>
                <ResetIcon />
                Unblock User
              </Button>
            )}
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}

function PaymentsTable() {
  const [payments, setPayments] = useState(null);

  useEffect(() => {
    async function handleGetAllPayments() {
      // console.log("getting all payments is triggered");
      const result = await getAllPaymentsFlow();
      console.log("payment result from frontend", result.data.payments);
      if (result.status !== "success") {
        toast.error("Error fetching payments. Please try again.");
        return;
      }
      setPayments(result.data.payments);
    }
    handleGetAllPayments();
  }, []);
  return (
    <>
      {!payments && "Error fetching payments"}
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Username</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Full Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Phone Number</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Plan</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Start Date</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Expiry Date</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {payments
            ? payments.map((payment) => {
                return (
                  <Table.Row key={payment._id}>
                    <Table.RowHeaderCell>{payment.userId.username}</Table.RowHeaderCell>
                    <Table.Cell>{payment.userId.email}</Table.Cell>
                    <Table.Cell>{payment.userId.name}</Table.Cell>
                    <Table.Cell>{payment.userId.phone}</Table.Cell>
                    <Table.Cell>
                      {payment.currentPlanId.plan_displayName === "freePlan" ? (
                        <Badge size={"2"} color="green">
                          <BadgeIcon />
                          {payment.currentPlanId.plan_displayName}
                        </Badge>
                      ) : null}
                      {payment.currentPlanId.plan_displayName === "premium" ? (
                        <Badge size={"2"} color="blue">
                          <BarChartIcon />
                          {payment.currentPlanId.plan_displayName}
                        </Badge>
                      ) : null}
                      {payment.currentPlanId.plan_displayName === "enterprise" ? (
                        <Badge size={"2"} color="purple">
                          <SketchLogoIcon />
                          {payment.currentPlanId.plan_displayName}
                        </Badge>
                      ) : null}
                    </Table.Cell>
                    <Table.Cell>{new Date(payment.planStartDate).toLocaleDateString("en-GB")}</Table.Cell>
                    <Table.Cell>{new Date(payment.planExpiryDate).toLocaleDateString("en-GB")}</Table.Cell>
                    <Table.Cell>
                      <UserBlockDialog
                        userId={payment.userId._id}
                        active={payment.userId.active}
                        setPayments={setPayments}
                      />
                    </Table.Cell>
                  </Table.Row>
                );
              })
            : null}
        </Table.Body>
      </Table.Root>
    </>
  );
}

export default PaymentsTable;
