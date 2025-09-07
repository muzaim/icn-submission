export const fetchSuggestions = async (query: string) => {
	if (!query) return [];
	const res = await fetch("http://localhost:3001/api/suggestions", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ query }),
	});
	const data = await res.json();
	return data.suggestions;
};
