import { DownloadIcon, TrashIcon } from "@radix-ui/react-icons";
import { AlertDialog, Box, Button, Flex, IconButton, Text, Tooltip } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllPredictedDataFlow, handleDeleteDataFlow } from "../../api/predictedDataFlow.js";
import { useAuth } from "../../context/AuthProvider.js";
import "../../css/Dashboard/UserHistory.css";
import { handleDownloadFile } from "../../utils/downloadFile.js";

function UserHistoy() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [history, setHistory] = useState(null);
  const [dialogOpen, setDialogOpen] = useState({ open: false, id: null });

  async function handleGetHistory() {
    const result = await getAllPredictedDataFlow();
    if (result.status !== "success") {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    const historyData = result.data.predictedData;

    if (historyData.length === 0) {
      return;
    }

    const sortedHistory = historyData.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      if (dateA > dateB) return -1;
      if (dateA < dateB) return 1;

      const timeA = dateA.getTime();
      const timeB = dateB.getTime();

      return timeA - timeB;
    });

    setHistory(sortedHistory);
  }

  useEffect(() => {
    handleGetHistory();
  }, []);

  function handleShowView(date) {
    navigate(`/dashboard/forecast?date=${date}`);
    toast.info(`Viewing Forecast for Data uploaded on ${new Date(date).toLocaleDateString("en-US")}.`);
  }

  function handleDeleteHistory(id) {
    setDialogOpen({ open: true, id });
  }

  async function handleConfirmDelete() {
    const id = dialogOpen.id;
    setDialogOpen({ open: false, id: null });
    const result = await handleDeleteDataFlow(id);
    if (result.status !== "success") {
      toast.error("Something went wrong.");
      return;
    }

    const sortedHistory = result.data.predictedData.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      if (dateA > dateB) return -1;
      if (dateA < dateB) return 1;

      const timeA = dateA.getTime();
      const timeB = dateB.getTime();

      return timeA - timeB;
    });

    setHistory(sortedHistory);
    toast.success("Deleted Successfully");
  }

  if (!history) {
    return (
      <Box width={"20vw"} className="centeredBox">
        <Flex direction={"row"} gap={"4"} justify={"center"}>
          <div>
            <Text as="p" size={"4"} weight={"bold"}>
              No History Found.
            </Text>
          </div>
        </Flex>
      </Box>
    );
  }

  return (
    <div className="main__history">
      {history.map((data) => {
        return (
          <div className="history__item" key={data._id}>
            <p className="item__date">
              <span className="date">Data uploaded on {new Date(data.date).toLocaleDateString("en-GB")}</span>
            </p>
            <button className="view-history" onClick={() => handleShowView(data.date)}>
              View
            </button>
            <Tooltip content="Download File">
              <IconButton className="download-history" onClick={() => handleDownloadFile(user.username, data.date)}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip content="Delete File">
              <IconButton className="delete-history" onClick={() => handleDeleteHistory(data._id)}>
                <TrashIcon />
              </IconButton>
            </Tooltip>
          </div>
        );
      })}
      <AlertDialog.Root open={dialogOpen.open} onClose={() => setDialogOpen({ open: false, id: null })}>
        <AlertDialog.Content maxWidth="450px">
          <AlertDialog.Title>Delete Data</AlertDialog.Title>
          <AlertDialog.Description size="2">
            Are you sure? This data will no longer be accessible.
          </AlertDialog.Description>

          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray" onClick={() => setDialogOpen({ open: false, id: null })}>
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button variant="solid" color="red" onClick={handleConfirmDelete}>
                Delete Data
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </div>
  );
}

export default UserHistoy;
