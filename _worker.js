addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // 构建原始请求 URL
  const url = new URL(request.url);
  const originalUrl = 'https://litvpc-hichannel.cdn.hinet.net' + url.pathname + url.search;

  // 发起原始请求
  const response = await fetch(originalUrl);

  // 从原始响应中获取数据
  const { status, statusText, headers } = response;
  const body = await response.arrayBuffer();

  // 构建新的响应并返回
  return new Response(body, {
    status,
    statusText,
    headers: {
      ...headers,
      // 可选：设置 CORS 头以允许跨域请求
      'Access-Control-Allow-Origin': '*',
    },
  });
}
