import React, { useEffect, useState } from "react";
import { 
  BadgeIcon, 
  BarChartIcon, 
  Pencil2Icon, 
  SketchLogoIcon,
  CheckIcon, 
  PersonIcon
} from "@radix-ui/react-icons";
import { 
  Avatar, 
  Badge, 
  Button, 
  Card, 
  DataList, 
  Dialog, 
  Flex, 
  Heading, 
  Text, 
  TextField 
} from "@radix-ui/themes";
import { getPaymentFlow } from "../../api/paymentFlow.js";
import { useAuth } from "../../context/AuthProvider.js";
import { updateUserFlow } from "../../api/userFlow.js";
import { toast } from "react-toastify";
import VerifyEmail from "../DialogBoxes/VerifyEmail.js";
import VerifyPhone from "../DialogBoxes/VerifyPhone.js";
import "../../css/Dashboard/UserAccount.css";

function EditProfileDialog({ paymentPlan, setPaymentPlan }) {
  const [username, setUsername] = useState(paymentPlan.userId.username);
  const [email, setEmail] = useState(paymentPlan.userId.email);
  const [phone, setPhone] = useState(paymentPlan.userId.phone);
  const [address, setAddress] = useState(paymentPlan.userId.address);
  const [dialogOpen, setDialogOpen] = useState(false);

  async function handleEditPlan() {
    const updateObj = { username, email, phone, address };
    const result = await updateUserFlow(updateObj);
    if (result.status !== "success") {
      toast.error("Could not save changes. Please try again.");
      return;
    }
    toast.success("Saved changes successfully");
    const dialogUser = result.data.user;
    setPaymentPlan({ ...paymentPlan, userId: dialogUser });
    setDialogOpen(false);
  }

  return (
    <Dialog.Root open={dialogOpen} onClose={() => setDialogOpen(false)}>
      <Dialog.Trigger>
        <Button
          size={"2"}
          className="edit-profile-btn"
          onClick={() => {
            setDialogOpen(true);
            setUsername(paymentPlan.userId.username);
            setEmail(paymentPlan.userId.email);
            setPhone(paymentPlan.userId.phone);
            setAddress(paymentPlan.userId.address);
          }}
        >
          <Pencil2Icon />
          Edit Profile
        </Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px" className="edit-dialog">
        <Dialog.Title>Edit Profile</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Make changes to your profile.
        </Dialog.Description>

        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Username
            </Text>
            <TextField.Root
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value.trim())}
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Email
            </Text>
            <TextField.Root
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Phone Number
            </Text>
            <TextField.Root
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.trim())}
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Address
            </Text>
            <TextField.Root
              type="text"
              placeholder="Enter your billing address"
              value={address}
              onChange={(e) => setAddress(e.target.value.trim())}
            />
          </label>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button onClick={() => setDialogOpen(false)} variant="soft" color="orange" className="cancel-btn">
              Cancel
            </Button>
          </Dialog.Close>
          <Button onClick={handleEditPlan} className="save-btn">Save</Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}

function getPlanBadge(planName) {
  if (planName === "freePlan") {
    return (
      <Badge size="2" className="plan-badge free">
        <BadgeIcon />
        {planName}
      </Badge>
    );
  } else if (planName === "enterprise") {
    return (
      <Badge size="2" className="plan-badge premium">
        <BarChartIcon />
        {planName}
      </Badge>
    );
  } else if (planName === "premium") {
    return (
      <Badge size="2" className="plan-badge professional">
        <CheckIcon />
        {planName}
      </Badge>
    );
  } else if (planName === "Enterprise") {
    return (
      <Badge size="2" className="plan-badge enterprise">
        <SketchLogoIcon />
        {planName}
      </Badge>
    );
  }
  return null;
}

