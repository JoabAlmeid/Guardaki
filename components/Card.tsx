// components/Card.tsx
import Link from "next/link";
import { Models } from "node-appwrite";
import React from "react";
import Thumbnail from "./Thumbnail";
import { convertFileSize } from "@/lib/utils";
import FormattedDateTime from "./FormattedDateTime";
import { getFileViewUrl } from "@/lib/appwrite/appwrite-client";
import ActionDropdown from "./ActionDropdown";

const Card = ({ file }: { file: Models.Document }) => {
  // Use o fileId armazenado no documento para gerar a URL correta
  const fileUrl = getFileViewUrl(file.fileId || file.bucketFileId);

  return (
    <Link href={fileUrl} target="_blank" className="file-card">
      <div className="flex justify-between">
        <Thumbnail
          type={file.mimeType || file.type}
          extension={file.extension}
          url={fileUrl} // URL gerada no client-side
          className="!size-20"
          imageClassName="!size-11"
        />

        <div className="flex flex-col items-end justify-between">
          <ActionDropdown file={file} />
          <p className="body-1">
            {convertFileSize(file.sizeOrig || file.size)}
          </p>
        </div>
      </div>
      <div className="file-card-details">
        <p className="subtitle-2 line-clamp-1">{file.name}</p>
        <FormattedDateTime
          date={file.$createdAt}
          className="body-2 text-light-100"
        />
        <p className="caption line-clamp-1 text-light-200">
          Por: {file.owner?.fullName || "Unknown"}
        </p>
      </div>
    </Link>
  );
};

export default Card;
