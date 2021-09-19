import { Button } from '@chakra-ui/button';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import { InputField } from '../components/InputField';
import { Layout } from '../components/Layout';
import { useCreatePostMutation, useMeQuery } from '../generated/graphql';

const CreatePost = () => {
  const { data, loading } = useMeQuery();
  const [createPost] = useCreatePostMutation();
  const router = useRouter();

  if (loading) {
    return <div></div>;
  } else if (!data?.me) {
    router.push('/login');
  }
  return (
    <Layout>
      <Formik
        initialValues={{ title: '', text: '' }}
        onSubmit={async values => {
          const data = await createPost({
            variables: {
              createPostText: values.text,
              createPostTitle: values.title,
            },
          });
          if (data.errors) {
            console.log('error: ', data.errors);
          } else {
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField label='Title' name='title' />
            <InputField isTextArea={true} label='Body' name='body' />

            <Button
              type='submit'
              mt={4}
              disabled={isSubmitting}
              colorScheme='teal'
            >
              Create Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default CreatePost;
