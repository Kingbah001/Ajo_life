import { namesOf } from './circles.js'

// Mock money layer. Screens only talk to this module, so swapping in a real API client
// (or a payments sandbox) later means rewriting this file, not the UI.
const wait = (v) => new Promise((r) => setTimeout(() => r(v), 250))
const H = 36e5
const D = (daysAgo, hour) => { const d = new Date(); d.setHours(hour, 0, 0, 0); d.setDate(d.getDate() - daysAgo); return +d }

const db = {
  balance: 248500,
  // Office Ajo, round 3 of 8. Statuses: paid, due, late.
  members: [
    { n: 'Tunde', s: 'paid' }, { n: 'Amaka', s: 'paid' }, { n: 'Chika', s: 'paid' }, { n: 'You', s: 'due' },
    { n: 'Sade', s: 'due' }, { n: 'Bode', s: 'late' }, { n: 'Kemi', s: 'paid' }, { n: 'Dayo', s: 'paid' },
  ],
  messages: [
    { k: 'sys', t: 'Amaka paid ₦25,000' },
    { k: 'm', f: 'Tunde', t: 'Paid since morning o. Who is remaining?' },
    { k: 'sys', t: "Sade's contribution is due today", nudge: 'Sade' },
    { k: 'm', f: 'Sade', t: "I'll pay by 2pm" },
  ],
  requests: [],
  banks: [],
  circles: [], // circles the user created or joined (Office Ajo is modelled separately above)
  activity: [
    { t: 'Office Ajo contribution', a: -25000, at: Date.now() - 2 * H },
    { t: 'Added from bank', a: 60000, at: Date.now() - 5 * H },
    { t: 'Transfer to Amaka Obi', a: -15000, at: D(1, 15) },
    { t: 'Saved to New laptop', a: -10000, at: D(1, 11) },
    { t: 'Saved to Rent', a: -20000, at: D(1, 9) },
    { t: 'Office Ajo contribution', a: -25000, at: D(7, 18) },
    { t: 'Airtime', a: -2000, at: D(8, 12) },
    { t: 'Received from Tunde', a: 5000, at: D(10, 16) },
  ],
  goals: [
    { n: 'New laptop', s: 180000, g: 450000 },
    { n: 'Rent', s: 320000, g: 600000 },
    { n: 'Emergency fund', s: 110000, g: 500000 },
  ],
}

const CATALOG = {
  'AJO-3580': { name: 'Weekend Savers', amt: 10000, every: 'week', size: 6, joinedN: 4, by: 'Kemi' },
  'AJO-7305': { name: 'Family Esusu', amt: 50000, every: 'month', size: 10, joinedN: 7, by: 'Mum' },
}
const find = (code) => db.circles.find((c) => c.code === code)

