import Chatbot from 'react-chatbot-kit';
import MessageParser from "./MessageParser";
import { createChatBotMessage } from "react-chatbot-kit";
import 'react-chatbot-kit/build/main.css';
import { RiRobot2Line } from "react-icons/ri";
import { AiOutlineClose } from "react-icons/ai";
import { Container, Row, Col, Button } from 'react-bootstrap';
import React, { useRef, useState, useEffect } from 'react';
import API from '../API';

const botName = 'Time Mate';


const MyChatBot = ({ setShowChatBot, showChatBot, setDirty, setupMessage}) => {

    function handleClose() {
        setShowChatBot((prev) => !prev);
    }

    const saveMessages = (messages, HTMLString) => {
        localStorage.setItem('chat_messages', JSON.stringify(messages));
      };
    
      const loadMessages = () => {
        const messages = JSON.parse(localStorage.getItem('chat_messages'));
        return messages;
      };

    const config = {
        initialMessages: [createChatBotMessage(setupMessage[0].text)],
        customComponents: {
            // Replaces the default header
            header: () => <div style={{ border: "1px solid #e0dede", backgroundColor: '#f8f8f8', padding: "5px", borderTopLeftRadius: "5px", borderTopRightRadius: "5px" }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <RiRobot2Line style={{ fontSize: '30px', marginLeft: "10px", marginBottom: "5px", color: "#1a73e8" }} />
                        <b> Time Mate</b>
                    </div>
                    <div>
                        <Button style={{ fontSize: '20px', backgroundColor: "transparent", color: "black", border: "none" }} onClick={handleClose}>
                            <AiOutlineClose />
                        </Button>
                    </div>
                </div>
            </div>,
            // Replaces the default bot avatar
            botAvatar: (props) => <><RiRobot2Line style={{ fontSize: '25px', marginTop: "8px", color: "#1a73e8" }} /></>,
            /*
            // Replaces the default bot chat message container
            botChatMessage: (props) => <MyCustomChatMessage {...props} />,
            // Replaces the default user icon
            userAvatar: (props) => <MyCustomAvatar {...props} />,
            // Replaces the default user chat message
            userChatMessage: (props) => <MyCustomUserChatMessage {...props} />
            */
        },
    };

    return (
        <div className="App">
            <header className='App-header' >
                <Chatbot
                    config={config}
                    actionProvider={(props) => <ActionProvider {...props} setDirty={setDirty} />}
                    messageParser={MessageParser}
                />
            </header>
        </div>
    );
};

const ActionProvider = ({ createChatBotMessage, setState, children, setDirty}) => {
    
    const handleHello = async (p) => {
        console.log(p)
        const m = await API.rasaParse(p);
        let botMessage = createChatBotMessage(m[0].text);
        if(m[0].text=="Task inserted!"){
            setDirty(true)
            botMessage = createChatBotMessage(m[0].text+" you can now view it in the calendar");
        }
        setState((prev) => ({
            ...prev,
            messages: [...prev.messages, botMessage],
        }));
    };

    return (
        <div style={{height:"100%"}}>
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


export default MyChatBot;
