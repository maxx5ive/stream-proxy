export default async function handler(req, res) {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).send('URL required');
  }
  
  try {
    const decodedUrl = decodeURIComponent(url);
    const response = await fetch(decodedUrl);
    
    if (!response.ok) {
      return res.status(response.status).send('Error fetching file');
    }
    
    const buffer = await response.arrayBuffer();
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-cache');
    
    res.send(Buffer.from(buffer));
  } catch (e) {
    res.status(500).send('Error: ' + e.message);
  }
}
