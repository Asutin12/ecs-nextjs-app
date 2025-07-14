import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Circle, Clock } from "lucide-react"

interface TodoStatsProps {
  total: number
  completed: number
}

export function TodoStats({ total, completed }: TodoStatsProps) {
  const pending = total - completed
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">総タスク数</p>
              <p className="text-2xl font-bold text-blue-900">{total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <Circle className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">完了済み</p>
              <p className="text-2xl font-bold text-green-900">{completed}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 text-sm font-medium">進行中</p>
              <p className="text-2xl font-bold text-amber-900">{pending}</p>
            </div>
            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">完了率</p>
              <p className="text-2xl font-bold text-purple-900">{completionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
              <div className="text-white text-xs font-bold">{completionRate}%</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
