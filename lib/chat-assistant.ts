export type ChatAssistantListener = (open: boolean) => void

let isChatAssistantOpen = false
const listeners = new Set<ChatAssistantListener>()

function notify() {
  listeners.forEach(listener => listener(isChatAssistantOpen))
}

export function getChatAssistantState() {
  return isChatAssistantOpen
}

export function openChatAssistant() {
  if (!isChatAssistantOpen) {
    isChatAssistantOpen = true
    notify()
  }
}

export function closeChatAssistant() {
  if (isChatAssistantOpen) {
    isChatAssistantOpen = false
    notify()
  }
}

export function toggleChatAssistant() {
  isChatAssistantOpen = !isChatAssistantOpen
  notify()
}

export function subscribeToChatAssistant(listener: ChatAssistantListener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
