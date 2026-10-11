type HeaderReader = { get(name: string): string | null };

export function publicUrl(path: string, headers: HeaderReader) {
  const forwardedHost = headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const configuredHost = process.env.WEBSITE_HOSTNAME?.trim();
  const requestHost = headers.get("host")?.split(",")[0]?.trim();
  const host = forwardedHost || configuredHost || requestHost;
  if (!host || !/^[a-z0-9.:[\]-]+$/i.test(host)) throw new Error("A valid public hostname is required");
  const forwardedProto = headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const protocol = forwardedProto === "http" && process.env.NODE_ENV !== "production" ? "http" : "https";
  return new URL(path, `${protocol}://${host}`).toString();
}
