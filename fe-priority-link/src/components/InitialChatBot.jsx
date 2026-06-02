import Chatbot from 'react-chatbot-kit';
import MessageParser from "./MessageParser";
import { createChatBotMessage } from "react-chatbot-kit";
import 'react-chatbot-kit/build/main.css';
import { RiRobot2Line } from "react-icons/ri";
import { AiOutlineClose } from "react-icons/ai";
import { Container, Row, Col, Button } from 'react-bootstrap';
import API from '../API';
import React, { useRef, useState, useEffect } from 'react';

const botName = 'Time Mate';

const setupMessage = await API.rasaParse("Start habit setting");

const InitialChatBot = ({setPrioritiesSet}) => {

    const saveMessages = (messages, HTMLString) => {
        localStorage.setItem('chat_messages', JSON.stringify(messages));
    };

    const loadMessages = () => {
        const messages = JSON.parse(localStorage.getItem('chat_messages'));
        return messages;
    };

    const config = {
        initialMessages: [createChatBotMessage(""+setupMessage[0].text)],
        customComponents: {
            header: () => null,
            botAvatar: (props) => <RiRobot2Line style={{ fontSize: '25px', marginTop: "8px", color: "#1a73e8" }} />,
        },
    };

    return (
        <div className="App InitialChat">
            <header className='App-header' >
                <Chatbot
                    config={config}
                    actionProvider={(props) => <ActionProvider {...props} setPrioritiesSet={setPrioritiesSet} />}
                    messageParser={MessageParser}
                />
            </header>
        </div>
    );
};

const ActionProvider = ({ createChatBotMessage, setState, children, setPrioritiesSet}) => {
    const [hasBotResponded, setHasBotResponded] = useState(false);

    useEffect(() => {
        if (hasBotResponded) {
            setPrioritiesSet(true);
        }
    }, [hasBotResponded]);
    
    const handleHello = async (p) => {
        const m = await API.rasaParse(p);
        let botMessage;
        if(m[0].text=="I think we're done!"){
            botMessage = createChatBotMessage(m[0].text+", in a few moments you will be redirected to the calendar page");
            setTimeout(() => {
                if (!hasBotResponded) {
                    setHasBotResponded(true);
                }
            }, 5000);
        }else{
            botMessage = createChatBotMessage(m[0].text);
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


export default InitialChatBot;
