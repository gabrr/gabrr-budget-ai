import { useMemo, useState } from "react";

type UseFileHandlerOptions = {
  acceptTypes?: string[];
  acceptExtensions?: string[];
  storeFiles?: boolean;
  onAccept?: (files: File[]) => void | Promise<void>;
  onReject?: (file: File) => void;
};

const normalizeExtension = (extension: string) =>
  extension.startsWith(".") ? extension.toLowerCase() : `.${extension.toLowerCase()}`;

export const useFileHandler = (options: UseFileHandlerOptions = {}) => {
  const {
    acceptTypes = [],
    acceptExtensions = [],
    storeFiles = true,
    onAccept,
    onReject,
  } = options;

  const normalizedExtensions = useMemo(
    () => acceptExtensions.map(normalizeExtension),
    [acceptExtensions],
  );

  const acceptAttribute = useMemo(
    () => [...normalizedExtensions, ...acceptTypes].join(","),
    [normalizedExtensions, acceptTypes],
  );

  const isAllowed = (file: File) => {
    if (acceptTypes.includes(file.type)) return true;

    const lowerName = file.name.toLowerCase();
    return normalizedExtensions.some((extension) => lowerName.endsWith(extension));
  };

  const [files, setFiles] = useState<File[]>([]);

  const handleFiles = (incoming: FileList | File[] | null) => {
    if (!incoming) return;

    const accepted: File[] = [];
    for (const file of Array.from(incoming)) {
      if (isAllowed(file)) {
        accepted.push(file);
      } else {
        onReject?.(file);
      }
    }

    if (accepted.length) {
      if (storeFiles) {
        setFiles(accepted);
      }
      void onAccept?.(accepted);
    }
  };

  return {
    files,
    setFiles,
    handleFiles,
    acceptAttribute,
    acceptTypes,
    acceptExtensions: normalizedExtensions,
  };
};
