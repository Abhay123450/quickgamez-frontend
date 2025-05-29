import { isPartOf } from '../../../homePageSchema';
import guessTheMovieBollywoodthumbnail from '$lib/assets/images/thumbnail/guess-the-movie-bollywood-thumbnail.webp';

export const pageSchemaBollywood = [
	{
		'@context': 'http://schema.org',
		'@type': 'ItemPage',
		'@id': 'https://quickgamez.com/games/guess-the-movie/bollywood/#ItemPage',
		url: 'https://quickgamez.com/games/guess-the-movie/bollywood',
		name: 'Guess the Movie – Bollywood | Play Online for Free! | QuickGamez',
		description:
			'Play Guess the Movie – Bollywood and guess the name of hindi movies before running out of lives or time, with hints to help. With over 500 hindi movies to guess, this movie guessing game is a fun way to test your movie knowledge.',
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
				},
				{
					'@type': 'ListItem',
					position: 3,
					item: {
						'@type': 'Thing',
						'@id': 'https://quickgamez.com/games/guess-the-movie/bollywood',
						name: 'Guess the Movie – Bollywood'
					}
				}
			]
		},
		primaryImageOfPage: {
			'@type': 'ImageObject',
			url: guessTheMovieBollywoodthumbnail,
			thumbnailUrl: guessTheMovieBollywoodthumbnail,
			image: guessTheMovieBollywoodthumbnail,
			contentUrl: guessTheMovieBollywoodthumbnail,
			width: '2048',
			height: '2048'
		},
		thumbnail: {
			'@type': 'ImageObject',
			url: guessTheMovieBollywoodthumbnail,
			thumbnailUrl: guessTheMovieBollywoodthumbnail,
			image: guessTheMovieBollywoodthumbnail,
			contentUrl: guessTheMovieBollywoodthumbnail,
			width: '2048',
			height: '2048'
		},
		thumbnailUrl: guessTheMovieBollywoodthumbnail,
		image: {
			'@type': 'ImageObject',
			url: guessTheMovieBollywoodthumbnail,
			thumbnailUrl: guessTheMovieBollywoodthumbnail,
			image: guessTheMovieBollywoodthumbnail,
			contentUrl: guessTheMovieBollywoodthumbnail,
			width: '2048',
			height: '2048'
		},
		mainEntity: {
			'@type': ['Game', 'WebApplication'],
			name: 'Guess the Movie – Bollywood',
			description:
				'Play Guess the Movie – Bollywood and guess the name of hindi movies before running out of lives or time, with hints to help. With over 500 hindi movies to guess, this movie guessing game is a fun way to test your movie knowledge.',
			url: 'https://quickgamez.com/games/guess-the-movie/bollywood',
			image: {
				'@type': 'ImageObject',
				url: guessTheMovieBollywoodthumbnail,
				thumbnailUrl: guessTheMovieBollywoodthumbnail,
				image: guessTheMovieBollywoodthumbnail,
				contentUrl: guessTheMovieBollywoodthumbnail,
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
				priceCurrency: 'INR',
				availability: 'http://schema.org/InStock'
			},
			screenshot: {
				'@type': 'ImageObject',
				url: guessTheMovieBollywoodthumbnail,
				thumbnailUrl: guessTheMovieBollywoodthumbnail,
				image: guessTheMovieBollywoodthumbnail,
				contentUrl: guessTheMovieBollywoodthumbnail,
				width: '2048',
				height: '2048'
			},
			thumbnail: {
				'@type': 'ImageObject',
				url: guessTheMovieBollywoodthumbnail,
				thumbnailUrl: guessTheMovieBollywoodthumbnail,
				image: guessTheMovieBollywoodthumbnail,
				contentUrl: guessTheMovieBollywoodthumbnail,
				width: '2048',
				height: '2048'
			},
			thumbnailUrl: guessTheMovieBollywoodthumbnail
		},
		isPartOf: isPartOf
	}
];
