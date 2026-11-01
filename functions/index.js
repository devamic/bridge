export async function onRequest(context) {
	const method = context.request.method;

	const cors_headers = {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type, Authorization",
	};

	if (method === "OPTIONS") return new Response(null, { status: 204, headers: cors_headers });

	const url = new URL(context.request.url);
	const current = url.searchParams.get("current");
	const dynamic = url.searchParams.get("dynamic");

	const path = current ? (current.startsWith("http") ? current : `https://cbz.nekoweb.org/${current}`) : (dynamic ? `https://dinytune.serv00.net/cbz/${dynamic}` : "https://cbz.nekoweb.org/");

	// Fetch
	if (context.request.headers.get("Sec-Fetch-Mode") === "cors") {
		try {
			const response = await fetch(path, {headers: context.request.headers});

			const new_response = new Response(response.body, response);
			Object.keys(cors_headers).forEach(key => {
				new_response.headers.set(key, cors_headers[key]);
			});

			return new_response;
		} catch (error) {
			return new Response("Error al obtener recurso remoto", { status: 502 });
		}
	}

	// NO Fetch
	return Response.redirect(path, 302);
}
