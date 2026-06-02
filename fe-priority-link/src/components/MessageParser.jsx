import React from 'react';

const MessageParser = ({ children, actions }) => {
  const parse = (message) => {
    actions.handleHello(message);
  };

  return (
    <div style={{height:"100%"}}>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse: parse,
          actions: {},
        });
      })}
    </div>
  );
};

export default MessageParser;