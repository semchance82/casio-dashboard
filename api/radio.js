export const config = { runtime: 'edge' };

export default async function handler(req) {
  var url = new URL(req.url);
  var station = url.searchParams.get('station') || 'lared';

  var streams = {
    lared: 'https://playerservices.streamtheworld.com/api/livestream-redirect/LA_REDAAC.aac',
    aspen: 'https://playerservices.streamtheworld.com/api/livestream-redirect/ASPENAAC.aac'
  };

  var streamUrl = streams[station] || streams.lared;

  var response = await fetch(streamUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (iPad; CPU OS 12_0 like Mac OS X) AppleWebKit/605.1.15',
      'Icy-MetaData': '1'
    }
  });

  var headers = new Headers();
  headers.set('Content-Type', response.headers.get('Content-Type') || 'audio/aac');
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Cache-Control', 'no-cache');
  var ct = response.headers.get('Content-Type') || '';
  if (ct.includes('text/html')) {
    var location = response.headers.get('Location') || response.url;
    return new Response(null, {
      status: 302,
      headers: { 'Location': location, 'Access-Control-Allow-Origin': '*' }
    });
  }

  return new Response(response.body, { status: response.status, headers });
}
