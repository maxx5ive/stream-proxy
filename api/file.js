export default async function handler(req, res) {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).send('URL required');
  }
  
  try {
    const response = await fetch(decodeURIComponent(url));
    const buffer = await response.arrayBuffer();
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/octet-stream');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    
    res.send(Buffer.from(buffer));
  } catch (e) {
    res.status(500).send('Error: ' + e.message);
  }
}
