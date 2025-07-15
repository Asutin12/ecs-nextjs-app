"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Trash2,
  Plus,
  Database,
  CheckCircle2,
  Circle,
  Clock,
  Server,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState<
    "connected" | "disconnected" | "checking"
  >("checking");
  const { toast } = useToast();

  useEffect(() => {
    fetchTodos();
    checkDbConnection();
  }, []);

  const checkDbConnection = async () => {
    try {
      const response = await fetch("/api/health");
      const data = await response.json();
      setDbStatus(data.database === "connected" ? "connected" : "disconnected");
    } catch (error) {
      setDbStatus("disconnected");
    }
  };

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/todos");
      if (response.ok) {
        const data = await response.json();
        setTodos(data);
      } else {
        toast({
          title: "エラー",
          description: "Todoの取得に失敗しました",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "エラー",
        description: "サーバーとの通信に失敗しました",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;

    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTodo }),
      });

      if (response.ok) {
        const todo = await response.json();
        setTodos([todo, ...todos]);
        setNewTodo("");
        toast({
          title: "✅ 成功",
          description: "新しいTodoを追加しました",
        });
      } else {
        toast({
          title: "❌ エラー",
          description: "Todoの追加に失敗しました",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "❌ エラー",
        description: "サーバーとの通信に失敗しました",
        variant: "destructive",
      });
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTodos(todos.filter((todo) => todo.id !== id));
        toast({
          title: "🗑️ 削除完了",
          description: "Todoを削除しました",
        });
      } else {
        toast({
          title: "❌ エラー",
          description: "Todoの削除に失敗しました",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "❌ エラー",
        description: "サーバーとの通信に失敗しました",
        variant: "destructive",
      });
    }
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    // Optimistic update
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, completed } : todo))
    );

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) {
        // Revert on error
        setTodos(
          todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !completed } : todo
          )
        );
        toast({
          title: "❌ エラー",
          description: "Todoの更新に失敗しました",
          variant: "destructive",
        });
      }
    } catch (error) {
      // Revert on error
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !completed } : todo
        )
      );
      toast({
        title: "❌ エラー",
        description: "Todoの更新に失敗しました",
        variant: "destructive",
      });
    }
  };

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center shadow-lg">
                <Server className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent">
                Todo App
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
                <span>Production Ready</span>
              </div>
              <Badge
                variant={
                  dbStatus === "connected"
                    ? "default"
                    : dbStatus === "disconnected"
                    ? "destructive"
                    : "secondary"
                }
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 font-medium",
                  dbStatus === "connected" &&
                    "bg-gray-900 text-white hover:bg-gray-800"
                )}
              >
                {dbStatus === "connected" ? (
                  <Database className="w-3.5 h-3.5" />
                ) : dbStatus === "disconnected" ? (
                  <Server className="w-3.5 h-3.5" />
                ) : (
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                )}
                {dbStatus === "connected"
                  ? "DB接続済み"
                  : dbStatus === "disconnected"
                  ? "DB未接続"
                  : "確認中"}
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
                  <p className="text-blue-600 text-sm font-medium">
                    総タスク数
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    {totalCount}
                  </p>
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
                  <p className="text-2xl font-bold text-green-900">
                    {completedCount}
                  </p>
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
                  <p className="text-2xl font-bold text-amber-900">
                    {totalCount - completedCount}
                  </p>
                </div>
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Todo Form */}
        <Card className="mb-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-gray-900">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center shadow-lg">
                <Plus className="w-5 h-5 text-white" />
              </div>
              新しいタスクを追加
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Taskを入力してください。"
                className="flex-1 h-12 text-base border-gray-200 bg-white"
              />
              <Button
                onClick={addTodo}
                disabled={!newTodo.trim()}
                className="h-12 px-8 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                追加
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Todo List */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-900 text-xl">
                タスク一覧
              </CardTitle>
              {totalCount > 0 && (
                <Badge
                  variant="outline"
                  className="text-gray-600 border-gray-300"
                >
                  {completedCount}/{totalCount} 完了
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">読み込み中...</p>
              </div>
            ) : todos.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-700 text-lg font-medium mb-2">
                  タスクがありません
                </p>
                <p className="text-gray-500">
                  上記のフォームから新しいタスクを追加してください
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {todos.map((todo, index) => (
                  <div
                    key={todo.id}
                    className={cn(
                      "group flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 hover:shadow-md",
                      todo.completed
                        ? "bg-gray-50 border-gray-200 hover:bg-gray-100"
                        : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
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
                          ? "bg-gray-900 border-gray-900 text-white"
                          : "border-gray-300 hover:border-gray-900 hover:bg-gray-50"
                      )}
                    >
                      {todo.completed && <CheckCircle2 className="w-4 h-4" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-base transition-all duration-200",
                          todo.completed
                            ? "line-through text-gray-500"
                            : "text-gray-900"
                        )}
                      >
                        {todo.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
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
                      className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
