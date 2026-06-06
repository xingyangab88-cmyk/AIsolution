/* global process */

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');

  if (request.method === 'GET') {
    const {
      'hub.mode': hubMode,
      'hub.verify_token': hubVerifyToken,
      'hub.challenge': hubChallenge,
    } = request.query || {};

    if (
      hubMode === 'subscribe' &&
      hubVerifyToken === (process.env.META_WEBHOOK_VERIFY_TOKEN || '')
    ) {
      response.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return response.status(200).send(String(hubChallenge));
    }

    return response.status(403).json({ detail: 'Invalid webhook verify token' });
  }

  if (request.method === 'POST') {
    console.log('Meta webhook payload:', request.body);
    return response.status(200).json({ status: 'ok' });
  }

  response.setHeader('Allow', 'GET, POST');
  return response.status(405).json({ detail: 'Method not allowed' });
}
