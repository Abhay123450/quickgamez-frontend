const websiteDescription =
	'QuickGamez is a website where you can play onlines games for free on your mobile, tablet or computer. No downloads, no login. Play now!';

export const homePageSchema = [
	{
		'@context': 'http://schema.org',
		'@type': 'WebPage',
		'@id': 'https://quickgamez.com/#WebPage',
		url: 'https://quickgamez.com/',
		name: 'Quickgamez - Free Online Games - Play Now!',
		description: websiteDescription,
		inLanguage: 'en',
		mainEntity: {
			'@type': 'ItemList',
			name: 'Games',
			itemListOrder: 'http://schema.org/ItemListOrderAscending',
			numberOfItems: 1,
			itemListElement: [
				{
					'@type': 'ListItem',
					position: 1,
					name: 'Guess The Movie - Hollywood',
					url: 'https://quickgamez.com/games/guess-the-movie/hollywood',
					image: 'https://quickgamez.com/images/guess-the-movie-logo.webp',
					description:
						'A movie guessing game where you guess the name of hollywood movies before running out of lives or time, with hints to help.'
				},
				{
					'@type': 'ListItem',
					position: 2,
					name: 'Guess The Movie - Bollywood',
					url: 'https://quickgamez.com/games/guess-the-movie/bollywood',
					image: 'https://quickgamez.com/images/guess-the-movie-logo.webp',
					description:
						'A movie guessing game where you guess the name of hindi movies before running out of lives or time, with hints to help.'
				}
			]
		},
		isPartOf: {
			'@type': 'WebSite',
			'@id': 'https://quickgamez.com/#website',
			name: 'QuickGamez',
			url: 'https://quickgamez.com/',
			description: websiteDescription,
			inLanguage: 'en'
		}
	}
];
