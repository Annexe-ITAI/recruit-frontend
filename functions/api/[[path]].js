export async function onRequest(context) {
  const url = new URL(context.request.url);

  const backendUrl =
    "https://everecruiter-api.onrender.com" +
    url.pathname +
    url.search;

  const response = await fetch(backendUrl, {
    method: context.request.method,
    headers: context.request.headers,
    body:
      context.request.method === "GET" ||
      context.request.method === "HEAD"
        ? undefined
        : context.request.body,
    redirect: "manual"
  });

  return response;
}
