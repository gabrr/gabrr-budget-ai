import { Button, Container, Heading } from "@chakra-ui/react";
import NextLink from "next/link";

export default function Home() {
  return (
    <Container py={16} centerContent gap={6}>
      <Heading>Gabrr Budget AI</Heading>
      <NextLink href="/import" passHref legacyBehavior>
        <Button as="a" colorScheme="teal" size="lg">
          Import
        </Button>
      </NextLink>
    </Container>
  );
}
