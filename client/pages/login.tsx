import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React from "react";
import { Layout } from "../components/Layout";
import { InputField } from "../components/InputField";
import { MeDocument, MeQuery, useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';

const login = () => {
  const router = useRouter();
  const [login] = useLoginMutation();
  return (
    <Layout variant='small'>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          // const { username, password } = values;
          const response = await login({
            variables: { options: values },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: 'Query',
                  me: data?.login.user,
                },
              });
              cache.evict({fieldName: "posts:{}"})
            },
          });
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else {
            router.push('/');
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
