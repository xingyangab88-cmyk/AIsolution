export default function handler(request, response) {
  response.status(200).json({
    ok: true,
    message: 'TikTok callback received',
    method: request.method,
  });
}
