import React from "react";
import axios from "axios";

export const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const fetchBotResponse = async (message) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_CRYSTAL_SPIDER_BASE_URL}/crystal_gpt/ask?user_query=${encodeURIComponent(message)}&articles_only=false&agent=conversational-react-description`,
        {
          timeout: 10 * 60 * 1000
        }
      );
      return response.data.response;
    } catch (error) {
      console.error("Error fetching bot response:", error);
      return "Sorry, I couldn't fetch a response. Please try again.";
    }
  };

  const handleMessage = async (message) => {
    const botResponse = await fetchBotResponse(message);
    const chatBotMessage = createChatBotMessage(botResponse);
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, chatBotMessage],
    }));
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            handleMessage,
          },
        });
      })}
    </div>
  );
};
