import { isPartOf } from '../../homePageSchema';
import guessTheMovieHollywoodthumbnail from '$lib/assets/images/thumbnail/guess-the-movie-hollywood-thumbnail.webp';
import guessTheMovieBollywoodthumbnail from '$lib/assets/images/thumbnail/guess-the-movie-bollywood-thumbnail.webp';

export const guessTheMovieSchema = [
	{
		'@context': 'http://schema.org',
		'@type': 'WebPage',
		'@id': 'https://quickgamez.com/games/guess-the-movie/#WebPage',
		url: 'https://quickgamez.com/',
		name: 'Guess The Movie - Play Online for Free! | QuickGamez',
		description:
			'Test your movie knowledge with our fun movie guessing games. Currently available for Hollywood and Bollywood (Hindi) movies.',
		inLanguage: 'en',
		breadcrumb: {
			'@type': 'BreadcrumbList',
			'@id': 'https://quickgamez.com/games/guess-the-movie/#BreadcrumbList',
			name: 'Guess The Movie - Play Online for Free! | QuickGamez',
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
		mainEntity: {
			'@type': 'ItemList',
			name: 'Guess The Movie Games',
			itemListOrder: 'http://schema.org/ItemListOrderAscending',
			numberOfItems: 2,
			itemListElement: [
				{
					'@type': 'ListItem',
					position: 1,
					name: 'Guess The Movie - Hollywood',
					url: 'https://quickgamez.com/games/guess-the-movie/hollywood',
					image: guessTheMovieHollywoodthumbnail,
					description:
						'Play Guess the Movie – Hollywood and guess the name of Hollywood movies before running out of lives or time, with hints to help. With over 1000 movies to guess, this movie guessing game is a fun way to test your movie knowledge.'
				},
				{
					'@type': 'ListItem',
					position: 2,
					name: 'Guess The Movie - Bollywood',
					url: 'https://quickgamez.com/games/guess-the-movie/bollywood',
					image: guessTheMovieBollywoodthumbnail,
					description:
						'Play Guess the Movie – Bollywood and guess the name of hindi movies before running out of lives or time, with hints to help. With over 500 hindi movies to guess, this movie guessing game is a fun way to test your movie knowledge.'
				}
			]
		},
		isPartOf: isPartOf
	}
];
