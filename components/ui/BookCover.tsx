"use client";

import { IKImage, ImageKitProvider } from "imagekitio-next";
import { useState } from "react";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;

interface BookCoverProps {
  cover: string;
  title: string;
  width?: number;
  height?: number;
  className?: string;
}

export function BookCover({ cover, title, width = 45, height = 60, className = "" }: BookCoverProps) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <span className="text-xs text-gray-500">No cover</span>
      </div>
    );
  }

  return (
    <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint}>
      <IKImage
        path={cover}
        height={height}
        width={width}
        alt={`${title} cover`}
        className={`object-cover ${className}`}
        onError={() => setImageError(true)}
      />
    </ImageKitProvider>
  );
} 