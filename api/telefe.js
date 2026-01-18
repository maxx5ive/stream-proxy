export default async function handler(req, res) {
  try {
    const response = await fetch('http://181.209.37.74:8001/play/a08a/index.m3u8');
    const text = await response.text();
    
    // Reescribir URLs para que pasen por el proxy
    const modified = text
      .split('\n')
      .map(line => {
        if (line.startsWith('http://181.209.37.74')) {
          return `https://stream-proxy-one.vercel.app/file?url=${encodeURIComponent(line)}`;
        }
        if (line && !line.startsWith('#')) {
          return `https://stream-proxy-one.vercel.app/file?url=${encodeURIComponent('http://181.209.37.74:8001/play/a08a/' + line)}`;
        }
        return line;
      })
      .join('\n');
    
    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache');
    res.send(modified);
  } catch (e) {
    res.status(500).send('Error: ' + e.message);
  }
}
