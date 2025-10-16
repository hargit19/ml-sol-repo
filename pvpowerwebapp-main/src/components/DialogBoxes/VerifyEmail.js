import { Button, Dialog, Em, Flex, Text, TextField } from "@radix-ui/themes";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { sendVerificationEmailFlow, verifyEmailFlow } from "../../api/authenticationFlow";

function VerifyEmail({ payment, setPayment, dialogOpen, setDialogOpen }) {
  const [verifyCode, setVerifyCode] = useState("");

  async function sendVerificationEmail() {
    const result = await sendVerificationEmailFlow(false);
    if (result.status !== "success") {
      toast.error("Something went wrong. Please try again.");
    }
  }

  async function forceSendVerificationEmail() {
    const result = await sendVerificationEmailFlow(true);
    if (result.status !== "success") {
      toast.error("Something went wrong. Please try again.");
    } else {
      toast.success("Verification code sent successfully");
    }
  }

  async function handleVerify() {
    if (verifyCode.length !== 6) {
      toast.error("Please enter a valid 6 digit code");
      return;
    }
    const result = await verifyEmailFlow(verifyCode);
    if (result.status === "success") {
      toast.success("Email verified successfully");
      setPayment({ ...payment, userId: { ...payment.userId, verifiedEmail: true } });
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <>
      <Dialog.Root open={dialogOpen} onClose={() => setDialogOpen(false)}>
        {dialogOpen === undefined ? (
          <Dialog.Trigger>
            <Button
              size={"1"}
              onClick={() => {
                sendVerificationEmail();
                setVerifyCode("");
                if (setDialogOpen) setDialogOpen(true);
              }}
            >
              Verify Email hello
            </Button>
          </Dialog.Trigger>
        ) : null}

        <Dialog.Content maxWidth="450px">
          <Dialog.Title>Verify Your Email</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Code sent to{" "}
            <Text color="green">
              <Em>{payment.userId.email}</Em>
            </Text>
            <Text as="span" style={{ marginTop: "0.5rem", display: "block" }}>
              Didn't receive the code.{" "}
              <Button size={"1"} variant="outline" radius="full" onClick={forceSendVerificationEmail}>
                Click here to send again
              </Button>
            </Text>
          </Dialog.Description>

          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Verification Code
              </Text>
              <TextField.Root
                type="number"
                value={verifyCode}
                placeholder="Enter your 6 digit code"
                onChange={(e) => {
                  const input = e.target.value.trim();
                  if (input.length <= 6) setVerifyCode(input);
                }}
              />
            </label>
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button
                variant="soft"
                color="gray"
                onClick={() => {
                  if (setDialogOpen) setDialogOpen(false);
                }}
              >
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button onClick={handleVerify}>Verify</Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default VerifyEmail;