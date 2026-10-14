import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { provider } from './provider.js'
import { useToast } from './toast.jsx'
import { useNotify } from './notify.jsx'
import { money } from './format.js'
import { namesOf } from './circles.js'

const Ctx = createContext(null)

export function WalletProvider({ children }) {
  const [s, setS] = useState({ balance: 0, paid: 0, youPaid: false, activity: [], allActivity: [], requests: [], members: [], messages: [], circles: [], banks: [], goals: [] })
  const refresh = useCallback(async () => {
    const [balance, paid, youPaid, activity, goals, allActivity, requests, members, messages, circles, banks] = await Promise.all([
      provider.getBalance(), provider.getPaid(), provider.getYouPaid(), provider.getActivity(), provider.getGoals(), provider.getAllActivity(), provider.getRequests(), provider.getMembers(), provider.getMessages(), provider.getCircles(), provider.getBanks(),
    ])
    setS({ balance, paid, youPaid, activity, allActivity, requests, members, messages, circles, banks, goals })
  }, [])
  const toast = useToast()
  const { notify } = useNotify()
  useEffect(() => { refresh() }, [refresh])

  const addMoney = async (a) => { await provider.addMoney(a); await refresh() }
  const send = async (a, to) => { const ref = await provider.send(a, to); await refresh(); return ref }
  const saveToGoal = async (i, a) => {
    await provider.saveToGoal(i, a)
    await refresh()
    const g = (await provider.getGoals())[i]
    const before = ((g.s - a) / g.g) * 100, after = (g.s / g.g) * 100
    const m = [100, 75, 50, 25].find((t) => before < t && after >= t) // highest milestone crossed
    if (m) notify('goals', m === 100 ? `Goal reached: ${g.n}` : `You're ${m}% to ${g.n}`, 'Goals', { name: 'Goals' })
  }
  const addGoal = async (n, g, d) => { const i = await provider.addGoal(n, g, d); await refresh(); return i }
  // Sends a request, then simulates the other person paying it a few seconds later.
  const requestMoney = async (to, a, note) => {
    const id = await provider.request(to, a, note)
    await refresh()
    setTimeout(async () => {
      const r = await provider.settle(id)
      if (!r) return
      await refresh()
      notify('payments', `${r.n} paid your ${money(r.a)} request`, 'Request', { name: 'Activity' })
    }, 6000)
    return id
  }
  const postMessage = async (t) => { await provider.postMessage(t); await refresh() }
  const nudge = async (n) => { await provider.nudge(n); await refresh() }
  // Other members "arrive" every few seconds until the circle is full.
  const simulate = (code) => {
    const t = setInterval(async () => {
      const c = await provider.addMember(code)
      if (!c) return clearInterval(t)
      await refresh()
      if (c.joinedN >= c.size) { notify('circles', `${c.name} is full`, 'Payout order drawn', { name: 'CircleRoom', params: { code } }); clearInterval(t) }
      else toast(`${namesOf(c)[c.joinedN - 1]} joined ${c.name}`)
    }, 4000)
  }
  // After you pay a round, the others pay one by one, then the pot is paid out.
  const runRound = (code) => {
    const t = setInterval(async () => {
      const r = await provider.progressRound(code)
      if (!r) return clearInterval(t)
      const pot = money(r.c.amt * r.c.size)
      await refresh()
      if (r.e === 'paid') toast(`${r.who} paid ${r.c.name}`)
      else if (r.e === 'ready') { notify('circles', 'Your payout is ready', `${pot} from ${r.c.name}`, { name: 'CircleRoom', params: { code } }); clearInterval(t) }
      else { notify('circles', `${r.who} collected ${pot}`, r.c.name, { name: 'CircleRoom', params: { code } }); clearInterval(t) }
    }, 2200)
  }
  const createCircle = async (c) => { await provider.createCircle(c); await refresh(); simulate(c.code) }
  const joinCircle = async (c) => { await provider.joinCircle(c); await refresh(); simulate(c.code) }
  const leaveCircle = async (code) => { await provider.leaveCircle(code); await refresh() }
  const payJoined = async (code) => { await provider.payJoined(code); await refresh(); runRound(code) }
  const collect = async (code) => { const pot = await provider.collect(code); await refresh(); return pot }
  const addBank = async (b) => { await provider.addBank(b); await refresh() }
  const removeBank = async (id) => { await provider.removeBank(id); await refresh() }
  const payCircle = async (a) => { await provider.payCircle(a); await refresh() }

  return <Ctx.Provider value={{ ...s, addMoney, payCircle, send, saveToGoal, addGoal, requestMoney, postMessage, nudge, createCircle, joinCircle, leaveCircle, payJoined, collect, addBank, removeBank, refresh }}>{children}</Ctx.Provider>
}
export const useWallet = () => useContext(Ctx)
