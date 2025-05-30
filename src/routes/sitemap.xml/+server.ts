export async function GET() {
	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>
	<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
            <loc>https://quickgamez.com</loc>
        </url>
        <url>
            <loc>https://quickgamez.com/games/guess-the-movie/hollywood</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
        </url>
        <url>
            <loc>https://quickgamez.com/games/guess-the-movie/bollywood</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
        </url>
        <url>
            <loc>https://quickgamez.com/games/guess-the-movie</loc>
        </url>
        <url>
            <loc>https://quickgamez.com/about</loc>
        </url>
        <url>
            <loc>https://quickgamez.com/contact-us</loc>
        </url>
    </urlset>
`.trim(),
		{
			headers: {
				'Content-Type': 'application/xml'
			}
		}
	);
}
