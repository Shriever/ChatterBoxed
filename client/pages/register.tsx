import React from "react";
import { Formik, Form } from "formik";
import { Box, Button } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useRouter } from "next/router";
import { Layout } from "../components/Layout";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  return (
    <Layout variant='small'>
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={() => {}}
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
              variantColor='teal'
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default Register;