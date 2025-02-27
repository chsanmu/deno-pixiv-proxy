import { serve } from "https://deno.land/std@0.204.0/http/server.ts";

// 混淆配置
const _0x4f2d = {
    h: atob("aS5weGltZy5uZXQ="),  // "i.pximg.net"
    r: atob("aHR0cHM6Ly93d3cucGl4aXYubmV0Lw=="),  // "https://www.pixiv.net/"
    t: parseInt("1010110100000", 2),  // 86400
    p: atob("aW1nLW1hc3RlcixpbWctb3JpZ2luYWwsY3VzdG9tLXRodW1i").split(","),
    u: atob("TW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2")
};

// 主页面模板
const _0xpage = `<!DOCTYPE html><html lang="zh"><head><meta charset="UTF-8"><title>个人图片收藏</title><style>body{font-family:Arial,sans-serif;line-height:1.6;max-width:800px;margin:0 auto;padding:20px}.gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:20px}.photo-item{border-radius:8px;overflow:hidden;box-shadow:0 2px 4px rgba(0,0,0,.1)}.photo-item img{width:100%;height:200px;object-fit:cover}h1{color:#333}</style></head><body><h1>我的摄影作品集</h1><p>这里收集了我平时拍摄的一些照片，主要是风景和街拍作品。</p><div class="gallery"><div class="photo-item"><img src="https://picsum.photos/200/300" alt="风景照片"></div><div class="photo-item"><img src="https://picsum.photos/201/300" alt="风景照片"></div><div class="photo-item"><img src="https://picsum.photos/202/300" alt="风景照片"></div></div></body></html>`;

// 工具函数
const _0x = {
    isValid: (p: string) => _0x4f2d.p.some(x => p.startsWith('/' + x + '/')),
    getHeaders: () => ({ "Referer": _0x4f2d.r, "User-Agent": _0x4f2d.u }),
    randInt: (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min)
};

async function handleRequest(req: Request): Promise<Response> {
    const url = new URL(req.url);
    
    // 返回主页的情况
    const returnHome = () => new Response(_0xpage, {
        headers: { "content-type": "text/html; charset=utf-8" }
    });

    // 主页或无效路径返回伪装页面
    if (url.pathname === "/" || url.pathname === "/index.html" || !_0x.isValid(url.pathname)) {
        return returnHome();
    }

    try {
        const response = await fetch(`https://${_0x4f2d.h}${url.pathname}${url.search}`, {
            headers: _0x.getHeaders(),
        });

        const headers = new Headers(response.headers);
        headers.set("Access-Control-Allow-Origin", "*");
        headers.set("Cache-Control", `public, max-age=${_0x4f2d.t + _0x.randInt(0, 3600)}`);
        headers.delete("x-proxy-cache");
        headers.set("Server", "nginx");
        headers.set("X-Content-Type-Options", "nosniff");
        
        return new Response(response.body, {
            status: response.status,
            headers,
        });
    } catch {
        return returnHome();
    }
}

// 启动服务
await serve(handleRequest, { port: 8000 }); 