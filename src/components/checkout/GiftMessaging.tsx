'use client'

import { useState } from 'react'

export interface GiftData {
  isGift: boolean
  recipientName: string
  message: string
  giftWrap: boolean
}

interface GiftMessagingProps {
  onChange: (data: GiftData) => void
}

export function GiftMessaging({ onChange }: GiftMessagingProps) {
  const [isGift, setIsGift] = useState(false)
  const [recipientName, setRecipientName] = useState('')
  const [message, setMessage] = useState('')
  const [giftWrap, setGiftWrap] = useState(false)

  function update(patch: Partial<GiftData>) {
    const next: GiftData = {
      isGift,
      recipientName,
      message,
      giftWrap,
      ...patch,
    }
    onChange(next)
  }

  return (
    <div className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-6 mb-6">
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={isGift}
          onChange={(e) => {
            setIsGift(e.target.checked)
            update({ isGift: e.target.checked })
          }}
          className="w-4 h-4 accent-secondary rounded"
        />
        <span className="font-sans text-sm text-on-surface">
          This is a gift 🎁
        </span>
      </label>

      {isGift && (
        <div className="mt-5 space-y-4">
          <div>
            <label className="block font-sans text-xs text-on-surface-variant uppercase tracking-wider mb-1.5">
              Recipient name
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => {
                setRecipientName(e.target.value)
                update({ recipientName: e.target.value })
              }}
              placeholder="e.g. Sophie"
              className="w-full rounded-lg border border-outline-variant/30 bg-surface px-4 py-2.5 font-sans text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-secondary/60"
            />
          </div>

          <div>
            <label className="block font-sans text-xs text-on-surface-variant uppercase tracking-wider mb-1.5">
              Message to recipient
            </label>
            <textarea
              value={message}
              onChange={(e) => {
                const val = e.target.value.slice(0, 200)
                setMessage(val)
                update({ message: val })
              }}
              rows={3}
              maxLength={200}
              placeholder="A personal note that will be included with the gift..."
              className="w-full rounded-lg border border-outline-variant/30 bg-surface px-4 py-2.5 font-sans text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-secondary/60 resize-none"
            />
            <p className="font-sans text-[11px] text-on-surface-variant/60 text-right mt-1">
              {message.length}/200
            </p>
          </div>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={giftWrap}
              onChange={(e) => {
                setGiftWrap(e.target.checked)
                update({ giftWrap: e.target.checked })
              }}
              className="w-4 h-4 accent-secondary rounded"
            />
            <span className="font-sans text-sm text-on-surface">
              Include gift wrapping{' '}
              <span className="text-on-surface-variant">(+€3.50)</span>
            </span>
          </label>
        </div>
      )}
    </div>
  )
}
