import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  trend: 'up' | 'down'
}

export function MetricCard({ title, value, description, icon, trend }: MetricCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            {trend === 'up' ? (
              <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownIcon className="mr-1 h-4 w-4 text-red-500" />
            )}
            {description}
          </p>
        </CardContent>
        <div 
          className={`h-1 w-full ${trend === 'up' ? 'bg-green-500' : 'bg-red-500'}`}
        />
      </Card>
    </motion.div>
  )
}

