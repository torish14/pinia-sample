import { defineStore } from 'pinia'

type FilterType = 'all' | 'finished' | 'unfinished'
type TODO = {
  id: number
  label: string
  finished: boolean
}

// defineStore 関数を用いて、store を定義する
// 第一引数 'todo' は アプリ全体でストアを特定するためのキー
export const useTodoStore = defineStore('todos', {
  // 初期値を定義する
  state: () => {
    return {
      filter: 'all' as FilterType,
      todos: [] as TODO[],
      nextId: 0,
    }
  },

  // getters は state 及び getters へのアクセスを提供する
  // getter はすべて computed 扱いになるため､引数に応じて結果を差し替える場合は関数を戻す
  getters: {
    findTodo(state) {
      return (id: number): TODO => {
        const todo = state.todos.find((todo) => todo.id === id)
        if (todo === undefined) {
          throw new Error('todo not found')
        }
        return todo
      }
    },
    finishedTodos(state) {
      return state.todos.filter((todo) => todo.finished)
    },
    unfinishedTodos(state) {
      return state.todos.filter((todo) => !todo.finished)
    },
    filteredTodos(state): TODO[] {
      switch (state.filter) {
        case 'finished':
          return this.finishedTodos
        case 'unfinished':
          return this.unfinishedTodos
        default:
          return this.todos
      }
    },
  },

  // mutations が存在しないため､State の更新はすべて action で行う
  actions: {
    addTodo(label: string) {
      this.todos.push({
        id: this.nextId++,
        label,
        finished: false,
      })
    },
    toggleTodo(id: number) {
      const todo = this.findTodo(id)
      todo.finished = !todo.finished
    },
  },
})
