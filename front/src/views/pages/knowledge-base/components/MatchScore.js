import { Percent } from "react-feather";
import { Badge } from "reactstrap";

export const MatchScore = ({ score }) => {

  const getColor = (score) => {
    if (score > 0.8) {
      return "success";
    } else if (score > 0.6) {
      return "info";
    } else if (score > 0.4) {
      return "warning";
    } else {
      return "danger";
    }
  };

  return (
    <div>
      <Badge lg pill color={getColor(score)}>
        {(score * 100).toFixed(0)}%
      </Badge>
    </div>
  );
};
