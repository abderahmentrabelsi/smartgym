import { ChatbotWindow } from "@src/views/pages/knowledge-base/crystal-gpt/ChatbotWindow";
import { TooLongDidntRead } from "@src/views/pages/knowledge-base/components/TooLongDidntRead";
import { ParagraphMap } from "@src/views/pages/knowledge-base/components/ParagraphMap";
import { ConnectedArticles } from "@src/views/pages/knowledge-base/components/ConnectedArticles";
import React, { useContext } from "react";
import * as PropTypes from "prop-types";
import { ThemeColors } from "@src/utility/context/ThemeColors";

export function Sidebar(props) {
  const { colors } = useContext(ThemeColors);
  return (
    <div style={{

    }}>
      <ChatbotWindow />
      {props.data.abstract && <TooLongDidntRead article={props.data} />}
      {props.refsReady && <ParagraphMap data={props.data} refs={props.refs} />}
      {props.entryId && <ConnectedArticles entryId={props.entryId} />}
    </div>
  );
}

Sidebar.propTypes = {
  data: PropTypes.any,
  refsReady: PropTypes.bool,
  refs: PropTypes.any,
  entryId: PropTypes.string
};
