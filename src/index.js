const DISCOVERY_LINKS = '</llms.txt>; rel="describedby"; type="text/plain", </about.md>; rel="alternate"; type="text/markdown", </sitemap.xml>; rel="sitemap"; type="application/xml"';

function acceptsMarkdown(request) {
  const accept = request.headers.get("Accept") || "";
  return accept
    .split(",")
    .map((part) => part.trim().toLowerCase())
    .some((part) => part === "text/markdown" || part.startsWith("text/markdown;"));
}

async function markdownHomepage(request, env) {
  const markdownUrl = new URL("/about.md", request.url);
  const markdownResponse = await env.ASSETS.fetch(new Request(markdownUrl, request));
  const body = await markdownResponse.text();
  const headers = new Headers(markdownResponse.headers);

  headers.set("Content-Type", "text/markdown; charset=utf-8");
  headers.set("Link", DISCOVERY_LINKS);
  headers.set("Vary", "Accept");
  headers.set("x-markdown-tokens", String(Math.ceil(body.length / 4)));

  return new Response(body, {
    status: 200,
    headers,
  });
}

function withDiscoveryHeaders(response, request) {
  const url = new URL(request.url);
  if (url.pathname !== "/" && url.pathname !== "/index.html") {
    return response;
  }

  const headers = new Headers(response.headers);
  headers.set("Link", DISCOVERY_LINKS);
  headers.append("Vary", "Accept");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if ((url.pathname === "/" || url.pathname === "/index.html") && acceptsMarkdown(request)) {
      return markdownHomepage(request, env);
    }

    const response = await env.ASSETS.fetch(request);
    return withDiscoveryHeaders(response, request);
  },
};
