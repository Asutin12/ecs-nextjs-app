"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Todo {
  id: number
  title: string
  completed: boolean
  created_at: string
}

interface TodoItemProps {
  todo: Todo
  onToggle: (id: number, completed: boolean) => void
  onDelete: (id: number) => void
  index: number
}

export function TodoItem({ todo, onToggle, onDelete, index }: TodoItemProps) {
  return (
    <div
      className={cn(
        "group flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 hover:shadow-md animate-in slide-in-from-top-2",
        todo.completed
          ? "bg-green-50/50 border-green-200 hover:bg-green-50"
          : "bg-white border-slate-200 hover:bg-slate-50",
      )}
      style={{
        animationDelay: `${index * 50}ms`,
      }}
    >
      <button
        onClick={() => onToggle(todo.id, !todo.completed)}
        className={cn(
          "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110",
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
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-200 hover:scale-105"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  )
}
