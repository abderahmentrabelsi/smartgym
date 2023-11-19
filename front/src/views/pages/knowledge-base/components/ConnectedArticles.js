import { ShortenText } from "@src/utility/StringUtils";
import { MatchScore } from "@src/views/pages/knowledge-base/components/MatchScore";
import { Link } from "react-router-dom";
import { CardBody } from "reactstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import CardAction from '@components/card-actions'

export const ConnectedArticles = ({ entryId }) => {

  const [connectedArticles, setConnectedArticles] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_CRYSTAL_SPIDER_BASE_URL}/connected_articles?id=${entryId}`)
      .then(res => {
        setConnectedArticles(res.data);
      });
  }, [entryId]);


  return (
    <CardAction actions="collapse" title="Also relevant">
      <CardBody>
        <div className="d-flex flex-column gap-1">
          {
            !connectedArticles ? (
              <p>No connected articles found.</p>
            ) : (

              connectedArticles
                .filter(a => !!a.distance)
                .map((article) => {
                    return (
                      <div className="d-flex justify-content-between" key={`kb-${article.id}`}>
                        <Link to={`/pages/knowledge-base/${article.id}`}>
                        <span className="mb-0 text-primary">
                          {ShortenText(article.title, 32)}
                        </span>
                        </Link>
                        {article.distance && (
                          <MatchScore score={1 - article.distance} />
                        )}
                      </div>
                    );
                  }
                )
            )
          }</div>
      </CardBody>
    </CardAction>
  );
};
