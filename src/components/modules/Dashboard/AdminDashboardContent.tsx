"use client"
import { useQuery } from "@tanstack/react-query"
import StatsCard from "../../shared/StatsCard";
import AppointmentBarChart from "../../shared/AppointmentBarChart";
import AppointmentPieChart from "../../shared/AppointmentPieChart";
import { getDashboardData } from "@/src/services/dashboard.services";
import { ApiResponse } from "@/src/types/api.types";
import { IAdminDashboardData } from "@/src/types/dashboard.types";

const AdminDashboardContent = () => {
  const { data: adminDashboardData } = useQuery({
    queryKey: ["admin-dashboard-data"],
    queryFn: getDashboardData,
    refetchOnWindowFocus: "always", // Refetch the data when the window regains focus
  });

  const { data } = adminDashboardData as ApiResponse<IAdminDashboardData>;
  //http://localhost:5000/api/v1/doctors?page=1&limit=2&searchTerm=ortho&appointmentFee[gt]=1000&appointmentFee[lte]=1500&fields=name,email&sortBy=user.name.firstName&sortOrder=asc&experience[gt]=7&include=specialties&user.role=DOCTOR&specialties.specialty.title=Neurology&gender=MALE&specialties.specialty.title=Cardiology2
  return (
    <div>
      <StatsCard
        title="Total Appointments"
        value={data?.appointmentCount || 0}
        iconName="CalendarDays"
        description="Number of appointments scheduled"
      />
      <StatsCard
        title="Total Patients"
        value={data?.patientCount || 0}
        iconName="Users"
        description="Number of patients registered"
      />

      <AppointmentBarChart data={data?.barChartData || []} />

      <AppointmentPieChart data={data?.pieChartData || []} />
    </div>
  );
}

export default AdminDashboardContent