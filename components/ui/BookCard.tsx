"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { IKImage, ImageKitProvider } from "imagekitio-next";
import Image from "next/image";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;

const BookCard = ({ title, author, genre, rating, cover }: any) => {
  return (
    <Card className="w-[180px] overflow-hidden border border-gray-300 rounded-md 
  hover:border-green-500 hover:shadow-lg hover:-translate-y-1 transition 
  duration-300 ease-in-out">
      <CardContent className="pt-1 px-2 pb-2">
        <div className="text-center mb-1">
          <h3 className="font-medium text-sm line-clamp-1">{title}</h3>
          <p className="text-xs text-gray-500 line-clamp-1">{author}</p>
        </div>
        <div className="flex justify-center">
          <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint}>
            <IKImage 
              path={cover} 
              height={180} 
              width={120} 
              alt={title}
              className="object-cover rounded-sm"
            />
          </ImageKitProvider>
        </div>
        </CardContent>
      </Card>
  );
};

export default BookCard;
