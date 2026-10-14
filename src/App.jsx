import { useEffect } from 'react'
import { ToastProvider } from './lib/toast.jsx'
import { WalletProvider } from './lib/wallet.jsx'
import { UserProvider } from './lib/user.jsx'
import { NotifyProvider } from './lib/notify.jsx'
import { NavProvider, TABS, useNav } from './lib/nav.jsx'
import TabBar from './components/TabBar.jsx'
import Home from './screens/Home.jsx'
import Send from './screens/Send.jsx'
import Goals from './screens/Goals.jsx'
import SaveToGoal from './screens/SaveToGoal.jsx'
import NewGoal from './screens/NewGoal.jsx'
import Activity from './screens/Activity.jsx'
import Request from './screens/Request.jsx'
import Circles from './screens/Circles.jsx'
import CircleDetail from './screens/CircleDetail.jsx'
import Chat from './screens/Chat.jsx'
import Start from './screens/Start.jsx'
import Join from './screens/Join.jsx'
import CircleRoom from './screens/CircleRoom.jsx'
import Payout from './screens/Payout.jsx'
import Notifications from './screens/Notifications.jsx'
import Profile from './screens/Profile.jsx'
import ChangePin from './screens/ChangePin.jsx'
import Banks from './screens/Banks.jsx'
import Help from './screens/Help.jsx'
import Onboarding from './screens/Onboarding.jsx'
import Placeholder from './screens/Placeholder.jsx'

// Register screens here as they are ported. Anything missing falls back to Placeholder.
const SCREENS = { Home, Send, Goals, SaveToGoal, NewGoal, Activity, Request, Circles, CircleDetail, Chats: Chat, Start, Join, CircleRoom, Payout, Notifications, Profile, ChangePin, Banks, Help, Onboarding }
// Screens that take over the whole display (no tab bar).
const FLOW = new Set(['Send', 'Onboarding'])

function Shell() {
  const { top, root, go } = useNav()
  const Screen = SCREENS[top.name]
  useEffect(() => { window.scrollTo(0, 0) }, [top])
  return (
    <>
      <main className="mx-auto flex min-h-dvh max-w-[430px] flex-col gap-6 px-5 pt-5 pb-[calc(7rem+env(safe-area-inset-bottom))]">
        {Screen ? <Screen {...top.params} /> : <Placeholder name={top.name} />}
      </main>
      {!FLOW.has(top.name) && <TabBar tabs={TABS} current={root} onSelect={(t) => go(t)} />}
    </>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <UserProvider>
        <NotifyProvider>
          <WalletProvider>
            <NavProvider><Shell /></NavProvider>
          </WalletProvider>
        </NotifyProvider>
      </UserProvider>
    </ToastProvider>
  )
}
