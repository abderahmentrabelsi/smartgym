import { createChatBotMessage } from "react-chatbot-kit";

const botName = "CrystalGPT";
import { ThemeColors } from "@src/utility/context/ThemeColors";
import { useContext } from "react";
import { UserAvatar } from "@src/views/pages/knowledge-base/crystal-gpt/UserAvatar";

const config = () => {
  const { colors } = useContext(ThemeColors);

  return {
    initialMessages: [createChatBotMessage(`Hi! I'm ${botName}, your very own AI assistant. Ask me anything!`,
      {
        widget: "airportSelector",
        delay: 500
      })],
    botName: botName,
    customStyles: {
      botMessageBox: {
        backgroundColor: colors.primary.main
      },
      chatButton: {
        backgroundColor: colors.primary.main
      },
    },
    customComponents: {
      userAvatar: (props) => <UserAvatar />
    }
  };
};
export default config;
