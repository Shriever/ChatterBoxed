import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
// import styles from "../styles/Home.module.css";
import { socket } from "../utils/socket";

// export async function getStaticProps() {
//   let res = await fetch("http://localhost:5000/");
//   res = await res.json();

//   return { props: { res } };
// }
interface IMessage {
  messageId: number;
  authorId: number;
  msg: string;
  createdAt?: any;
}

export default function Home() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    socket.auth = { username: "jerry" };
    socket.connect();
    socket.on("new message", (newMessages: IMessage[]) => {
      setMessages(newMessages);
      console.log(messages);
    });
  }, []);

  return (
    <div>
      {messages.map((msg, idx) => (
        <h5 key={idx}>{msg.msg}</h5>
      ))}
      <input
        type='text'
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <button
        onClick={() => {
          socket.emit("message", value);
          setValue("");
        }}
      >
        send
      </button>
    </div>
  );
}
