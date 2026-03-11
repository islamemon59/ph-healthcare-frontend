import AdminDashboardContent from "@/src/components/modules/Dashboard/AdminDashboardContent";
import { getDashboardData } from "@/src/services/dashboard.services";
import { ApiResponse } from "@/src/types/api.types";
import { IAdminDashboardData } from "@/src/types/dashboard.types";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";

const AdminDashboardPage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["admin-dashboard-data"],
    queryFn: getDashboardData,
  });

  const dashboardData = queryClient.getQueryData([
    "admin-dashboard-data",
  ]) as ApiResponse<IAdminDashboardData>;
  console.log(dashboardData.data);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminDashboardContent />
    </HydrationBoundary>
  );
};

export default AdminDashboardPage;
