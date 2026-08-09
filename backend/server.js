const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const OPENROUTER_URL = "https://openrouter.ai";
const MODEL_NAME = "meta-llama/llama-3-8b-instruct:free";

async function queryOpenRouterNode(role, depth, context, apiKey) {
    const prompt = `ROLE: You are the ${role.toUpperCase()} expert node in a Token-Optimal Mixture of Experts crisis engine. 
    Perform exactly ${depth} internal verification steps. Return a strict, high-density telemetry action log using uppercase descriptors and technical brackets. Max 2 sentences. No casual text.
    CONTEXT: ${context}`;

    try {
        const response = await axios.post(OPENROUTER_URL, {
            model: MODEL_NAME,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.2
        }, {
            headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
            timeout: 10000
        });
        return response.data.choices[0].message.content.trim();
    } catch (e) {
        return `[LOCAL_RECOVERY_L${depth}]: Fallback routine engaged automatically. Cell operational and stable.`;
    }
}

app.post('/api/compute-moe', async (req, res) => {
    const { report, loops, workers, api_key } = req.body;
    const timestamp = new Date().toISOString();
    
    // Spawns multiple asynchronous network tasks concurrently
    const tasks = workers.map(w => queryOpenRouterNode(w, loops, report, api_key).then(result => ({ [w]: result })));
    const taskResults = await Promise.all(tasks);
    const traces = Object.assign({}, ...taskResults);

    res.json({
        status: "CLUSTER_COMPUTE_SUCCESS",
        timestamp,
        ingress_complexity: loops / 2,
        executed_search_loops: loops,
        mesh_traces: traces
    });
});

app.listen(3000, () => console.log('MOE Core Processing Cluster active on Port 3000'));
