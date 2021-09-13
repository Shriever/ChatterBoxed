import { Box, Flex, Link, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { Layout } from "../components/Layout";
import { Wrapper } from "../components/Wrapper";
import NextLink from "next/link";
import { InputField } from "../components/InputField";
import { getAccessToken, setAccessToken } from "../utils/accessToken";

const login = () => {
  const router = useRouter();
  return (
    <Layout variant='small'>
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, { setSubmitting }) => {
          // send post to server to login
          try {
            const res = await fetch("http://localhost:5000/login", {
              method: "POST",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify({
                username: values.username,
                password: values.password,
              }),
            });
            const data = await res.json();

            setAccessToken(data.accessToken);
            router.push("/");
          } catch (err) {
            console.error(err);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name='username'
              placeholder='username'
              label='Username'
            />
            <Box mt={4}>
              <InputField
                name='password'
                placeholder='password'
                label='Password'
                type='password'
              />
            </Box>
            <Button
              mt={4}
              type='submit'
              isLoading={isSubmitting}
              colorScheme='teal'
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default login;
