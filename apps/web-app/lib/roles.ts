export function normalizeRoles(user: any): string[] {
  if (!user?.roles) return [];

  return user.roles
    .map((role: any) =>
      typeof role === "string"
        ? role
        : role.name || role.role || role.code
    )
    .filter(Boolean);
}

export function isAdmin(user: any): boolean {
  return normalizeRoles(user).includes("admin");
}

export function isLibrarian(user: any): boolean {
  const roles = normalizeRoles(user);
  return roles.includes("librarian") || roles.includes("admin");
}

export function isStudent(user: any): boolean {
  return normalizeRoles(user).includes("student");
}