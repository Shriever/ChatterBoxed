import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { Layout } from "../components/Layout";
import { InputField } from "../components/InputField";
import { setAccessToken } from "../utils/accessToken";

const login = () => {
  const router = useRouter();
  return (
    <Layout variant='small'>
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, { setSubmitting }) => {
          // send post to server to login
          try {
            const body = JSON.stringify({
              username: values.username,
              password: values.password,
            });

            const res = await fetch("http://localhost:5000/login", {
              headers: {
                "Content-Type": "application/json",
              },
              method: "POST",
              body,
            });

            const data = await res.json();

            setAccessToken(data.accessToken);
            setSubmitting(false);
            router.push("/");
          } catch (err) {
            console.error("loginhere", err.message);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              autoComplete='on'
              name='username'
              placeholder='username'
              label='Username'
            />
            <Box mt={4}>
              <InputField
                autoComplete='on'
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
