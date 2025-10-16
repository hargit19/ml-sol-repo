import { BadgeIcon, BarChartIcon, Pencil2Icon, SketchLogoIcon } from "@radix-ui/react-icons";
import { Badge, Button, Dialog, Flex, Table, Text, TextField } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { editPlanFlow, getAllPlansFlow } from "../../api/adminFlow";

function EditPlanDialog({ plan, setPlans }) {
  const [price, setPrice] = useState(plan.plan_price);
  const [duration, setDuration] = useState(plan.plan_duration);
  const [runLimit, setRunLimit] = useState(plan.plan_run_limit_per_day);

  async function handleEditPlan() {
    const updateObj = { plan_price: price, plan_duration: duration, plan_run_limit_per_day: runLimit };
    const result = await editPlanFlow(plan._id, updateObj);
    if (result.status !== "success") {
      toast.error("Error saving changes. Please try again.");
      return;
    }
    toast.success("Saved changes successfully");
    const dialogPlan = { ...plan, ...updateObj };
    setPlans((prev) => prev.map((p) => (p._id === dialogPlan._id ? dialogPlan : p)));
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button
          size={"1"}
          color="blue"
          onClick={() => {
            setPrice(plan.plan_price);
            setDuration(plan.plan_duration);
            setRunLimit(plan.plan_run_limit_per_day);
          }}
        >
          <Pencil2Icon />
          Edit Plan
        </Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Edit {plan.plan_displayName} Plan</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Make changes to {plan.plan_displayName} Plan.
        </Dialog.Description>

        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Price
            </Text>
            <TextField.Root
              type="number"
              placeholder="Enter price for this plan"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Duration in Days
            </Text>
            <TextField.Root
              type="number"
              placeholder="Enter plan duration in days"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Plan Run Limit per Day
            </Text>
            <TextField.Root
              type="number"
              placeholder="Enter plan run limit per day"
              value={runLimit}
              onChange={(e) => setRunLimit(Number(e.target.value))}
            />
          </label>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Button onClick={handleEditPlan}>Save</Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}

function PlanTable() {
  const [plans, setPlans] = useState(null);

  useEffect(() => {
    async function handleGetAllPlans() {
      const result = await getAllPlansFlow();
      if (result.status !== "success") {
        toast.error("Error fetching plans. Please try again.");
        return;
      }
      setPlans(result.data.plans);
    }
    handleGetAllPlans();
  }, []);

  return (
    <>
      {!plans && "Error fetching plans"}
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Display Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Duration in Days</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Run Limit per Day</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Action</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {plans
            ? plans.map((plan) => (
                <Table.Row key={plan._id}>
                  <Table.RowHeaderCell>
                    {plan.plan_displayName === "freePlan" ? (
                      <Badge size={"2"} color="green">
                        <BadgeIcon />
                        {plan.plan_displayName}
                      </Badge>
                    ) : null}
                    {plan.plan_displayName === "premium" ? (
                      <Badge size={"2"} color="blue">
                        <BarChartIcon />
                        {plan.plan_displayName}
                      </Badge>
                    ) : null}
                    {plan.plan_displayName === "enterprise" ? (
                      <Badge size={"2"} color="purple">
                        <SketchLogoIcon />
                        {plan.plan_displayName}
                      </Badge>
                    ) : null}
                  </Table.RowHeaderCell>
                  <Table.Cell>Rs. {plan.plan_price}</Table.Cell>
                  <Table.Cell>{plan.plan_duration}</Table.Cell>
                  <Table.Cell>{plan.plan_run_limit_per_day}</Table.Cell>
                  <Table.Cell>
                    <EditPlanDialog plan={plan} setPlans={setPlans} />
                  </Table.Cell>
                </Table.Row>
              ))
            : null}
        </Table.Body>
      </Table.Root>
    </>
  );
}

export default PlanTable;
