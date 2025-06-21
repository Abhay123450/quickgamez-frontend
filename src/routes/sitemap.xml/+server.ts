export async function GET() {
	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>
	<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
            <loc>https://quickgamez.com</loc>
        </url>
        <url>
            <loc>https://quickgamez.com/games/guess-the-movie/hollywood</loc>
        </url>
        <url>
            <loc>https://quickgamez.com/games/guess-the-movie/bollywood</loc>
        </url>
        <url>
            <loc>https://quickgamez.com/games/rebus-puzzles</loc>
        </url>
        <url>
            <loc>https://quickgamez.com/games/guess-the-movie</loc>
        </url>
        <url>
            <loc>https://quickgamez.com/about</loc>
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
