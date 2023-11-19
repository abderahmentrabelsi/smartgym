import { ShortenText } from "@src/utility/StringUtils";
import { MatchScore } from "@src/views/pages/knowledge-base/components/MatchScore";
import { Link } from "react-router-dom";
import { CardBody } from "reactstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import CardAction from '@components/card-actions'

export const TooLongDidntRead = ({ article }) => {

  return (
    <CardAction actions="collapse" title="TL;DR">
      <CardBody>
        <p style={{ textAlign: "justify" }}>{article.abstract}</p>
      </CardBody>
    </CardAction>
  );
};
