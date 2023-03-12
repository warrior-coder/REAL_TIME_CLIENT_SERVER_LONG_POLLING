import './chat.css';
import { useState } from 'react';
import React from 'react';
import axios from 'axios';
import { useEffect } from 'react';

function Chat() {
    const [messages, setMessages] = useState([]);
    const [messageInputValue, setMessageInputValue] = useState('');
    const baseUrl = 'http://localhost:3001';

    useEffect(() => {
        console.log('useEffect');

        subscribeOnGetMessages();
    }, []);

    async function subscribeOnGetMessages() {
        try {
            // set axios request config
            const config = {
                method: 'GET',
                url: baseUrl + '/messages',
                headers: {},
                data: {},
            };

            // send a long pending request until server reply
            const request = await axios(config);

            // get message after awaited for server reply
            const message = request.data.message;

            if (message) {
                // use callback syntax of state updating to merge value with existing values
                setMessages((messages) => [message, ...messages]);
            }

            subscribeOnGetMessages();
        } catch (error) {
            console.error(error);

            // subscribe again if response waiting time has expired
            subscribeOnGetMessages();
        }
    }

    function messageInput_onChange(event) {
        setMessageInputValue(event.target.value);
    }

    async function sendButton_onClick() {
        const config = {
            method: 'POST',
            url: 'http://localhost:3001/messages',
            headers: {
                'Content-Type': 'Application/JSON',
            },
            data: {
                message: {
                    id: Date.now(),
                    text: messageInputValue,
                },
            },
        };

        await axios(config);

        setMessageInputValue('');
    }

    function messageForm_onSubmit(event) {
        // prevent default form behavior on submitting
        event.preventDefault();
    }

    return (
        <div className="Chat">
            <form className="Chat__message-form" onSubmit={messageForm_onSubmit}>
                <input
                    className="Chat__message-input"
                    type="text"
                    value={messageInputValue}
                    onChange={messageInput_onChange}
                />
                <button className="Chat__send-button" onClick={sendButton_onClick}>
                    Send
                </button>
            </form>
            <div className="Chat__messages">
                {messages.map((message) => {
                    return (
                        <div className="Chat__message" key={message.id}>
                            <span>{message.text}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Chat;
