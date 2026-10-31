export function onRequest(context) {
	const url = new URL(context.request.url);
	const current = url.searchParams.get("current");
	const dynamic = url.searchParams.get("dynamic");

	const path = current ? `https://cbz.nekoweb.org/${current}` : (dynamic ? `https://dinytune.serv00.net/cbz/${dynamic}` : "https://cbz.nekoweb.org/");
	return Response.redirect(path, 302);
}
