// 'use client'

// import { useEffect, useRef } from 'react'
// import { Line } from 'react-chartjs-2'
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   ChartOptions
// } from 'chart.js'

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// )

// interface Bid {
//   bidder: string
//   amount: number
//   date: string
// }

// interface BidGraphProps {
//   bidHistory: Bid[]
// }

// export default function BidGraph({ bidHistory }: BidGraphProps) {
//   const chartRef = useRef<ChartJS>(null)

//   const sortedBids = [...bidHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

//   const data = {
//     labels: sortedBids.map(bid => new Date(bid.date).toLocaleDateString()),
//     datasets: [
//       {
//         label: 'Bid Amount',
//         data: sortedBids.map(bid => bid.amount),
//         borderColor: 'rgb(75, 192, 192)',
//         tension: 0.1
//       }
//     ]
//   }

//   const options: ChartOptions<'line'> = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'top' as const,
//       },
//       title: {
//         display: true,
//         text: 'Bid History Graph'
//       }
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         title: {
//           display: true,
//           text: 'Bid Amount ($)'
//         }
//       },
//       x: {
//         title: {
//           display: true,
//           text: 'Date'
//         }
//       }
//     }
//   }

//   useEffect(() => {
//     const chart = chartRef.current

//     if (chart) {
//       chart.update()
//     }
//   }, [bidHistory])

//   return <Line ref={chartRef} options={options} data={data} />
// }

