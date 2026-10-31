export async function onRequest(context) {
	const method = context.request.method;
	const fetchMode = context.request.headers.get("Sec-Fetch-Mode");

	const corsHeaders = {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type, Authorization",
	};

	// 1. Manejar Preflight de CORS (OPTIONS)
	if (method === "OPTIONS") {
		return new Response(null, { status: 204, headers: corsHeaders });
	}

	const url = new URL(context.request.url);
	const current = url.searchParams.get("current");
	const dynamic = url.searchParams.get("dynamic");

	const path = current 
		? `https://cbz.nekoweb.org/${current}` 
		: (dynamic ? `https://dinytune.serv00.net/cbz/${dynamic}` : "https://cbz.nekoweb.org/");

	// 2. SI ES FETCH (Solicitud de datos por código), actuamos como Proxy interno
	if (fetchMode === "cors" || url.pathname.endsWith(".json") || (current && current.endsWith(".json"))) {
		try {
			const response = await fetch(path, {
				headers: context.request.headers
			});
			
			// Clonamos la respuesta del destino original y le inyectamos CORS
			const newResponse = new Response(response.body, response);
			Object.keys(corsHeaders).forEach(key => {
				newResponse.headers.set(key, corsHeaders[key]);
			});
			
			return newResponse;
		} catch (error) {
			return new Response("Error al obtener recurso remoto", { status: 502 });
		}
	}

	// 3. SI ES UN ENLACE NORMAL (Navegación web), mantenemos el 302 original
	return new Response(null, {
		status: 302,
		headers: {
			"Location": path
		}
	});
}

