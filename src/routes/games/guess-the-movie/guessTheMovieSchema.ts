import { isPartOf, websiteDescription } from '../../homePageSchema';

export const guessTheMovieSchema = [
	{
		'@context': 'http://schema.org',
		'@type': 'WebPage',
		'@id': 'https://quickgamez.com/games/guess-the-movie/#WebPage',
		url: 'https://quickgamez.com/',
		name: 'Guess The Movie - Play Now!',
		description: websiteDescription,
		inLanguage: 'en',
		mainEntity: {
			'@type': 'ItemList',
			name: 'Guess The Movie Games',
			itemListOrder: 'http://schema.org/ItemListOrderAscending',
			numberOfItems: 1,
			itemListElement: [
				{
					'@type': 'ListItem',
					position: 1,
					name: 'Guess The Movie - Hollywood',
					url: 'https://quickgamez.com/games/guess-the-movie/hollywood',
					image: 'https://quickgamez.com/images/thumbnail/guess-the-movie-hollywood.webp',
					description:
						'A movie guessing game where you guess the name of hollywood movies before running out of lives or time, with hints to help.'
				},
				{
					'@type': 'ListItem',
					position: 2,
					name: 'Guess The Movie - Bollywood',
					url: 'https://quickgamez.com/games/guess-the-movie/bollywood',
					image: 'https://quickgamez.com/images/thumbnail/guess-the-movie-bollywood.webp',
					description:
						'A movie guessing game where you guess the name of hindi movies before running out of lives or time, with hints to help.'
				}
			]
		},
		isPartOf: isPartOf
	}
];
