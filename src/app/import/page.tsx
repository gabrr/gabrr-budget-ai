"use client";

import { toaster } from "@/components/ui/toaster";
import { useFileHandler } from "@/hooks/useFileHandler";
import { parseFiles } from "@/services/import";
import { Box, Button, Container, Text, VStack } from "@chakra-ui/react";
import { AttachmentIcon } from "@chakra-ui/icons";
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
          borderColor="border.emphasized"
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
            <AttachmentIcon boxSize={8} />
            <Text fontSize="md" fontWeight={600}>Drag and drop PDF or CSV files here</Text>
            <Text fontSize="sm" color="colorPalette.500" fontWeight={400}>
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
