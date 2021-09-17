import React from "react";
import { Formik, Form } from "formik";
import { Box, Button } from "@chakra-ui/react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { toErrorMap } from '../utils/toErrorMap';
import { useRegisterMutation } from '../generated/graphql';
import { useRouter } from 'next/router';

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [register] = useRegisterMutation();
  return (
    <Layout variant='small'>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const { username, password } = values;
          const response = await register({
            variables: { username, password },
          });
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else {
            router.push('/');
          }
          // console.log(data);
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
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default Register;
