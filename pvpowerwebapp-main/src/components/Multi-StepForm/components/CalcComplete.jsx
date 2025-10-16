import { Button } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import donegif from "../../../Images/41793-correct.gif";

function CalcComplete({ onclose }) {
  const navigate = useNavigate();
  
  return (
    <div className="sbmt-modal-childs">
      <p className="calculating">Calculating Done!</p>
      <img src={donegif} alt="correct gif" />
      <p className="desc-txt">You can view your today's calculation at any time in the history tab.</p>
      <div className="btns">
        <Button className="sample-graph" onClick={() => navigate("/dashboard/forecast")}>
          View Results
        </Button>
        <Button className="cancel-sbmt" onClick={onclose}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default CalcComplete;