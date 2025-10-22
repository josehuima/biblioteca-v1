import { Skeleton } from "./skeleton";
import React from "react";
interface authformSkeleton {
  type: "signin" | "signup";
}

const authformSkeleton: React.FC<authformSkeleton> = ({ type }) => {
  if (type === "signup") {
    return (
      <div>
        <div className="h-[640px] w-[400px] border-[#ffffff22] bg-slate-950 border-2 pt-8 rounded-[0.75rem] justify-center items-center">
          {/* <ImSpinner9 className="size-15 animate-spin text-gray-500" /> */}

          {/* Header */}
          <section className="flex flex-col items-center justify-center">
            <Skeleton className="h-[24px] w-[160px] rounded" />
            <Skeleton className="h-[16px] w-[250px] mt-2 rounded" />
          </section>

          {/* Google */}
          <section className="flex flex-col items-center justify-center">
            <Skeleton className="h-[30px] w-[320px] rounded mt-6" />
            <Skeleton className="h-[10px] w-[320px] mt-8 rounded" />
          </section>

          {/* FirstName and LastName */}
          <section className="flex flex-row items-center justify-center space-x-4 mt-9">
            <section className="items-center justify-center">
              <Skeleton className="h-[18px] w-[61px] rounded" />
              <Skeleton className="h-[30px] w-[152px] mt-2 rounded" />
            </section>
            <section className="items-center justify-center">
              <Skeleton className="h-[18px] w-[61px] rounded" />
              <Skeleton className="h-[30px] w-[152px] mt-2 rounded" />
            </section>
          </section>

          {/* Email */}
          <section className="items-center justify-center mt-4 ml-[40px]">
            <Skeleton className="h-[18px] w-[61px] rounded" />
            <Skeleton className="h-[30px] w-[320px] mt-2 rounded" />
          </section>

          {/* Password */}
          <section className="items-center justify-center mt-4 ml-[40px]">
            <Skeleton className="h-[18px] w-[61px] rounded" />
            <Skeleton className="h-[30px] w-[320px] mt-2 rounded" />
          </section>

          {/* Continue */}
          <section className="flex flex-col items-center justify-center">
            <Skeleton className="h-[30px] w-[320px] rounded mt-6" />
          </section>

          {/* Sign-In switch */}
          <section className="flex flex-col items-center justify-center">
            <Skeleton className="h-[18px] w-[250px] rounded mt-15" />
          </section>

          {/* Footer */}
          <section className="flex flex-col items-center justify-center mt-6">
            <Skeleton className="h-[42px] w-[183px] rounded" />
          </section>
        </div>
      </div>
    );
  } else if (type === "signin") {
    return (
      <div>
        <div className="h-[480px] w-[400px] border-[#ffffff22] bg-slate-950 border-2 pt-8 rounded-[0.75rem] justify-center items-center">
          {/* <ImSpinner9 className="size-15 animate-spin text-gray-500" /> */}

          {/* Header */}
          <section className="flex flex-col items-center justify-center">
            <Skeleton className="h-[24px] w-[160px] rounded" />
            <Skeleton className="h-[18px] w-[250px] mt-2 rounded" />
          </section>

          {/* Google */}
          <section className="flex flex-col items-center justify-center">
            <Skeleton className="h-[30px] w-[320px] rounded mt-6" />
            <Skeleton className="h-[10px] w-[320px] mt-8 rounded" />
          </section>

          {/* Email */}
          <section className="items-center justify-center mt-8 ml-[40px]">
            <Skeleton className="h-[18px] w-[61px] rounded" />
            <Skeleton className="h-[30px] w-[320px] mt-2 rounded" />
          </section>

          {/* Continue */}
          <section className="flex flex-col items-center justify-center">
            <Skeleton className="h-[30px] w-[320px] rounded mt-6" />
          </section>

          {/* Sign-In switch */}
          <section className="flex flex-col items-center justify-center">
            <Skeleton className="h-[18px] w-[250px] rounded mt-13" />
          </section>

          {/* Footer */}
          <section className="flex flex-col items-center justify-center mt-6">
            <Skeleton className="h-[42px] w-[183px] rounded" />
          </section>
        </div>
      </div>
    );
  }
};

export default authformSkeleton;
