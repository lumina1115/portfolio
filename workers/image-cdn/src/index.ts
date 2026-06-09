/**
 * Portfolio Image CDN Worker
 * 从 R2 读取图片并返回，添加缓存头和 CORS 支持
 */

export interface Env {
  IMAGES: R2Bucket;
}

// 图片 MIME 类型映射
const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
};

function getContentType(path: string): string {
  const ext = path.substring(path.lastIndexOf('.')).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const key = url.pathname.replace(/^\//, ''); // 去掉开头的 /

    // 根路径返回简单状态页
    if (!key) {
      return new Response('Portfolio Image CDN ✓', {
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    // 从 R2 读取对象
    const object = await env.IMAGES.get(key);

    if (!object) {
      return new Response('Not Found', { status: 404 });
    }

    // 返回图片，设置长期缓存和 CORS
    return new Response(object.body, {
      headers: {
        'Content-Type': object.httpMetadata?.contentType || getContentType(key),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
        'ETag': object.httpEtag || '',
      },
    });
  },
};
