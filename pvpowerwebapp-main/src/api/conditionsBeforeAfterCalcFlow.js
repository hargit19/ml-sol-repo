import { getPaymentFlow } from "./paymentFlow";
import { updateUserFlow } from "./userFlow";

export async function conditionsBeforeCalcFlow(id) {
  const result = await getPaymentFlow(id);

  console.log("result",result);

  if (result.status !== "success") {
    return "Something went wrong. Please try again.";
  }

  const userPayment = result.data.userPayment;

  const modelLimit = userPayment.currentPlanId.plan_run_limit_per_day;

  const userModelRuns = userPayment.userId.modelRuns;

  const modelDuration = userPayment.currentPlanId.plan_duration;
  // console.log("userPayment", userPayment);
  const startDate = new Date(userPayment.planStartDate);
  const currentDate = new Date();
  // console.log("start date",startDate);

    const diffInMs = currentDate - startDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    console.log(`${diffInDays} days have passed between the two dates.`);

    if (modelDuration <= diffInDays) {
      return (
        <>
          Your current plan is over. To renew, click{" "}
          <a href="/pricing" style={{ textDecoration: "underline", color: "#007bff",  }}>
            here
          </a>
        </>
      );
      
    }
  
  // console.log("difference", diffInDays);
  // console.log("model duration", modelDuration);


  if (modelLimit <= userModelRuns) {
    return "You have exceeded the limit of model runs for today. Please upgrade your plan or try a different model";
  }
  return "success";
}

export async function updateModelRunsFlow(id) {

  const res = await getPaymentFlow(id);
  console.log("res", res);

  if (!res.status === "success") {
    return "Something went wrong. Please try again.";
  }

  const obj = {
    modelRuns: res.data.userPayment.userId.modelRuns + 1,
  };


  const result = await updateUserFlow(obj);
  if (result.status !== "success") {
    return "Something went wrong. Please try again.";
  }

  console.log("result", result);
}
