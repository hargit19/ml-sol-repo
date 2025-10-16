import { Button } from "@radix-ui/themes";
import ReactLoading from "react-loading";
import { useNavigate } from "react-router-dom";

function CalcLoading() {
  const navigate = useNavigate();
  return (
    <div className="sbmt-modal-childs">
      <p
        style={{
          marginBottom: "5px",
          fontSize: "22px",
          fontWeight: "550",
        }}
        className="calculating"
      >
        Calculating
      </p>
      <ReactLoading type={"bars"} color={"blue"} height={"100px"} width={"100px"} />
      <p className="desc-txt">Calculation will take some time. You can close the window or view your data.</p>
      <div className="btns">
        <Button className="sample-graph" onClick={() => navigate("/dashboard/visualise")}>
          Visualize
        </Button>
        <Button className="cancel-sbmt">Cancel Calculation</Button>
      </div>
    </div>
  );
}

export default CalcLoading;
