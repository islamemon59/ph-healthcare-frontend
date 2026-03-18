import DoctorsTable from "@/src/components/modules/Admin/DoctorsTable";
import { getDoctors } from "@/src/services/doctor.services";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";

const DoctorsManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const queryParamsObjects = await searchParams;

  const queryString = Object.keys(queryParamsObjects)
    .map((key) => {
      const value = queryParamsObjects[key];
      if (Array.isArray(value)) {
        return value.map((val) => `${key}=${val}`).join("&");
      }
      return `${key}=${value}`;
    })
    .join("&");

  console.log(queryString, "queryString");

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["doctors", queryString],
    queryFn: () => getDoctors(queryString),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 6, // 1 hour
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DoctorsTable initialQueryString={queryString} />
    </HydrationBoundary>
  );
};

export default DoctorsManagementPage;
