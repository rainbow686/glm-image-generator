module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.FAL_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Server configuration error' });

  const { prompt, image_size, request_id } = req.body;

  // Step 2: Poll for result
  if (request_id) {
    try {
      const statusRes = await fetch(`https://queue.fal.run/fal-ai/glm-image/requests/${request_id}`, {
        headers: { 'Authorization': `Key ${apiKey}` }
      });
      const statusData = await statusRes.json();
      return res.status(200).json(statusData);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to check status' });
    }
  }

  // Step 1: Submit job to queue
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    const response = await fetch('https://queue.fal.run/fal-ai/glm-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Key ${apiKey}`
      },
      body: JSON.stringify({
        prompt,
        image_size: image_size || 'square_hd',
        num_inference_steps: 28,
        guidance_scale: 7.5
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.detail || data.message || 'Submission failed' });
    }

    // Return request_id for polling
    return res.status(200).json({ request_id: data.request_id, status: 'IN_QUEUE' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
