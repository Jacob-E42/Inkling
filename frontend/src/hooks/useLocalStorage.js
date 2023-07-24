import { useState, useEffect } from "react";

function useLocalStorage(key, initialValue) {
	// Get from local storage then
	// parse stored json or return initialValue
	let initialItem;

	try {
		const storedValue = localStorage.getItem(key);
		initialItem = storedValue ? JSON.parse(storedValue) : initialValue;
	} catch (error) {
		console.warn(`Error reading localStorage key “${key}”:`, error);
		initialItem = initialValue;
	}

	// State to store our value
	// Pass initial state function to useState so logic is only executed once
	const [item, setItem] = useState(initialItem);

	// Listen for changes to the value associated with our key in other instances of this app
	useEffect(() => {
		console.debug("useLocalStorage useEffect", "item=", item);

		if (item === null) {
			localStorage.removeItem(key);
		} else {
			localStorage.setItem(key, JSON.stringify(item));
		}
	}, [key, item]);

	return [item, setItem];
}

export default useLocalStorage;
