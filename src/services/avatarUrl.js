export function resolveAvatarUrl(url, cacheBust = false) {
  if (typeof url !== "string" || !url.trim()) return "";

  const value = url.trim();
  const isAbsolute = /^https?:\/\//i.test(value);
  let resolved = value;

  if (!isAbsolute) {
    const path = value.startsWith("/") ? value : `/${value}`;
    if (path.startsWith("/uploads/")) {
      resolved = `/api${path}`;
    } else if (path.startsWith("/api/uploads/")) {
      resolved = path;
    } else {
      resolved = path;
    }
  }

  if (cacheBust) {
    const parsed = new URL(resolved, "http://avatar.local");
    const version =
      cacheBust === true ? Date.now() : String(cacheBust);
    parsed.searchParams.set("v", String(version));
    resolved = isAbsolute
      ? parsed.toString()
      : `${parsed.pathname}${parsed.search}${parsed.hash}`;
  }

  return resolved;
}
