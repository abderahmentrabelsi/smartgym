import { Link } from "react-router-dom";
import React, { Fragment, useState, useEffect } from "react";

import Breadcrumbs from "@components/breadcrumbs";
import KnowledgeBaseHeader from "./KnowledgeBaseHeader";

import { Row, Col, Card, CardBody } from "reactstrap";

import "@styles/base/pages/page-knowledge-base.scss";
import axios from "axios";

import { ShortenText } from "@src/utility/StringUtils";
import { MatchScore } from "@src/views/pages/knowledge-base/components/MatchScore";
import { Loader } from "@src/views/pages/knowledge-base/components/Loader";
import UILoader from "@components/ui-loader";
import CorrectedQuery from "@src/views/pages/knowledge-base/components/CorrectedQuery";

const KnowledgeBase = () => {
  const [data, setData] = useState({articles: []});

  const [searchTerm, setSearchTerm] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("query") || "";
  });

  const [overrideCorrect, setOverrideCorrect] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("override_correct") || false;
  });

  const [smSize, setSmSize] = useState(6);
  const [mdSize, setMdSize] = useState(4);
  const [align, setAlign] = useState("text-center");
  const [titleClipping, setTitleClipping] = useState(64);
  const [contentClipping, setContentClipping] = useState(128);
  const setSizes = (sizeSm, sizeMd) => {
    setSmSize(sizeSm);
    setMdSize(sizeMd || sizeSm);
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const [isFetching, setIsFetching] = useState(false);

  const handleSearch = async (searchTerm) => {
    if (!searchTerm) {
      setIsFetching(true);
      axios
        .get(`${import.meta.env.VITE_CRYSTAL_SPIDER_BASE_URL}/home`)
        .then((res) => {
          setData({
            articles: res.data
          });
          setIsFetching(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setIsFetching(false);
        });
      setSizes(6, 4);
      setAlign("text-center");
      setTitleClipping(64);
      setContentClipping(128);
    } else {
      setIsFetching(true);
      try {
        let url = `${import.meta.env.VITE_CRYSTAL_SPIDER_BASE_URL}/search?query=${searchTerm}&filter=1&qty=12`;
        if (overrideCorrect) {
          url += `&override_correct=true`;
        }
        const response = await axios.get(
          url, {
            timeout: 2 * 60 * 1000
          }
        );
        setData(response.data);
        setSizes(12);
        setAlign("text-left");
        setTitleClipping(128);
        setContentClipping(256);
        setIsFetching(false);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setIsFetching(false);
      }
    }
  };

  const ArticleCard = ({ item }) => (
    <Col className="kb-search-content" key={item.id} md={mdSize} sm={smSize}>
      <Card>
        <Link to={`/pages/knowledge-base/${item.id}?query=${searchTerm}`}>
          <CardBody className={align}>
            <div className="d-flex justify-content-between mb-1">
              <h4 className="mb-0 text-primary">{ShortenText(item.title, titleClipping)}</h4>
              {item.score && (
                <MatchScore score={item.score} />
              )}
            </div>
            <span className="text-muted mt-1 mb-0">
              Published: {item.pubdate.year}-{item.pubdate.month || "N/A"}
              <br />
              Authors: {ShortenText(item.authors.join(", "), 32)}
            </span>
            <p className="text-body mt-1 mb-0">
              {ShortenText(item.abstract, contentClipping)}
            </p>
          </CardBody>
        </Link>
      </Card>
    </Col>
  );

  return (
    <Fragment>
      <Breadcrumbs
        title="Knowledge Base"
        data={[{ title: "Knowledge Base" }]}
      />
      <UILoader blocking={isFetching} loader={<Loader />}>
        <KnowledgeBaseHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchCallback={handleSearch}
        />
        <div id="knowledge-base-content">
          {data !== null && data.corrected && !overrideCorrect &&
            <CorrectedQuery userQuery={data.query} correctedQuery={data.corrected_query} />}
          {data !== null ? (
            <Row className="kb-search-content-info match-height">
              {data.articles.map(item => {
                return <ArticleCard key={item.id} item={item} />;
              })}
            </Row>
          ) : null}
        </div>
      </UILoader>
    </Fragment>
  );
};

export default KnowledgeBase;
