import { AlertDialog, Badge, Button, Flex, Table } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { blockUserFlow, getAllUsersFlow, unblockUserFlow } from "../../api/adminFlow";
import { CircleBackslashIcon, GearIcon, PersonIcon, ResetIcon } from "@radix-ui/react-icons";

function UserBlockDialog({ userId, active, setUsers }) {
  async function handleBlockUser(userId) {
    const result = await blockUserFlow(userId);
    if (result.status !== "success") {
      toast.error("Error blocking user. Please try again.");
      return;
    }
    toast.success("User blocked successfully");
    setUsers((prev) => prev.map((user) => (user._id === userId ? { ...user, active: false } : user)));
  }

  async function handleUnblockUser(userId) {
    const result = await unblockUserFlow(userId);
    if (result.status !== "success") {
      toast.error("Error unblocking user. Please try again.");
      return;
    }
    toast.success("User unblocked successfully");
    setUsers((prev) => prev.map((user) => (user._id === userId ? { ...user, active: true } : user)));
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

function UserTable() {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    async function handleGetAllUsers() {
      const result = await getAllUsersFlow();
      if (result.status !== "success") {
        toast.error("Error fetching users. Please try again.");
        return;
      }
      console.log("all users", result.data.users);
      setUsers(result.data.users);
    }
    handleGetAllUsers();
  }, []);

  return (
    <>
      {!users && "Error fetching users"}
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Username</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Full Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Phone Number</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Verified</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Active</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {users
            ? users.map((user) => (
                <Table.Row key={user._id}>
                  <Table.RowHeaderCell>{user.username}</Table.RowHeaderCell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.name}</Table.Cell>
                  <Table.Cell>{user.phone}</Table.Cell>
                  <Table.Cell>
                    {user.role === "admin" ? (
                      <Badge size={"2"} color="orange">
                        <GearIcon />
                        Admin
                      </Badge>
                    ) : (
                      <Badge size={"2"} color="blue">
                        <PersonIcon />
                        User
                      </Badge>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {user.verifiedEmail && user.verifiedPhone ? (
                      <Badge size={"2"} color="green">
                        Verified
                      </Badge>
                    ) : (
                      <Badge size={"2"} color="red">
                        Unverified
                      </Badge>
                    )}
                  </Table.Cell>
                  <Table.Cell>{user.active ? "Yes" : "No"}</Table.Cell>
                  <Table.Cell>
                    <UserBlockDialog userId={user._id} active={user.active} setUsers={setUsers} />
                  </Table.Cell>
                </Table.Row>
              ))
            : null}
        </Table.Body>
      </Table.Root>
    </>
  );
}

export default UserTable;
