export default async function handler(req, res) {
  try {
    const response = await fetch('http://181.209.37.74:8001/play/a08a/index.m3u8');
    const data = await response.text();
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    res.setHeader('Cache-Control', 'no-cache');
    
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
}
