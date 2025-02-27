import { serve } from "https://deno.land/std/http/server.ts";

const PIXIV_HOST = "i.pximg.net";
const CACHE_TIME = 60 * 60 * 24; // 24小时缓存

async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const targetUrl = `https://${PIXIV_HOST}${url.pathname}${url.search}`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "Referer": "https://www.pixiv.net/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const headers = new Headers(response.headers);
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Cache-Control", `public, max-age=${CACHE_TIME}`);
    headers.set("X-Proxy-Cache", "HIT");

    return new Response(response.body, {
      status: response.status,
      headers,
    });
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}

console.log("启动 Pixiv 代理服务器在端口 8000...");
await serve(handleRequest, { port: 8000 });