import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React from "react";
import { Layout } from "../components/Layout";
import { InputField } from "../components/InputField";
import { useLoginMutation } from '../generated/graphql';

const login = () => {
  const [login] = useLoginMutation();
  return (
    <Layout variant='small'>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async values => {
          const { username, password } = values;
          const data = await login({ variables: { username, password } });
          console.log(data);
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
