import { popPreviousFocusElement, pushPreviousFocusElement } from '../routes/stores';

export function trapFocus(node: HTMLElement) {
	const previous: HTMLElement | null = document.activeElement as HTMLElement;

	pushPreviousFocusElement(previous);

	function focusable(): HTMLElement[] {
		const focusableElements: NodeListOf<HTMLElement> = node.querySelectorAll(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		);
		return Array.from(focusableElements).filter((el): el is HTMLElement => {
			const tabindex = el.getAttribute('tabindex');
			return tabindex === null || tabindex !== '-1';
		});
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key !== 'Tab') return;

		const current = document.activeElement as HTMLElement;

		const elements: HTMLElement[] = focusable();
		const first: HTMLElement = elements[0];
		const last: HTMLElement = elements[elements.length - 1];

		if (event.shiftKey && current === first) {
			last.focus();
			event.preventDefault();
		} else if (!event.shiftKey && current === last) {
			first.focus();
			event.preventDefault();
		}
	}

	const firstFocusable = focusable()[0];
	if (firstFocusable) {
		firstFocusable.focus();
	}

	node.addEventListener('keydown', handleKeydown);

	return {
		destroy() {
			node.removeEventListener('keydown', handleKeydown);
			const previous = popPreviousFocusElement();
			if (previous) {
				previous.focus();
			}
		}
	};
}

// export function trapFocus(node: any) {
//     const previous: any = document.activeElement;

//     function focusable(): any[] {
//         return Array.from(node.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
//                     .filter(el => !el.hasAttribute('tabindex') || el.getAttribute('tabindex') !== '-1');
//         // return Array.from(node.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
//     }

//     function handleKeydown(event:any) {
//         if (event.key !== 'Tab') return;

//         const current = document.activeElement;

//         const elements: any[] = focusable();
//         const first: any = elements.at(0);
//         const last: any = elements.at(-1)

//         if (event.shiftKey && current === first) {
//             last.focus();
//             event.preventDefault();
//         }

//         if (!event.shiftKey && current === last) {
//             first.focus();
//             event.preventDefault();
//         }
//     }

//     focusable()[0]?.focus();

//     node.addEventListener('keydown', handleKeydown);

//     return {
//         destroy() {
//             node.removeEventListener('keydown', handleKeydown);
//             previous?.focus();
//         }
//     };
// }
