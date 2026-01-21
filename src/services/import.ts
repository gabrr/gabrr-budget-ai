import { toaster } from "@/components/ui/toaster";

export const parseFiles = async (nextFiles: File[]) => {
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
      description: `${successCount} file${successCount === 1 ? "" : "s"} parsed`,
      duration: 3500,
      meta: { closable: true },
    });
  }
};
