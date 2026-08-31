import type { VercelRequest, VercelResponse } from '@vercel/node'

const IP_WINDOW_MS = 60 * 1000 // 1 minute
const IP_LIMIT = 6
const EMAIL_LIMIT = 4
const MAX_BODY_CHARS = 20000

type EntryMap = Map<string, number[]>
const ipMap: EntryMap = new Map()
const emailMap: EntryMap = new Map()

function cleanupMap(map: EntryMap, windowMs: number) {
  const now = Date.now()
  for (const [k,arr] of map.entries()) {
    const filtered = arr.filter((t) => now - t <= windowMs)
    if (filtered.length === 0) map.delete(k)
    else map.set(k,filtered)
  }
}

function recordAndCheck(map: EntryMap, key: string, windowMs: number, limit: number) {
  const now = Date.now()
  const arr = map.get(key) || []
  const filtered = arr.filter((t) => now - t <= windowMs)
  filtered.push(now)
  map.set(key, filtered)
  return filtered.length <= limit
}

function escapeHtml(s: string) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const allowedOrigin = process.env.FRONTEND_ORIGIN || process.env.ALLOWED_ORIGIN || ''
  const origin = req.headers.origin || ''
  const setCors = () => {
    if (allowedOrigin) {
      if (origin === allowedOrigin) {
        res.setHeader('Access-Control-Allow-Origin', allowedOrigin)
      }
    } else {
      res.setHeader('Access-Control-Allow-Origin', '*')
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  }

  setCors()

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' })
    return
  }

  try {
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {})
    if (rawBody.length > MAX_BODY_CHARS) {
      res.status(413).json({ message: 'Payload too large' })
      return
    }

    const { name, company = '', email, message = '', hp } = (typeof req.body === 'object' ? req.body : JSON.parse(rawBody || '{}')) as Record<string, any>

    // Honeypot
    if (hp) {
      // silently reject but respond OK to avoid feedback to bots
      res.status(200).json({ message: 'ok' })
      return
    }

    // Basic validation and limits
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      res.status(400).json({ message: 'お名前は必須です。', errors: { name: 'お名前を入力してください。' } })
      return
    }
    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      res.status(400).json({ message: 'メールアドレスは必須です。', errors: { email: 'メールアドレスを入力してください。' } })
      return
    }
    if (typeof email !== 'string' || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      res.status(400).json({ message: 'メールアドレス形式が不正です。', errors: { email: '正しいメールアドレスを入力してください。' } })
      return
    }

    // Length limits
    if (name.length > 200 || company.length > 200 || email.length > 320 || message.length > 2000) {
      res.status(400).json({ message: '入力が長すぎます。' })
      return
    }

    // Rate limiting (IP & email)
    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '') as string
    cleanupMap(ipMap, IP_WINDOW_MS)
    cleanupMap(emailMap, IP_WINDOW_MS)

    const ipOk = recordAndCheck(ipMap, ip || 'unknown', IP_WINDOW_MS, IP_LIMIT)
    if (!ipOk) {
      res.status(429).json({ message: 'Rate limit' })
      return
    }

    const emailOk = recordAndCheck(emailMap, (email || '').toLowerCase(), IP_WINDOW_MS, EMAIL_LIMIT)
    if (!emailOk) {
      res.status(429).json({ message: 'Rate limit' })
      return
    }

    // Prepare email
    const MAIL_FROM = process.env.MAIL_FROM
    const CONTACT_EMAIL = process.env.CONTACT_EMAIL
    const RESEND_API_KEY = process.env.RESEND_API_KEY

    if (!MAIL_FROM || !CONTACT_EMAIL || !RESEND_API_KEY) {
      res.status(503).json({ message: 'メールサービスの設定が不十分です。' })
      return
    }

    const subject = '【Rendix】お問い合わせ'
    const safeName = escapeHtml(String(name))
    const safeCompany = escapeHtml(String(company || ''))
    const safeEmail = escapeHtml(String(email))
    const safeMessage = escapeHtml(String(message || ''))

    const html = `
      <div>
        <p>Rendix LPからお問い合わせがありました。</p>
        <hr />
        <p><strong>■ お名前</strong><br/>${safeName}</p>
        <p><strong>■ 会社名</strong><br/>${safeCompany || '（未入力）'}</p>
        <p><strong>■ メールアドレス</strong><br/>${safeEmail}</p>
        <p><strong>■ お問い合わせ内容</strong><br/>${safeMessage || '（未入力）'}</p>
      </div>
    `

    // Call Resend
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    try {
      const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: MAIL_FROM,
          to: [CONTACT_EMAIL],
          subject,
          html,
          reply_to: email,
        }),
        signal: controller.signal,
      })
      clearTimeout(timeout)

      if (!resp.ok) {
        if (resp.status === 429) {
          res.status(429).json({ message: 'Rate limit' })
          return
        }
        res.status(502).json({ message: 'メール送信に失敗しました。' })
        return
      }

      res.status(200).json({ message: 'ok' })
    } catch (err) {
      if ((err as any)?.name === 'AbortError') {
        res.status(504).json({ message: 'メール送信がタイムアウトしました。' })
      } else {
        res.status(502).json({ message: 'メール送信に失敗しました。' })
      }
    }
  } catch (err) {
    res.status(500).json({ message: '不明なエラーが発生しました。' })
  }
}