function UserAccount() {
  const { user } = useAuth();
  const [paymentPlan, setPaymentPlan] = useState(null);

  useEffect(() => {
    async function getPaymentPlan() {
      const result = await getPaymentFlow(user._id);
      setPaymentPlan(result.data.userPayment);
    }
    getPaymentPlan();
  }, [user._id]);

  if (!paymentPlan) {
    return (
      <div className="main-container loading">
        <div className="main-header">
          <p className="header-greeting">Welcome {user.username}</p>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your account details...</p>
        </div>
      </div>
    );
  }

  const planName = paymentPlan.currentPlanId.plan_displayName;
  const usagePercent = Math.min(
    (paymentPlan.userId.modelRuns / paymentPlan.currentPlanId.plan_run_limit_per_day) * 100,
    100
  );

  return (
    <div className="main-container">
      <div className="main-header">
        <p className="header-greeting">
          Welcome Back, {paymentPlan.userId.username}
        </p>
      </div>

      <div className="account-container">
        <h2 className="account-title">Account Details</h2>

        <div className="account-content">
          <div className="profile-card-container">
            <Card size="3" className="profile-card">
              <Flex gap="4" direction="column" align="center">
                <div className="profile-avatar">
                  {paymentPlan.userId.username.charAt(0).toUpperCase()}
                </div>
                <Flex gap="1" justify="center" align="center" direction="column">
                  <Text as="div" size="5" weight="bold" className="username">
                    {paymentPlan.userId.username}
                  </Text>
                  <Text as="div" size="4" className="plan-name">
                    {getPlanBadge(planName)}
                  </Text>

                  <div className="usage-meter">
                    <div className="usage-label">
                      <Text as="div" size="2">Usage Today:</Text>
                      <Text as="div" size="2">{paymentPlan.userId.modelRuns} / {paymentPlan.currentPlanId.plan_run_limit_per_day}</Text>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${usagePercent}%` }}
                      ></div>
                    </div>
                  </div>
                </Flex>
              </Flex>
            </Card>
            <EditProfileDialog paymentPlan={paymentPlan} setPaymentPlan={setPaymentPlan} />
          </div>

          <div className="details-section">
            <Card size="3" className="details-card">
              <DataList.Root size="3" className="data-list">
                <DataList.Item>
                  <DataList.Label minWidth="130px">Full Name</DataList.Label>
                  <DataList.Value>{paymentPlan.userId.name || 'Not set'}</DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label minWidth="130px">Email</DataList.Label>
                  <DataList.Value>
                    <Flex gap="2" align="center">
                      {paymentPlan.userId.email}
                      {paymentPlan.userId.verifiedEmail ? (
                        <Badge size="1" className="verified-badge">Verified</Badge>
                      ) : (
                        <Flex gap="2" align="center">
                          <Badge size="1" className="unverified-badge">Unverified</Badge>
                          <VerifyEmail payment={paymentPlan} setPayment={setPaymentPlan} />
                        </Flex>
                      )}
                    </Flex>
                  </DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label minWidth="130px">Phone Number</DataList.Label>
                  <DataList.Value>
                    <Flex gap="2" align="center">
                      {paymentPlan.userId.phone || 'Not set'}
                      {paymentPlan.userId.verifiedPhone ? (
                        <Badge size="1" className="verified-badge">Verified</Badge>
                      ) : paymentPlan.userId.phone ? (
                        <Flex gap="2" align="center">
                          <Badge size="1" className="unverified-badge">Unverified</Badge>
                          <VerifyPhone payment={paymentPlan} setPayment={setPaymentPlan} />
                        </Flex>
                      ) : null}
                    </Flex>
                  </DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label minWidth="130px">Billing Address</DataList.Label>
                  <DataList.Value>{paymentPlan.userId.address || 'Not set'}</DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label minWidth="130px">Current Plan</DataList.Label>
                  <DataList.Value>{getPlanBadge(planName)}</DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label minWidth="130px">Plan Start Date</DataList.Label>
                  <DataList.Value>{new Date(paymentPlan.planStartDate).toLocaleDateString("en-GB")}</DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label minWidth="130px">Plan Expiry Date</DataList.Label>
                  <DataList.Value>{new Date(paymentPlan.planExpiryDate).toLocaleDateString("en-GB")}</DataList.Value>
                </DataList.Item>
              </DataList.Root>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserAccount;
