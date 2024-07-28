import React, { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import ApiService from "../../services/ApiService";
import "./chatbot.css";
const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [chatId] = useState(nanoid());

  useEffect(() => {
    const chatbotToggler = document.querySelector(".chatbot-toggler");
    if (chatbotToggler) {
      const handleClick = () => document.body.classList.toggle("show-chatbot");
      chatbotToggler.addEventListener("click", handleClick);

      // Cleanup event listener on component unmount
      return () => {
        chatbotToggler.removeEventListener("click", handleClick);
      };
    }
  }, []);

   // Thêm tin nhắn chào đón khi component được render lần đầu
   useEffect(() => {
    setMessages([
        { text: 'Bạn cần hỗ trợ gì không?', userName: 'Assistant' }
    ]);
}, []);


  const sendMessage = async () => {
    if (!inputValue.trim()) return; // Không gửi tin nhắn nếu input trống

    // Thêm tin nhắn người dùng vào danh sách tin nhắn
    setMessages(prevMessages => [
        ...prevMessages,
        { text: inputValue, userName: 'You' }
    ]);

    // Thêm tin nhắn giả lập "đang typing..." từ chatbot
    const typingMessageId = nanoid();
    setMessages(prevMessages => [
        ...prevMessages,
        { id: typingMessageId, text: 'Đang trả lời...', userName: 'Assistant' }
    ]);

    try {
        // Gửi tin nhắn đến server và nhận phản hồi
        const response = await ApiService.getChatbot(chatId, { message: inputValue });

        // Xóa tin nhắn giả lập và thay thế bằng phản hồi thực sự
        setMessages(prevMessages => {
            return prevMessages.map(msg =>
                msg.id === typingMessageId
                    ? { ...msg, text: response }
                    : msg
            );
        });

    } catch (error) {
        console.error('Error sending message:', error);

        // Xóa tin nhắn giả lập nếu có lỗi
        setMessages(prevMessages => prevMessages.filter(msg => msg.id !== typingMessageId));
    }

    // Xóa nội dung textarea
    setInputValue('');
};

const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault(); // Ngăn chặn newline
        sendMessage();
    }
};

  return (
    <>
      <button className="chatbot-toggler">
        <span className="material-symbols-outlined">mode_comment</span>
        <span className="material-symbols-outlined">close</span>
      </button>
      <div className="chatbot">
        <header>
          <h2 className="title">ChatBot</h2>
        </header>
        <ul className="chatbox">
          {/* <li className='chat incoming'>
                <span className='material-symbols-outlined'>smart_toy</span>
                <p>Hi there . How can I help today?</p>
            </li>

            <li className='chat outgoing'>
                <span className='material-symbols-outlined'></span>
                <p>Bài mẫu test .....</p>
            </li> */}

          {messages.map((msg, index) => (
            <li
              key={index}
              className={`chat ${
                msg.userName === "You" ? "outgoing" : "incoming"
              }`}
            >
              <span className="material-symbols-outlined">
                {msg.userName === "You" ? "Face" : "smart_toy"}
              </span>
              <p>{msg.text}</p>
            </li>
          ))}
        </ul>

        <div className="chat-input">
          <textarea
            name=""
            id=""
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập nội dung..."
          ></textarea>
          <span
            id="send-btn"
            className="material-symbols-outlined"
            aria-required
            onClick={sendMessage}
          >
            send
          </span>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
