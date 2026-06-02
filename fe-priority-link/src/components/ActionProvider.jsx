// in ActionProvider.jsx
import React from 'react';
import API from '../API';

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const handleHello = async (p) => {
    const m = await API.rasaParse(p)
    const botMessage = createChatBotMessage(m[0].text);

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  // Put the handleHello function in the actions object to pass to the MessageParser
  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            handleHello,
          },
        });
      })}
    </div>
  );
};

export default ActionProvider;