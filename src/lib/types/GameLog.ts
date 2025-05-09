export interface GameLog {
	timestamp: Date;
	message: string;
	type: 'success' | 'error' | 'neutral' | 'warning' | 'info';
}
