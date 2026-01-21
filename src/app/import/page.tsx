"use client";

import { toaster } from "@/components/ui/toaster";
import { useFileHandler } from "@/hooks/useFileHandler";
import { parseFiles } from "@/services/import";
import { Box, Button, Container, Icon, Text, VStack } from "@chakra-ui/react";
const ACCEPT_TYPES = ["application/pdf", "text/csv", "application/vnd.ms-excel"];
const ACCEPT_EXTENSIONS = [".csv", ".pdf"];

export default function ImportPage() {
  
  const { files, handleFiles, acceptAttribute } = useFileHandler({
    acceptTypes: ACCEPT_TYPES,
    acceptExtensions: ACCEPT_EXTENSIONS,
    onReject: (file) => {
      toaster.create({
        type: "error",
        title: "Unsupported file",
        description: `${file.name} is not PDF/CSV`,
        duration: 3500,
        meta: { closable: true },
      });
    },
    onAccept: (next) => {
      toaster.create({
        type: "success",
        title: "Files imported",
        description: `${next.length} files imported`,
        duration: 3500,
        meta: { closable: true },
      });

      void parseFiles(next);
    },
  });

  return (
    <Container maxW="lg" py={16} centerContent>
      <VStack w="full" gap={6}>
        <Text fontSize="2xl" fontWeight="bold">
          Import your files
        </Text>
        <Box
          w="full"
          borderWidth="2px"
          borderStyle="dashed"
          borderColor="gray.300"
          rounded="lg"
          p={10}
          textAlign="center"
          onDragOver={(event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = "copy";
          }}
          onDrop={(event) => {
            event.preventDefault();
            handleFiles(event.dataTransfer.files);
          }}
        >
          <VStack gap={3}>
            <Icon boxSize={8} color="gray.500">
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </Icon>
            <Text>Drag and drop PDF or CSV files here</Text>
            <Text fontSize="sm" color="gray.500">
              PDF (.pdf) or CSV (.csv)
            </Text>
            <Button as="label" colorScheme="teal">
              Choose files
              <input
                type="file"
                hidden
                accept={acceptAttribute}
                multiple
                onChange={(event) => handleFiles(event.target.files)}
              />
            </Button>
          </VStack>
        </Box>
        {files.length > 0 && (
          <VStack w="full" align="start" gap={1}>
            <Text fontWeight="semibold">Ready to import:</Text>
            {files.map((file) => (
              <Text key={file.name} fontSize="sm">
                • {file.name}
              </Text>
            ))}
          </VStack>
        )}
      </VStack>
    </Container>
  );
}
