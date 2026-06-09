export function normalizeRoles(user: any): string[] {
  if (!user?.roles) return [];

  return user.roles
    .map((role: any) =>
      typeof role === "string" ? role : role.name || role.role || role.code
    )
    .filter(Boolean);
}

export function isStudent(user: any) {
  return normalizeRoles(user).includes("student");
}