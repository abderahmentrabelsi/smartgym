import {
  Card, CardBody, CardTitle
} from "reactstrap";

import React from "react";
import { ShortenText } from "@src/utility/StringUtils";
import CardAction from "@components/card-actions";
import { MatchScore } from "@src/views/pages/knowledge-base/components/MatchScore";


function Paragraph({ paragraph, originalIndex, refs }) {
  const text = ShortenText(paragraph.text, 40);
  const score = Number(paragraph.score);

  const handleClick = () => {
    refs.current[originalIndex].scrollIntoView({
      behavior: "smooth", block: "start"
    });
  };

  return (<div
      className="d-flex justify-content-between w-100"
      onClick={handleClick}
    >
      <span className="font-normal text-sm cursor-pointer text-decoration-none">
        {text}
      </span>
      {!!score && <MatchScore score={score}/>}
    </div>);
}

function ParagraphSection({ section, data, refs }) {
  const originalIndex = data.full_text[section]["original_index"];
  const score = Number(data.full_text[section]["score"]);
  const paragraphs = data.full_text[section]["paragraphs"];

  const handleClick = () => {
    refs.current[originalIndex].scrollIntoView({
      behavior: "smooth", block: "start"
    });
  };

  return (<div className="d-flex flex-column gap-2">
      <div
        className="d-flex align-items-center justify-content-between w-100 text-primary"
        onClick={handleClick}
      >
        <span className="font-semibold cursor-pointer text-decoration-none">
          {section}
        </span>
        {!!score && <MatchScore score={score}/>}
      </div>

      <div className="d-flex flex-column ms-2 mt-1 gap-1">
        {paragraphs.map((paragraph, i) => (<Paragraph
            key={`paragraph-${i}-${section}`}
            paragraph={paragraph}
            originalIndex={originalIndex}
            refs={refs}
          />))}
      </div>
    </div>);
}

export function ParagraphMap({ data, refs }) {
  const sections = Object.keys(data.full_text);

  return (<CardAction actions="collapse" title="Document Map">
      <CardBody>
        <div className="w-100 h-400 overflow-auto rounded-lg">
          <div className="d-flex flex-column gap-3 rounded-lg">
            {sections.map((section, i) => {
              data.full_text[section]["original_index"] = i;
              return (<ParagraphSection
                  key={`section-${i}-${section}`}
                  section={section}
                  data={data}
                  refs={refs}
                />);
            })}
          </div>
        </div>
      </CardBody>
    </CardAction>);
}
