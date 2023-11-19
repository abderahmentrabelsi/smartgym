import { Chatbot } from "react-chatbot-kit";
import { ActionProvider } from "@src/views/pages/knowledge-base/crystal-gpt/ActionsProvider";
import { MessageParser } from "@src/views/pages/knowledge-base/crystal-gpt/MessageParser";
import "react-chatbot-kit/build/main.css";
import config from "@src/views/pages/knowledge-base/crystal-gpt/config";
import "./crystal-gpt.scss";

export const ChatbotWindow = () => {
  return (
    <Chatbot
      config={config()}
      messageParser={MessageParser}
      actionProvider={ActionProvider}
      headerText="Ask CrystalGPT"
      placeholderText="Type a message..."
    />
  );
};
