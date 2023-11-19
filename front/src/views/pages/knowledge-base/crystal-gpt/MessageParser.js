import React from "react";

export const MessageParser = ({ children, actions }) => {
  const parse = (message) => {
    if (actions && actions.handleMessage) {
      actions.handleMessage(message);
    } else {
      console.error("handleMessage action is not available.");
    }
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse: parse,
          actions: {},
        });
      })}
    </div>
  );
};
