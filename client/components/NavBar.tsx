import React from "react";
import { Box, Link, Flex, Button, Heading } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const router = useRouter();

  let body = null;

  // data is loading
  if (false) {
    // user not logged in
  } else if ("hello") {
    body = (
      <>
        <NextLink href='/login'>
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href='/register'>
          <Link>register</Link>
        </NextLink>
      </>
    );
    // user is logged in
  } else {
    body = (
      <Flex align='center'>
        <Box mr={2}>Username</Box>
        <Button onClick={() => {}} variant='link'>
          logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex zIndex={1} position='sticky' top={0} bg='tan' p={4}>
      <Flex flex={1} m='auto' align='center' maxW={800}>
        <NextLink href='/'>
          <Link>
            <Heading>ChatterBoxed</Heading>
          </Link>
        </NextLink>
        <Box ml={"auto"}>{body}</Box>
      </Flex>
    </Flex>
  );
};
