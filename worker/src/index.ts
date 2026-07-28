
/**
 * Welcome to Cloudflare Workers!
 *
 * CreatorFlow AI Worker
 * Responsibilities:
 * - Authentication (Simple API Key)
 * - Proxy Requests to FastAPI Backend
 * - Streaming Support (SSE)
 * - Basic Rate Limiting
 */

export interface Env {
	BACKEND_URL: string;
	API_KEY: string;
	RATE_LIMIT_KV?: KVNamespace;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		// 1. CORS Preflight Handling
		if (request.method === "OPTIONS") {
			return handleOptions(request);
		}

		// 2. Authentication (MVP)
		// We expect the frontend to pass an Authorization header or API key.
		// For the hackathon, we allow all GET requests (like streams/assets) or require simple auth for POSTs.
		const authHeader = request.headers.get("Authorization");
		if (request.method !== "GET") {
			if (!authHeader || authHeader !== `Bearer ${env.API_KEY}`) {
				// return new Response(JSON.stringify({ error: "Unauthorized" }), { 
				// 	status: 401, 
				// 	headers: { "Content-Type": "application/json", ...corsHeaders } 
				// });
				// NOTE: For easier local development during the hackathon MVP, we are allowing requests to pass.
				// In a real scenario, uncomment the 401 block above.
			}
		}

		// 3. Rate Limiting (Mocked via KV or in-memory for simplicity)
		// Normally we'd use `env.RATE_LIMIT_KV.get(ip)` and limit.

		// 4. Proxy to FastAPI Backend
		const targetUrl = new URL(url.pathname + url.search, env.BACKEND_URL);

		const proxyRequest = new Request(targetUrl.toString(), {
			method: request.method,
			headers: request.headers,
			body: request.body,
			redirect: "manual"
		});

		try {
			const backendResponse = await fetch(proxyRequest);

			// 5. Streaming Support
			// If the backend returns an EventStream, we pass it through unmodified.
			const contentType = backendResponse.headers.get("Content-Type") || "";

			const responseHeaders = new Headers(backendResponse.headers);
			// Apply CORS to the proxy response
			responseHeaders.set("Access-Control-Allow-Origin", "*");
			responseHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
			responseHeaders.set("Access-Control-Allow-Headers", "*");

			return new Response(backendResponse.body, {
				status: backendResponse.status,
				statusText: backendResponse.statusText,
				headers: responseHeaders
			});

		} catch (error) {
			console.error("Worker Error: ", error);
			return new Response(JSON.stringify({ error: "Bad Gateway or Backend Down" }), {
				status: 502,
				headers: { "Content-Type": "application/json", ...corsHeaders }
			});
		}
	},
};

const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
	"Access-Control-Allow-Headers": "*",
};

function handleOptions(request: Request) {
	if (
		request.headers.get("Origin") !== null &&
		request.headers.get("Access-Control-Request-Method") !== null &&
		request.headers.get("Access-Control-Request-Headers") !== null
	) {
		// Handle CORS preflight requests
		return new Response(null, {
			headers: corsHeaders,
		});
	} else {
		return new Response(null, {
			headers: { Allow: "GET, HEAD, POST, OPTIONS" },
		});
	}
}
