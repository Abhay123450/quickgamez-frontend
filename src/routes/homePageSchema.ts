import QuickGamezLogo from '$lib/assets/images/logo/logo1600.webp';
import guessTheMovieHollywoodThumbnail from '$lib/assets/images/thumbnail/guess-the-movie-hollywood-thumbnail.webp';
import guessTheMovieBollywoodThumbnail from '$lib/assets/images/thumbnail/guess-the-movie-bollywood-thumbnail.webp';
import rebusPuzzlesThumbnail from '$lib/assets/images/thumbnail/rebus-puzzles-thumbnail-1080.webp';

export const websiteDescription =
	'QuickGamez is a website where you can play onlines games for free on your mobile, tablet or computer. No downloads, no login. Play now!';

export const isPartOf = {
	'@type': 'WebSite',
	'@id': 'https://quickgamez.com/#website',
	name: 'QuickGamez',
	url: 'https://quickgamez.com/',
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
		logo: QuickGamezLogo,
		brand: {
			'@type': 'Brand',
			'@id': 'https://quickgamez.com/#brand',
			name: 'QuickGamez',
			slogan: 'Play, Win, Repeat.'
		},
		email: 'contact@quickgamez.com'
	}
};

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
			numberOfItems: 2,
			itemListElement: [
				{
					'@type': 'ListItem',
					position: 1,
					name: 'Guess The Movie - Hollywood',
					url: 'https://quickgamez.com/games/guess-the-movie/hollywood',
					image: guessTheMovieHollywoodThumbnail,
					description:
						'Play Guess the Movie - Hollywood and guess the name of hollywood movies before running out of lives or time, with hints to help.'
				},
				{
					'@type': 'ListItem',
					position: 2,
					name: 'Guess The Movie - Bollywood',
					url: 'https://quickgamez.com/games/guess-the-movie/bollywood',
					image: guessTheMovieBollywoodThumbnail,
					description:
						'Play Guess the Movie - Bollywood and guess the name of hindi movies before running out of lives or time, with hints to help.'
				},
				{
					'@type': 'ListItem',
					position: 3,
					name: 'Rebus Puzzles',
					url: 'https://quickgamez.com/games/rebus-puzzles',
					image: rebusPuzzlesThumbnail,
					description:
						'Play Rebus Puzzles online – a fun and brain-teasing word game where images, symbols, and letters combine to reveal hidden phrases.'
				}
			]
		},
		isPartOf: isPartOf
	}
];
