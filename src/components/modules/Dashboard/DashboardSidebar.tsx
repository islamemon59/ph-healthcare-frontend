import { getUserInfo } from "@/src/services/auth.services";
import DashboardSidebarContent from "./DashboardSidebarContent";
import { NavSection } from "@/src/types/dashboard.types";
import { getNavItemsByRole } from "@/src/lib/navItems";
import { getDefaultDashboardRoute } from "@/src/lib/authUtils";

const DashboardSidebar = async () => {
  const userInfo = await getUserInfo();
  const navItems: NavSection[] = getNavItemsByRole(userInfo.role);

  const dashboardHome = getDefaultDashboardRoute(userInfo.role);
  return (
    <DashboardSidebarContent
      userInfo={userInfo}
      navItems={navItems}
      dashboardHome={dashboardHome}
    />
  );
};

export default DashboardSidebar;
