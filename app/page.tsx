"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Trash2, Plus, Database, CheckCircle2, Circle, Clock, Server } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface Todo {
  id: number
  title: string
  completed: boolean
  created_at: string
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [loading, setLoading] = useState(false)
  const [dbStatus, setDbStatus] = useState<"connected" | "disconnected" | "checking">("checking")
  const { toast } = useToast()

  useEffect(() => {
    fetchTodos()
    checkDbConnection()
  }, [])

  const checkDbConnection = async () => {
    try {
      const response = await fetch("/api/health")
      const data = await response.json()
      setDbStatus(data.database === "connected" ? "connected" : "disconnected")
    } catch (error) {
      setDbStatus("disconnected")
    }
  }

  const fetchTodos = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/todos")
      if (response.ok) {
        const data = await response.json()
        setTodos(data)
      } else {
        toast({
          title: "エラー",
          description: "Todoの取得に失敗しました",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "エラー",
        description: "サーバーとの通信に失敗しました",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async () => {
    if (!newTodo.trim()) return

    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTodo }),
      })

      if (response.ok) {
        const todo = await response.json()
        setTodos([todo, ...todos])
        setNewTodo("")
        toast({
          title: "✅ 成功",
          description: "新しいTodoを追加しました",
        })
      } else {
        toast({
          title: "❌ エラー",
          description: "Todoの追加に失敗しました",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "❌ エラー",
        description: "サーバーとの通信に失敗しました",
        variant: "destructive",
      })
    }
  }

  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setTodos(todos.filter((todo) => todo.id !== id))
        toast({
          title: "🗑️ 削除完了",
          description: "Todoを削除しました",
        })
      } else {
        toast({
          title: "❌ エラー",
          description: "Todoの削除に失敗しました",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "❌ エラー",
        description: "サーバーとの通信に失敗しました",
        variant: "destructive",
      })
    }
  }

  const toggleTodo = async (id: number, completed: boolean) => {
    // Optimistic update
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed } : todo)))

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed }),
      })

      if (!response.ok) {
        // Revert on error
        setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !completed } : todo)))
        toast({
          title: "❌ エラー",
          description: "Todoの更新に失敗しました",
          variant: "destructive",
        })
      }
    } catch (error) {
      // Revert on error
      setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !completed } : todo)))
      toast({
        title: "❌ エラー",
        description: "Todoの更新に失敗しました",
        variant: "destructive",
      })
    }
  }

  const completedCount = todos.filter((todo) => todo.completed).length
  const totalCount = todos.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                ECS Todo App
              </h1>
              <p className="text-slate-600 mt-1">Next.js + PostgreSQL RDS + Docker</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant={
                  dbStatus === "connected" ? "default" : dbStatus === "disconnected" ? "destructive" : "secondary"
                }
                className="flex items-center gap-1.5 px-3 py-1"
              >
                {dbStatus === "connected" ? (
                  <Database className="w-3.5 h-3.5" />
                ) : dbStatus === "disconnected" ? (
                  <Server className="w-3.5 h-3.5" />
                ) : (
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                )}
                {dbStatus === "connected" ? "DB接続済み" : dbStatus === "disconnected" ? "DB未接続" : "確認中"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">総タスク数</p>
                  <p className="text-2xl font-bold text-blue-900">{totalCount}</p>
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
                  <p className="text-2xl font-bold text-green-900">{completedCount}</p>
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
                  <p className="text-2xl font-bold text-amber-900">{totalCount - completedCount}</p>
                </div>
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Todo Form */}
        <Card className="mb-8 shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Plus className="w-4 h-4 text-white" />
              </div>
              新しいタスクを追加
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="何をする必要がありますか？"
                onKeyPress={(e) => e.key === "Enter" && addTodo()}
                className="flex-1 h-12 text-base border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <Button
                onClick={addTodo}
                disabled={!newTodo.trim()}
                className="h-12 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                追加
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Todo List */}
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-slate-800">タスク一覧</CardTitle>
              {totalCount > 0 && (
                <Badge variant="outline" className="text-slate-600">
                  {completedCount}/{totalCount} 完了
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-600">読み込み中...</p>
              </div>
            ) : todos.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-600 text-lg font-medium mb-2">タスクがありません</p>
                <p className="text-slate-500">上記のフォームから新しいタスクを追加してください</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todos.map((todo, index) => (
                  <div
                    key={todo.id}
                    className={cn(
                      "group flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 hover:shadow-md",
                      todo.completed
                        ? "bg-green-50/50 border-green-200 hover:bg-green-50"
                        : "bg-white border-slate-200 hover:bg-slate-50",
                    )}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <button
                      onClick={() => toggleTodo(todo.id, !todo.completed)}
                      className={cn(
                        "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                        todo.completed
                          ? "bg-green-500 border-green-500 text-white"
                          : "border-slate-300 hover:border-blue-500 hover:bg-blue-50",
                      )}
                    >
                      {todo.completed && <CheckCircle2 className="w-4 h-4" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-base transition-all duration-200",
                          todo.completed ? "line-through text-slate-500" : "text-slate-800",
                        )}
                      >
                        {todo.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(todo.created_at).toLocaleDateString("ja-JP", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTodo(todo.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Separator className="mb-6" />
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <Server className="w-4 h-4" />
            <span>ECS ハンズオン用 Next.js アプリケーション</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">PostgreSQL RDS + Docker + shadcn/ui</p>
        </div>
      </div>
    </div>
  )
}
