import './chat.css';
import { useState } from 'react';
import React from 'react';
import axios from 'axios';
import { useEffect } from 'react';

function Chat() {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        console.log('useEffect');

        subscribeOnGetMessages();
    }, []);

    async function subscribeOnGetMessages() {
        try {
            const config = {
                method: 'GET',
                url: 'http://localhost:3001/messages',
                headers: {},
                data: {},
            };
            const request = await axios(config);
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

    function inputOnChange(event) {
        setInputValue(event.target.value);
    }

    async function sendButtonOnClick() {
        try {
            const config = {
                method: 'POST',
                url: 'http://localhost:3001/messages',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {
                    message: {
                        id: Date.now(),
                        text: inputValue,
                    },
                },
            };

            await axios(config);
        } catch (error) {
            console.error(error);
        }
    }

    function formOnSubmit(event) {
        event.preventDefault();
    }

    return (
        <div className="Chat">
            <form className="Chat__form" onSubmit={formOnSubmit}>
                <input className="Chat__form__input" type="text" value={inputValue} onChange={inputOnChange} />
                <button className="Chat__form__send-button" onClick={sendButtonOnClick}>
                    Send
                </button>
            </form>
            <div className="Chat__messages">
                {messages.map((message) => (
                    <div className="Chat__message" key={message.id}>
                        <span>{message.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Chat;
