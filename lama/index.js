import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post("/api/suggestions", async (req, res) => {
	const { query } = req.body;

	try {
		const response = await fetch(`${process.env.OLLAMA_URL}/api/generate`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				model: "llama3",
				prompt: `Give me 3 short todo suggestions related to: "${query}".
  Return ONLY a JSON array of strings, no extra text.`,
				stream: false,
			}),
		});

		const data = await response.json();

		let text = data.response;

		text = text.replace(/```json|```|\n/g, "").trim();

		let suggestions;
		try {
			suggestions = JSON.parse(text);
		} catch (err) {
			console.error("Failed to parse JSON:", err);
			suggestions = [];
		}

		res.json({ suggestions });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Ollama request failed" });
	}
});

app.listen(process.env.PORT, () =>
	console.log(
		`✅ Backend proxy running at http://localhost:${process.env.PORT}`
	)
);
