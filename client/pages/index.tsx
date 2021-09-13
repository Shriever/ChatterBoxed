import { Box, Button, Flex, Heading, Input } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { socket } from "../utils/socket";

interface IMessage {
  messageId: number;
  authorId: number;
  msg: string;
  createdAt?: any;
}

export default function Home() {
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    socket.auth = { username: "jerry" };
    socket.connect();
    socket.on("new message", (newMessages: IMessage[]) => {
      setMessages(newMessages);
      // console.log(messages);
    });
  }, []);

  return (
    <Layout>
      <Flex
        flexDir='column'
        justifyContent='flex-end'
        background='blue'
        height='500px'
        borderRadius='10px'
        p='3'
      >
        <Box h='auto' overflow='auto'>
          {messages.map((msgData, idx) => (
            <Heading color='white' key={idx}>
              {msgData.msg}
            </Heading>
          ))}
        </Box>
        <Formik
          initialValues={{ message: "" }}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            // send message through socket
            const newMessage: IMessage = {
              msg: values.message,
              authorId: 3,
              messageId: 5,
            };
            setMessages([...messages, newMessage]);
            // socket.emit("new message", {
            //   message: values.message,
            //   authorId: 4,
            // });
            resetForm();
            setSubmitting(false);
          }}
        >
          {({ isSubmitting, handleChange, values }) => (
            <Form>
              <Flex>
                <Input
                  type='text'
                  name='message'
                  value={values.message || ""}
                  onChange={handleChange}
                  placeholder='Howdy, partner.'
                  flex='1'
                  border='none'
                  background='white'
                  mr='3'
                  mb='3'
                />
                <Button type='submit' disabled={isSubmitting}>
                  send
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </Flex>
    </Layout>
  );
}
