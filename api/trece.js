export default async function handler(req, res) {
  const baseUrl = 'http://181.209.37.74:8001/play/a07b/';
  
  try {
    // Si piden un segmento .ts o .m3u8 específico
    const segment = req.query.segment || 'index.m3u8';
    const targetUrl = baseUrl + segment;
    
    const response = await fetch(targetUrl);
    
    if (!response.ok) {
      return res.status(response.status).send('Error fetching stream');
    }
    
    let data = await response.text();
    
    // Si es .m3u8, reescribir URLs de los segmentos
    if (segment.endsWith('.m3u8')) {
      const host = req.headers.host;
      const protocol = req.headers['x-forwarded-proto'] || 'https';
      
      // Reescribir URLs relativas
      data = data.replace(
        /^([^#\n].+\.ts)$/gm,
        `${protocol}://${host}/api/trece?segment=$1`
      );
      data = data.replace(
        /^([^#\n].+\.m3u8)$/gm,
        `${protocol}://${host}/api/trece?segment=$1`
      );
      
      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    } else {
      // Si es .ts, servir como video
      res.setHeader('Content-Type', 'video/mp2t');
    }
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache');
    
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
}
