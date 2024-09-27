import * as cheerio from "cheerio";

interface SearchResult {
	title: string;
	description: string;
	url: string;
}

export const webSearch = async (
	query: string,
	numResults = 10,
): Promise<SearchResult[]> => {
	const headers = {
		"User-Agent":
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
		Accept:
			"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,/;q=0.8",
		"Accept-Language": "en-US,en;q=0.5",
		Referer: "https://www.google.com/",
		DNT: "1",
		Connection: "keep-alive",
		"Upgrade-Insecure-Requests": "1",
	};

	const search_url = `https://www.google.com/search?q=${encodeURIComponent(query)}&num=${numResults}`;
	console.log(`Search URL: ${search_url}`);

	try {
		const response = await fetch(search_url, {
			headers,
			signal: AbortSignal.timeout(10000), // 10 seconds timeout
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const html = await response.text();
		const $ = cheerio.load(html);
		const search_results: SearchResult[] = [];

		$(".g").each((_, element: cheerio.Element) => {
			const $element = $(element);
			const $anchor = $element.find("a");
			const $title = $element.find("h3");
			const $description = $element.find("div.VwiC3b, div.yXK7lf");

			const title = $title.text() || "No title";
			const url = $anchor.attr("href") || "No URL";
			let description = $description.text().trim();

			if (!description) {
				description = $element.text().trim();
			}

			search_results.push({
				title,
				description,
				url,
			});
		});

		if (process.env.DEBUG === "true") {
			console.log(
				`Successfully retrieved ${search_results.length} search results for query: ${query}`,
			);
			console.log(
				`Search results preview: ${JSON.stringify(search_results.slice(0, 5), null, 2)}`,
			);
		}

		return search_results;
	} catch (error) {
		const errorMessage = `Error performing search for query '${query}': ${error instanceof Error ? error.message : String(error)}`;
		if (process.env.DEBUG === "true") {
			console.error(errorMessage);
		}
		return [];
	}
};
