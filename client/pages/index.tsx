import { Box, Button, Flex, Input } from "@chakra-ui/react";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
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
    <Layout>
      <Box background='blue' height='400px'>
        {messages.map((msg, idx) => (
          <h5 key={idx}>{msg.msg}</h5>
        ))}
      </Box>
      <Flex>
        <Input
          flex='1'
          type='text'
          value={value}
          onChange={e => setValue(e.target.value)}
        />
        <Button
          onClick={() => {
            socket.emit("message", value);
            setValue("");
          }}
        >
          send
        </Button>
      </Flex>
    </Layout>
  );
}
