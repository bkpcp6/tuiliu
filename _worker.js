/** @type {RequestInit} */
const PREFLIGHT_INIT = {
    headers: new Headers({
        'access-control-allow-origin': '*', // 允许所有来源
        'access-control-allow-methods': 'GET,POST,PUT,PATCH,TRACE,DELETE,HEAD,OPTIONS', // 允许的HTTP方法
        'access-control-max-age': '1728000', // 预检请求的缓存时间
    }),
};

/** @type {string} */
const targetUrl = 'http://litv.bkpcp.top'; // 替换成你希望转发到的目标地址

/**
 * 构造响应
 * @param {any} body 响应体
 * @param {number} status 响应状态码
 * @param {Object<string, string>} headers 响应头
 */
function makeRes(body, status = 200, headers = {}) {
    headers['access-control-allow-origin'] = '*'; // 允许所有来源
    return new Response(body, { status, headers }); // 返回新构造的响应
}

/**
 * 处理HTTP请求
 * @param {Request} req 请求对象
 */
async function handleRequest(req) {
    const url = new URL(req.url);
    
    // 如果请求的主机名是 litvpc-hichannel.cdn.hinet.net
    if (url.hostname === 'litvpc-hichannel.cdn.hinet.net') {
        const newUrl = new URL(targetUrl + url.pathname + url.search);
        
        const reqInit = {
            method: req.method,
            headers: req.headers,
            body: req.method !== 'GET' && req.method !== 'HEAD' ? await req.blob() : null,
            redirect: 'follow'
        };

        return fetch(newUrl, reqInit);
    }

    // 如果不是 litvpc-hichannel.cdn.hinet.net，则返回 404 Not Found
    return makeRes('Not Found', 404);
}

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});
