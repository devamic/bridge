export function onRequest(context) {
	const url = new URL(context.request.url);
	const path = url.searchParams.get("path");

	return Response.redirect(`https://cbz.nekoweb.org/${path}`, 302);
}
