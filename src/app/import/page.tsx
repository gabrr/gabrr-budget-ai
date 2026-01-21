"use client";

import { toaster } from "@/components/ui/toaster";
import { Box, Button, Container, Icon, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";

const ACCEPT_TYPES = [
  "application/pdf",
  "text/csv",
  "application/vnd.ms-excel",
];

export default function ImportPage() {
  const [files, setFiles] = useState<File[]>([]);

  const parseFiles = async (nextFiles: File[]) => {
    if (!nextFiles.length) return;

    const parseFile = async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:8000/parse", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const message = await response.text().catch(() => "");
        throw new Error(message || `Failed to parse ${file.name}`);
      }
    };

    const results = await Promise.allSettled(nextFiles.map(parseFile));
    const failed = results
      .map((result, index) => ({ result, file: nextFiles[index] }))
      .filter(({ result }) => result.status === "rejected")
      .map(({ file }) => file.name);

    if (failed.length) {
      toaster.create({
        type: "error",
        title: "Parse failed",
        description: `Failed to parse: ${failed.join(", ")}`,
        duration: 4500,
        meta: { closable: true },
      });
    }

    if (failed.length !== nextFiles.length) {
      const successCount = nextFiles.length - failed.length;
      toaster.create({
        type: "success",
        title: "Parse complete",
        description: `${successCount} file${
          successCount === 1 ? "" : "s"
        } parsed`,
        duration: 3500,
        meta: { closable: true },
      });
    }
  };

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return;

    const next = Array.from(incoming).filter((file) => {
      const allowed =
        ACCEPT_TYPES.includes(file.type) ||
        file.name.toLowerCase().endsWith(".csv") ||
        file.name.toLowerCase().endsWith(".pdf");

      if (!allowed) {
        toaster.create({
          type: "error",
          title: "Unsupported file",
          description: `${file.name} is not PDF/CSV`,
          duration: 3500,
          meta: { closable: true },
        });
      }
      return allowed;
    });

    if (next.length) {
      toaster.create({
        type: "success",
        title: "Files imported",
        description: `${next.length} files imported`,
        duration: 3500,
        meta: { closable: true },
      });

      setFiles(next);
      void parseFiles(next);
    }
  };

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
                accept=".pdf,.csv,application/pdf,text/csv"
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
