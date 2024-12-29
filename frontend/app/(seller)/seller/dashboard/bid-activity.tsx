'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  { name: "Mon", bids: 12 },
  { name: "Tue", bids: 18 },
  { name: "Wed", bids: 15 },
  { name: "Thu", bids: 25 },
  { name: "Fri", bids: 30 },
  { name: "Sat", bids: 22 },
  { name: "Sun", bids: 20 },
]

export function BidActivity() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
          }}
        />
        <Bar dataKey="bids" fill="#8884d8" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

