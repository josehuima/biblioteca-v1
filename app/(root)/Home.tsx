"use client";
import { Suspense } from "react";
import BannerHome from "@/components/ui/BannerHome"


export default function Home() {

 
  return (
    <Suspense>
      <div className="h-full flex flex-col items-center w-full mt-5">
        <BannerHome />
      </div>
    </Suspense>
  );
}
