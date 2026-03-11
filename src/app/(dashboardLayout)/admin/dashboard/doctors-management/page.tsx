import DoctorsTable from "@/src/components/modules/Admin/DoctorsTable";
import { getDoctors } from "@/src/services/doctor.services";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import React from "react";

const DoctorsManagementPage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["doctors"],
    queryFn: getDoctors,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 6, // 1 hour
  });
  return(
    <HydrationBoundary state={dehydrate(queryClient)}>
        <DoctorsTable/>
    </HydrationBoundary>
  );
};

export default DoctorsManagementPage;
