export function onRequest(context) {
	const method = context.request.method;

	const headers = {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type, Authorization",
	};

	if (method === "OPTIONS") return new Response(null, {status: 204, headers: headers});

	// REDIRECT
	const url = new URL(context.request.url);
	const current = url.searchParams.get("current");
	const dynamic = url.searchParams.get("dynamic");

	const path = current ? `https://cbz.nekoweb.org/${current}` : (dynamic ? `https://dinytune.serv00.net/cbz/${dynamic}` : "https://cbz.nekoweb.org/");

	return new Response(null, {status: 302, headers: {"Location": path, ...headers}});
}
