export type UserRole = "SUPER_ADMIN" | "ADMIN" | "DOCTOR" | "PATIENT";

export const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/logout",
];

export const isAuthRoute = (pathName: string) => {
  return authRoutes.some((route: string) => route === pathName);
};

export type RouteConfig = {
  exact: string[];
  pattern: RegExp[];
};

export const commonProtectedRoutes: RouteConfig = {
  exact: ["/my-profile", "/change-password"],
  pattern: [],
};

export const doctorProtectedRoutes: RouteConfig = {
  pattern: [/^\/doctor\/dashboard/],
  exact: [],
};

export const adminOrSuperProtectedRoutes: RouteConfig = {
  pattern: [/^\/admin\/dashboard/],
  exact: [],
};

export const patientProtectedRoutes: RouteConfig = {
  pattern: [/^\/dashboard/],
  exact: ["/payment/success"],
};

export const isRouteMatches = (pathName: string, route: RouteConfig) => {
  if (route.exact.includes(pathName)) {
    return true;
  }
  return route.pattern.some((pattern: RegExp) => pattern.test(pathName));
};

export const getRouteOwner = (
  pathName: string,
): "SUPER_ADMIN" | "ADMIN" | "DOCTOR" | "PATIENT" | "COMMON" => {
  if (isRouteMatches(pathName, commonProtectedRoutes)) {
    return "COMMON";
  }

  if (isRouteMatches(pathName, doctorProtectedRoutes)) {
    return "DOCTOR";
  }

  if (isRouteMatches(pathName, adminOrSuperProtectedRoutes)) {
    return "ADMIN";
  }

  if (isRouteMatches(pathName, patientProtectedRoutes)) {
    return "PATIENT";
  }

  return "COMMON";
};

export const getDefaultDashboardRoute = (role: UserRole) => {
  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    return "/admin/dashboard";
  }

  if (role === "DOCTOR") {
    return "/doctor/dashboard";
  }

  if (role === "PATIENT") {
    return "/dashboard";
  }

  return "/";
};


export const isValidRedirectRole = (redirectPath: string, role: UserRole) => {
  const unifySuperAdminAndAdminRole = role === "SUPER_ADMIN" ? "ADMIN" : role;
  role = unifySuperAdminAndAdminRole;

  const routeOwner = getRouteOwner(redirectPath)

  if(routeOwner === null || routeOwner === "COMMON"){
    return true;
  }

  if(routeOwner === role){
    return true;
  }

  return false;
}