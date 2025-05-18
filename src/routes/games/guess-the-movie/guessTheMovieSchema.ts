export const guessTheMovieSchema = [
	{
		'@context': 'http://schema.org',
		'@type': 'WebPage',
		'@id': 'https://quickgamez.com/games/guess-the-movie/#WebPage',
		url: 'https://quickgamez.com/games/guess-the-movie',
		name: 'Guess the Movie | Play Online for Free! | QuickGamez',
		description:
			'Test your movie knowledge with this movie guessing game and guess the name of movies before running out of lives or time, with hints to help. Available in two flavors - Bollywood and Hollywood.',
		inLanguage: 'en',
		breadcrumb: {
			'@type': 'BreadcrumbList',
			itemListElement: [
				{
					'@type': 'ListItem',
					position: 1,
					item: { '@type': 'Thing', '@id': 'https://quickgamez.com', name: 'QuickGamez' }
				},
				{
					'@type': 'ListItem',
					position: 2,
					item: {
						'@type': 'Thing',
						'@id': 'https://quickgamez.com/games/guess-the-movie',
						name: 'Guess The Movie'
					}
				}
			]
		},
		primaryImageOfPage: {
			'@type': 'ImageObject',
			url: 'https://quickgamez.com/images/guess-the-movie.webp',
			thumbnailUrl: 'https://quickgamez.com/images/guess-the-movie.webp',
			image: 'https://quickgamez.com/images/guess-the-movie.webp',
			contentUrl: 'https://quickgamez.com/images/guess-the-movie.webp',
			width: '1200',
			height: '1200'
		},
		thumbnail: {
			'@type': 'ImageObject',
			url: 'https://quickgamez.com/images/guess-the-movie.webp',
			thumbnailUrl: 'https://quickgamez.com/images/guess-the-movie.webp',
			image: 'https://quickgamez.com/images/guess-the-movie.webp',
			contentUrl: 'https://quickgamez.com/images/guess-the-movie.webp',
			width: '1200',
			height: '1200'
		},
		thumbnailUrl: 'https://quickgamez.com/images/guess-the-movie.webp',
		image: {
			'@type': 'ImageObject',
			url: 'https://quickgamez.com/images/guess-the-movie.webp',
			thumbnailUrl: 'https://quickgamez.com/images/guess-the-movie.webp',
			image: 'https://quickgamez.com/images/guess-the-movie.webp',
			contentUrl: 'https://quickgamez.com/images/guess-the-movie.webp',
			width: '1200',
			height: '1200'
		},
		mainEntity: {
			'@type': ['Game', 'WebApplication'],
			name: 'Guess the Movie - Bollywood',
			description:
				'Love Hindi movies? Play this movie guessing game and guess the name of hindi movies before running out of lives or time, with hints to help.',
			url: 'https://quickgamez.com/games/guess-the-movie/bollywood',
			image: {
				'@type': 'ImageObject',
				url: 'https://quickgamez.com/images/guess-the-movie.webp',
				thumbnailUrl: 'https://quickgamez.com/images/guess-the-movie.webp',
				image: 'https://quickgamez.com/images/guess-the-movie.webp',
				contentUrl: 'https://quickgamez.com/images/guess-the-movie.webp',
				width: '1200',
				height: '1200'
			},
			applicationCategory: 'Game',
			applicationSubCategory: 'Trivia',
			operatingSystem: 'Web Browser',
			gamePlatform: 'QuickGamez',
			availableOnDevice: ['Mobile', 'Tablet', 'Desktop'],
			author: { '@type': 'Person', name: 'Abhay Anand' },
			offers: {
				'@type': 'Offer',
				category: 'free',
				price: 0,
				priceCurrency: 'INR',
				availability: 'http://schema.org/InStock'
			},
			screenshot: {
				'@type': 'ImageObject',
				url: 'https://quickgamez.com/images/guess-the-movie.webp',
				thumbnailUrl: 'https://quickgamez.com/images/guess-the-movie.webp',
				image: 'https://quickgamez.com/images/guess-the-movie.webp',
				contentUrl: 'https://quickgamez.com/images/guess-the-movie.webp',
				width: '1200',
				height: '1200'
			},
			thumbnail: {
				'@type': 'ImageObject',
				url: 'https://quickgamez.com/images/guess-the-movie.webp',
				thumbnailUrl: 'https://quickgamez.com/images/guess-the-movie.webp',
				image: 'https://quickgamez.com/images/guess-the-movie.webp',
				contentUrl: 'https://quickgamez.com/images/guess-the-movie.webp',
				width: '1200',
				height: '1200'
			},
			thumbnailUrl: 'https://quickgamez.com/images/guess-the-movie.webp'
		},
		isPartOf: {
			'@type': 'WebSite',
			'@id': 'https://quickgamez.com/#website',
			name: 'QuickGamez',
			url: 'https://quickgamez.com',
			description:
				'QuickGamez is a website where you can play onlines games for free on your mobile, tablet or computer. No downloads, no login. Play now!',
			inLanguage: 'en',
			publisher: {
				'@type': 'Organization',
				'@id': 'https://quickgamez.com/#organization',
				url: 'https://quickgamez.com',
				name: 'QuickGamez',
				description:
					'Play free online games at QuickGamez! Enjoy hours of fun on your mobile, tablet, or computer without any downloads or sign-ups. Start playing now!',
				logo: 'https://quickgamez.com/images/logo/logo1600.webp',
				brand: {
					'@type': 'Brand',
					'@id': 'https://quickgamez.com/#brand',
					name: 'QuickGamez',
					slogan: 'Play, Win, Repeat.'
				},
				email: 'contact@quickgamez.com'
			}
		}
	}
];
