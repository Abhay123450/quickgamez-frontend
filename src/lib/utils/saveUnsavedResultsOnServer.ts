import { API_ROUTES } from '$lib/constants/apiRoutes';
import { addToast } from '../../routes/stores';
import { fetchWithTokenRefresh } from './fetchRequest';

export async function saveUnsavedResultsOnServer() {
	if (!localStorage) {
		return;
	}
	const data = localStorage.getItem('games-not-saved-on-server');
	if (!data) {
		return;
	}
	const games = JSON.parse(data);
	const [error, res] = await fetchWithTokenRefresh(
		new URL(API_ROUTES.GUESS_THE_MOVIE.SAVE_MULTIPLE_RESULTS),
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(games)
		}
	);

	if (error) {
		console.error(`error saving unsaved results on server ${JSON.stringify(error)}`);
		return;
	}

	localStorage.removeItem('games-not-saved-on-server');
	addToast('Your game progress saved successfully', 'success', 3000);
}
