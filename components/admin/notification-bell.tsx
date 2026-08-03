"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Bell, Check, CheckCheck, Loader2, AlertCircle, ShoppingCart, Package, Star, Mail, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/api/services/notifications"
import type { Notification, NotificationType } from "@/lib/api/types"
import Link from "next/link"
import { useRouter } from "next/navigation"

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case "order_created":
    case "order_updated":
    case "order_cancelled":
      return <ShoppingCart className="h-4 w-4" />
    case "low_stock":
      return <Package className="h-4 w-4" />
    case "new_review":
      return <Star className="h-4 w-4" />
    case "newsletter_signup":
      return <Mail className="h-4 w-4" />
    default:
      return <Bell className="h-4 w-4" />
  }
}

function getPriorityStyles(priority: string, is_read: boolean) {
  if (is_read) return "bg-muted/30 border-border/50"
  switch (priority) {
    case "high":
      return "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/40"
    case "medium":
      return "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40"
    default:
      return "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/40"
  }
}

function getPriorityIconColor(priority: string, is_read: boolean) {
  if (is_read) return "text-muted-foreground"
  switch (priority) {
    case "high":
      return "text-red-600 dark:text-red-400"
    case "medium":
      return "text-amber-600 dark:text-amber-400"
    default:
      return "text-blue-600 dark:text-blue-400"
  }
}

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

const POLL_INTERVAL = 30000 // Poll every 30 seconds

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isMarkingAll, setIsMarkingAll] = useState(false)
  const [markingId, setMarkingId] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const fetchNotifications = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true)
    try {
      const res = await getNotifications({ limit: 20 })
      setNotifications(res.data)
      setTotal(res.meta.total)
    } catch {
      // Silently fail for background polls
    } finally {
      if (!silent) setIsLoading(false)
    }
  }, [])

  // Initial load + polling
  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(() => fetchNotifications(true), POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const router = useRouter()

  async function handleNotificationClick(notification: Notification) {
    setIsOpen(false)

    // Navigate to related entity
    if (notification.related_entity && notification.related_id) {
      const entity = notification.related_entity.toLowerCase()
      if (entity === "order") router.push(`/admin/orders?q=${notification.related_id}`)
      else if (entity === "product") router.push(`/admin/products?q=${notification.related_id}`)
      else if (entity === "review") router.push(`/admin/reviews`)
    }

    // Mark as read in background if unread
    if (!notification.is_read) {
      setMarkingId(notification.id)
      markNotificationAsRead(notification.id)
        .then(() => {
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === notification.id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
            )
          )
        })
        .catch(() => toast.error("Failed to mark notification as read"))
        .finally(() => setMarkingId(null))
    }
  }

  async function handleMarkAllAsRead() {
    setIsMarkingAll(true)
    try {
      const res = await markAllNotificationsAsRead()
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
      )
      toast.success(res.message || "All notifications marked as read")
    } catch {
      toast.error("Failed to mark all as read")
    } finally {
      setIsMarkingAll(false)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        id="notification-bell-btn"
        aria-label="Open notifications"
        onClick={() => {
          setIsOpen((prev) => !prev)
          if (!isOpen) fetchNotifications()
        }}
        className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <Bell className="h-5 w-5 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-background animate-in zoom-in-50 duration-200">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-11 z-50 w-[380px] max-h-[520px] flex flex-col rounded-xl border bg-background shadow-2xl overflow-hidden animate-in slide-in-from-top-2 fade-in-0 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="h-5 text-[10px] px-1.5">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs gap-1"
                  onClick={handleMarkAllAsRead}
                  disabled={isMarkingAll}
                  id="mark-all-read-btn"
                >
                  {isMarkingAll ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <CheckCheck className="h-3 w-3" />
                  )}
                  Mark all read
                </Button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-muted transition-colors"
                aria-label="Close notifications"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="overflow-y-auto flex-1 divide-y divide-border/50">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2 text-center px-4">
                <Bell className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm font-medium text-muted-foreground">You're all caught up!</p>
                <p className="text-xs text-muted-foreground/70">No notifications yet.</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  id={`notification-item-${notification.id}`}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full text-left px-4 py-3 flex gap-3 items-start transition-colors hover:bg-muted/50 border-l-[3px] ${
                    notification.is_read
                      ? "border-l-transparent opacity-70"
                      : "border-l-primary"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border ${getPriorityStyles(notification.priority, notification.is_read)}`}
                  >
                    <span className={getPriorityIconColor(notification.priority, notification.is_read)}>
                      {getNotificationIcon(notification.notification_type)}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-medium leading-tight ${notification.is_read ? "text-muted-foreground" : "text-foreground"}`}>
                        {notification.title}
                      </p>
                      {markingId === notification.id ? (
                        <Loader2 className="h-3 w-3 animate-spin text-primary flex-shrink-0 mt-0.5" />
                      ) : !notification.is_read ? (
                        <span className="flex-shrink-0 w-2 h-2 mt-1 rounded-full bg-primary" />
                      ) : (
                        <Check className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">
                      {formatRelativeTime(notification.created_at)}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t px-4 py-2.5 bg-muted/20">
            <Link
              href="/admin/notifications"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center text-xs text-primary hover:text-primary/80 font-medium transition-colors gap-1"
              id="view-all-notifications-link"
            >
              View all {total > 0 ? `(${total})` : "notifications"}
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
