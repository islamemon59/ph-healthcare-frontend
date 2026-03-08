import { getDefaultDashboardRoute } from "@/src/lib/authUtils";
import { getNavItemsByRole } from "@/src/lib/navItems";
import { getUserInfo } from "@/src/services/auth.services";
import { NavSection } from "@/src/types/dashboard.types";

const DashboardSidebar = async () => {
  const userInfo = await getUserInfo();

  const navItems: NavSection[] = getNavItemsByRole(userInfo.role);

  const dashboardHome = getDefaultDashboardRoute(userInfo.role);

  return <div>Dashboard Sidebar</div>;
};

export default DashboardSidebar;
