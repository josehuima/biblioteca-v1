// /__mocks__/imagekitio-next.ts
import React from "react";
export const ImageKitProvider = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

export const IKUpload = ({ onSuccess, onError }: any) => <button onClick={() => onSuccess({ filePath: "test-image-url" })}>Upload</button>;

export const IKImage = ({ path, height, width, alt }: any) => <img src={path} height={height} width={width} alt={alt} />;
