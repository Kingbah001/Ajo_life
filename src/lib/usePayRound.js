import { useToast } from './toast.jsx'
import { useWallet } from './wallet.jsx'

// One place for "pay this round's contribution", shared by Home, the circle page and the chat.
export function usePayRound() {
  const { payCircle, youPaid } = useWallet()
  const toast = useToast()
  const pay = async () => {
    try { await payCircle(25000); toast('₦25,000 paid to Office Ajo') } catch (e) { toast(e.message) }
  }
  return { pay, youPaid }
}
