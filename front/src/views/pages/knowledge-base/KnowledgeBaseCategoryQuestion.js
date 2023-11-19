// ** React Imports
import React, { Fragment, useEffect, useRef, useState } from "react";

// ** Third Party Components
import axios from "axios";
import { useParams } from "react-router-dom";

// ** Reactstrap Imports
import { Card, CardBody, CardTitle } from "reactstrap";

import UILoader from "@components/ui-loader";
import Highlighter from "react-highlight-words";
import { yellow } from "@mui/material/colors";
import { ArticleMetadata } from "./components/ArticleMetadata";
import { MatchScore } from "./components/MatchScore";
import { Loader } from "./components/Loader";
import { ShortenText } from "@src/utility/StringUtils";
import Breadcrumbs from "@components/breadcrumbs";

import "./kb.scss";
import { Sidebar } from "@src/views/pages/knowledge-base/components/Sidebar";
import { StickyWrapper } from "@src/views/pages/knowledge-base/components/StickyWrapper";
import { Menu } from "react-feather";
import { Button } from 'reactstrap'

const styles = {
  highlight: {
    backgroundColor: yellow
  }
};

const Paragraph = ({ paragraph }) => {
  const highlightedTexts = paragraph.main_sentences?.map(sentence => paragraph.text.slice(sentence.start, sentence.end)) || [];

  return (
    <div className="mb-3">
      <p style={{ textAlign: "justify" }}>
        <Highlighter
          textToHighlight={paragraph.text}
          searchWords={highlightedTexts}
          autoEscape={true}
          highlightStyle={styles.highlight}
        />
      </p>
    </div>
  );
};

const Section = ({ title, data }) => {
  return (
    <div className="mb-5">
      <div className="d-flex gap-1">
        <h4 className="mb-0">{title}</h4>
        {data.score && <MatchScore score={data.score} />}
      </div>
      {data.paragraphs.map((paragraph, index) => (
        <Paragraph key={index} paragraph={paragraph} />
      ))}
    </div>
  );
};

const ArticleCard = ({ data, setRef }) => {
  return (
    <Card className="h-auto">
      <CardBody>
        <CardTitle className="mb-1">
          <h1>{data.title}</h1>
        </CardTitle>
        <ArticleMetadata data={data} />
        <hr />
        {data.full_text &&
          Object.entries(data.full_text).map(([sectionTitle, sectionData], index) => {
            return (
              <div ref={(element) => setRef(element, index)} key={`section-${index}`}>
                <Section key={index} title={sectionTitle} data={sectionData} />
              </div>
            );
          })}
      </CardBody>
    </Card>
  );
};

const KnowledgeBaseCategoryQuestion = () => {
  const [data, setData] = useState(null);
  const [block, setBlock] = useState(false);
  const [refsReady, setRefsReady] = useState(false);
  const { entryId } = useParams(); // Get the entryId from the route parameters

  useEffect(() => {
    setBlock(true);

    const query = new URLSearchParams(window.location.search).get("query");
    let url = `${import.meta.env.VITE_CRYSTAL_SPIDER_BASE_URL}/article?id=${entryId}`;
    if (query) {
      url += `&query=${query}`;
    }

    axios
      .get(url, {
        timeout: 2 * 60 * 1000
      })
      .then(res => {
        setData(res.data);
        setBlock(false);
      });

  }, []);

  const sectionRefs = useRef([]);

  useEffect(() => {
    if (data && data.full_text) {
      const numberOfSections = Object.keys(data.full_text).length;
      sectionRefs.current = Array(numberOfSections).fill(null);
      setRefsReady(true);
    }
  }, [data]);

  const setRef = (element, index) => {
    sectionRefs.current[index] = element;
  };


  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
    document.body.classList.toggle("mobile-sidebar-open");
  };

  return (
    <Fragment>
      <Breadcrumbs
        title="Knowledge Base"
        data={[
          { title: "Knowledge Base", link: "/pages/knowledge-base" },
          { title: !!data ? ShortenText(data.title, 64) : "Loading..." }
        ]}
      />
      <div id="knowledge-base-question">
        <UILoader blocking={block} loader={<Loader />}>
          {data !== null ? (
            <div className="d-flex gap-2">
              <div style={{ width: isMobile ? "100%" : "70%" }}>
                <ArticleCard data={data} setRef={setRef} />
              </div>
              {isMobile ? (
                <div className="mobile-sidebar">
                  <Sidebar data={data} refsReady={refsReady} refs={sectionRefs} entryId={entryId} />
                </div>
              ) : (
                <StickyWrapper>
                  <Sidebar data={data} refsReady={refsReady} refs={sectionRefs} entryId={entryId} />
                </StickyWrapper>
              )}
            </div>
          ) : (
            <>
              <h1>Hang tight...</h1>
            </>
          )}
        </UILoader>
        {isMobile && (
          <Button.Ripple className="btn-icon toggle-sidebar-btn rounded-circle"  color="primary" onClick={toggleMobileSidebar}>
            <Menu size={16} />
          </Button.Ripple>
        )}
      </div>
    </Fragment>
  );
};

export default KnowledgeBaseCategoryQuestion;

