import { Box } from '@chakra-ui/layout';
import { Layout } from '../components/Layout';
import { useGetPostsQuery } from '../generated/graphql';

export default function Home() {
  const { data, loading } = useGetPostsQuery();
  if (loading) {
    return <div>loading...</div>;
  } else if (!loading && !data) {
    return <div>an error has occurred</div>;
  }
  return (
    <Layout>
      <Box>
        {data?.posts.map(post => (
          <Box key={post.id} border={1}>
            {post.title}
            {post.text}
          </Box>
        ))}
      </Box>
    </Layout>
  );
}