export const provider = {
  getBalance: () => wait(db.balance),
  getPaid: () => wait(db.members.filter((m) => m.s === 'paid').length),
  getYouPaid: () => wait(db.members.find((m) => m.n === 'You').s === 'paid'),
  getMembers: () => wait(db.members.map((m) => ({ ...m }))),
  getMessages: () => wait(db.messages.map((m) => ({ ...m }))),
  postMessage(t) { db.messages.push({ k: 'me', t }); return wait(true) },
  nudge(n) { db.messages.push({ k: 'sys', t: 'You nudged ' + n + ' to pay' }); return wait(true) },
  getActivity: () => wait(db.activity.slice(0, 3).map((x) => ({ ...x }))),
  getAllActivity: () => wait(db.activity.map((x) => ({ ...x }))),
  getCircles: () => wait(db.circles.map((c) => ({ ...c }))),
  findCircle(code) {
    const k = code.trim().toUpperCase(), x = CATALOG[k]
    return x ? wait({ code: k, ...x }) : Promise.reject(new Error('No circle found for that code'))
  },
  joinCircle(c) {
    if (find(c.code)) return Promise.reject(new Error('You are already in this circle'))
    db.circles.push({ ...c, joinedN: c.joinedN + 1 })
    return wait(c.code)
  },
  createCircle(c) { db.circles.push({ ...c, joinedN: 1, by: 'You' }); return wait(c.code) },
  leaveCircle(code) { db.circles = db.circles.filter((c) => c.code !== code); return wait(true) },
  // Simulates another member arriving. When the circle fills, the payout order is drawn and round 1 starts.
  addMember(code) {
    const c = find(code)
    if (!c || c.joinedN >= c.size) return wait(null)
    c.joinedN++
    if (c.joinedN >= c.size) {
      Object.assign(c, { order: [...namesOf(c).slice(0, c.size)].sort(() => Math.random() - 0.5), round: 1, others: 0, paid: false, pending: false, done: false })
    }
    return wait({ ...c })
  },
  payJoined(code) {
    const c = find(code)
    if (!c) return Promise.reject(new Error('Circle not found'))
    if (c.paid) return Promise.reject(new Error('Already paid'))
    if (db.balance < c.amt) return Promise.reject(new Error('Insufficient balance'))
    db.balance -= c.amt
    c.paid = true
    db.activity.unshift({ t: c.name + ' contribution', a: -c.amt, at: Date.now() })
    return wait(db.balance)
  },
  // One step of a round: another member pays, or the pot is paid out (to you, or to someone else).
  progressRound(code) {
    const c = find(code)
    if (!c || !c.round || !c.paid || c.pending || c.done) return wait(null)
    if (c.others < c.size - 1) {
      c.others++
      return wait({ e: 'paid', c: { ...c }, who: c.order.filter((n) => n !== 'You')[c.others - 1] })
    }
    const who = c.order[c.round - 1]
    if (who === 'You') { c.pending = true; return wait({ e: 'ready', c: { ...c } }) }
    c.round++; c.paid = false; c.others = 0
    if (c.round > c.size) c.done = true
    return wait({ e: 'collected', c: { ...c }, who })
  },
  collect(code) {
    const c = find(code)
    if (!c || !c.pending) return Promise.reject(new Error('Nothing to collect'))
    const pot = c.amt * c.size
    db.balance += pot
    db.activity.unshift({ t: c.name + ' payout', a: pot, at: Date.now() })
    c.pending = false; c.round++; c.paid = false; c.others = 0
    if (c.round > c.size) c.done = true
    return wait(pot)
  },
  getBanks: () => wait(db.banks.map((b) => ({ ...b }))),
  addBank(b) {
    if (db.banks.some((x) => x.bank === b.bank && x.num === b.num)) return Promise.reject(new Error('That account is already linked'))
    db.banks.push({ ...b, id: crypto.randomUUID() })
    return wait(db.banks.length)
  },
  removeBank(id) { db.banks = db.banks.filter((b) => b.id !== id); return wait(db.banks.length) },
  getRequests: () => wait(db.requests.map((x) => ({ ...x }))),
  getGoals: () => wait(db.goals.map((g) => ({ ...g }))),
  addMoney(a) {
    db.balance += a
    db.activity.unshift({ t: 'Added from card', a, at: Date.now() })
    return wait(db.balance)
  },
  saveToGoal(i, a) {
    const g = db.goals[i]
    if (!g) return Promise.reject(new Error('Goal not found'))
    if (a <= 0) return Promise.reject(new Error('Enter an amount'))
    if (db.balance < a) return Promise.reject(new Error('Insufficient balance'))
    db.balance -= a
    g.s += a
    db.activity.unshift({ t: 'Saved to ' + g.n, a: -a, at: Date.now() })
    return wait(g.s)
  },
  addGoal(n, g, d) {
    db.goals.push({ n, s: 0, g, d })
    return wait(db.goals.length - 1)
  },
  request(n, a, note) {
    const r = { id: db.requests.length + 1, n, a, note, s: 'pending' }
    db.requests.unshift(r)
    return wait(r.id)
  },
  // Simulates the other person paying. Returns the request, or null if it was already settled.
  settle(id) {
    const r = db.requests.find((x) => x.id === id)
    if (!r || r.s !== 'pending') return wait(null)
    r.s = 'paid'
    db.balance += r.a
    db.activity.unshift({ t: 'Received from ' + r.n, a: r.a, at: Date.now() })
    return wait({ ...r })
  },
  send(a, to) {
    if (a <= 0) return Promise.reject(new Error('Enter an amount'))
    if (db.balance < a) return Promise.reject(new Error('Insufficient balance'))
    db.balance -= a
    db.activity.unshift({ t: 'Transfer to ' + to, a: -a, at: Date.now() })
    return wait('AJO-' + Math.floor(1e7 + Math.random() * 9e7))
  },
  payCircle(a) {
    const me = db.members.find((m) => m.n === 'You')
    if (me.s === 'paid') return Promise.reject(new Error('Already paid this round'))
    if (db.balance < a) return Promise.reject(new Error('Insufficient balance'))
    db.balance -= a
    me.s = 'paid'
    db.messages.push({ k: 'sys', t: 'You paid ₦' + a.toLocaleString('en-NG') })
    db.activity.unshift({ t: 'Office Ajo contribution', a: -a, at: Date.now() })
    return wait(db.balance)
  },
}

// Fixed facts about the demo circle.
export const OFFICE = { name: 'Office Ajo', round: 3, size: 8, each: 25000, collector: 'Chika' }
