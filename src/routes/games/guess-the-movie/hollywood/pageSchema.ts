import { isPartOf } from '../../../homePageSchema';
import guessTheMovieHollywoodthumbnail from '$lib/assets/images/thumbnail/guess-the-movie-hollywood-thumbnail.webp';

export const pageSchemaHollywood = [
	{
		'@context': 'http://schema.org',
		'@type': 'ItemPage',
		'@id': 'https://quickgamez.com/games/guess-the-movie/hollywood/#ItemPage',
		url: 'https://quickgamez.com/games/guess-the-movie/hollywood',
		name: 'Guess the Movie – Hollywood | Play Online for Free! | QuickGamez',
		description:
			'Play Guess the Movie – Hollywood and guess the name of Hollywood movies before running out of lives or time, with hints to help. With over 1000 movies to guess, this movie guessing game is a fun way to test your movie knowledge.',
		inLanguage: 'en',
		breadcrumb: {
			'@type': 'BreadcrumbList',
			'@id': 'https://quickgamez.com/games/guess-the-movie/hollywood/#BreadcrumbList',
			name: 'Guess the Movie – Hollywood | Play Online for Free! | QuickGamez',
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
				},
				{
					'@type': 'ListItem',
					position: 3,
					item: {
						'@type': 'Thing',
						'@id': 'https://quickgamez.com/games/guess-the-movie/hollywood',
						name: 'Guess The Movie – Hollywood'
					}
				}
			]
		},
		primaryImageOfPage: {
			'@type': 'ImageObject',
			url: guessTheMovieHollywoodthumbnail,
			thumbnailUrl: guessTheMovieHollywoodthumbnail,
			image: guessTheMovieHollywoodthumbnail,
			contentUrl: guessTheMovieHollywoodthumbnail,
			width: '2048',
			height: '2048'
		},
		thumbnail: {
			'@type': 'ImageObject',
			url: guessTheMovieHollywoodthumbnail,
			thumbnailUrl: guessTheMovieHollywoodthumbnail,
			image: guessTheMovieHollywoodthumbnail,
			contentUrl: guessTheMovieHollywoodthumbnail,
			width: '2048',
			height: '2048'
		},
		thumbnailUrl: guessTheMovieHollywoodthumbnail,
		image: {
			'@type': 'ImageObject',
			url: guessTheMovieHollywoodthumbnail,
			thumbnailUrl: guessTheMovieHollywoodthumbnail,
			image: guessTheMovieHollywoodthumbnail,
			contentUrl: guessTheMovieHollywoodthumbnail,
			width: '2048',
			height: '2048'
		},
		mainEntity: {
			'@type': ['Game', 'WebApplication'],
			name: 'Guess the Movie – Hollywood',
			description:
				'Play Guess the Movie – Hollywood and guess the name of Hollywood movies before running out of lives or time, with hints to help. With over 1000 movies to guess, this movie guessing game is a fun way to test your movie knowledge.',
			url: 'https://quickgamez.com/games/guess-the-movie/hollywood',
			image: {
				'@type': 'ImageObject',
				url: guessTheMovieHollywoodthumbnail,
				thumbnailUrl: guessTheMovieHollywoodthumbnail,
				image: guessTheMovieHollywoodthumbnail,
				contentUrl: guessTheMovieHollywoodthumbnail,
				width: '2048',
				height: '2048'
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
				priceCurrency: 'USD',
				availability: 'http://schema.org/InStock'
			},
			screenshot: {
				'@type': 'ImageObject',
				url: guessTheMovieHollywoodthumbnail,
				thumbnailUrl: guessTheMovieHollywoodthumbnail,
				image: guessTheMovieHollywoodthumbnail,
				contentUrl: guessTheMovieHollywoodthumbnail,
				width: '2048',
				height: '2048'
			},
			thumbnail: {
				'@type': 'ImageObject',
				url: guessTheMovieHollywoodthumbnail,
				thumbnailUrl: guessTheMovieHollywoodthumbnail,
				image: guessTheMovieHollywoodthumbnail,
				contentUrl: guessTheMovieHollywoodthumbnail,
				width: '2048',
				height: '2048'
			},
			thumbnailUrl: guessTheMovieHollywoodthumbnail
		},
		isPartOf: isPartOf
	}
];
