// Googleカレンダーの非公開iCal URLを取得して返す（ブラウザから直接はCORSで読めないため中継）
module.exports = async (req, res) => {
  const url = String(req.query.url || '');
  if (!/^https:\/\/calendar\.google\.com\/calendar\/ical\/[^\s]+\.ics$/.test(url)) {
    res.status(400).send('invalid url');
    return;
  }
  try {
    const r = await fetch(url, { redirect: 'follow' });
    if (!r.ok) { res.status(r.status).send('fetch failed'); return; }
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(await r.text());
  } catch (e) {
    res.status(502).send('fetch error');
  }
};
