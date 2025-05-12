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
					name: 'Guess The Movie',
					url: 'https://quickgamez.com/games/guess-the-movie'
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
