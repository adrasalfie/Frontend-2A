import { useEffect } from 'react'
import Icon from '../atoms/Icon.jsx'

const DURATION_MS = 3000

/** Notifikasi singkat di bawah layar; hilang otomatis. `toast` = { message, type: 'success' | 'danger' }. */
export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(onClose, DURATION_MS)
    return () => clearTimeout(timer)
  }, [toast, onClose])

  if (!toast) return null

  const isDanger = toast.type === 'danger'
  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex justify-center">
      <div
        role="status"
        className="pointer-events-auto flex items-center gap-2.5 rounded-lg bg-ink px-4 py-3 text-sm text-white shadow-lg"
      >
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full ${
            isDanger ? 'bg-danger' : 'bg-primary'
          }`}
        >
          <Icon name={isDanger ? 'trash' : 'check'} size={12} />
        </span>
        {toast.message}
      </div>
    </div>
  )
}
