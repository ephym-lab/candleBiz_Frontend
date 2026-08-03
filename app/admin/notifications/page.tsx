"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Bell,
  Check,
  CheckCheck,
  Loader2,
  AlertCircle,
  ShoppingCart,
  Package,
  Star,
  Mail,
  Filter,
  RefreshCw,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/api/services/notifications"
import type { Notification, NotificationType } from "@/lib/api/types"
import Link from "next/link"

/* ─── Helpers ──────────────────────────────────────────────────────────── */

function getRelatedUrl(entity?: string | null, id?: string | null) {
  if (!entity || !id) return "#"
  switch (entity.toLowerCase()) {
    case "order": return `/admin/orders?q=${id}`
    case "product": return `/admin/products?q=${id}`
    case "review": return `/admin/reviews`
    default: return "#"
  }
}

function getNotificationIcon(type: NotificationType, size = "h-5 w-5") {
  switch (type) {
    case "order_created":
    case "order_updated":
    case "order_cancelled":
      return <ShoppingCart className={size} />
    case "low_stock":
      return <Package className={size} />
    case "new_review":
      return <Star className={size} />
    case "newsletter_signup":
      return <Mail className={size} />
    default:
      return <Bell className={size} />
  }
}

function getPriorityBadge(priority: string) {
  switch (priority) {
    case "high":
      return <Badge variant="destructive" className="text-[10px] h-4 px-1.5">High</Badge>
    case "medium":
      return <Badge className="text-[10px] h-4 px-1.5 bg-amber-500 hover:bg-amber-500/80">Medium</Badge>
    default:
      return <Badge variant="secondary" className="text-[10px] h-4 px-1.5">Low</Badge>
  }
}

function getTypeLabel(type: NotificationType) {
  const labels: Record<string, string> = {
    order_created: "New Order",
    order_updated: "Order Updated",
    order_cancelled: "Order Cancelled",
    low_stock: "Low Stock",
    new_review: "New Review",
    newsletter_signup: "Newsletter",
  }
  return labels[type] ?? type.replace(/_/g, " ")
}

function getIconBg(priority: string, is_read: boolean) {
  if (is_read) return "bg-muted text-muted-foreground"
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400"
    case "medium":
      return "bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
    default:
      return "bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
  }
}

function formatTime(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleString("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  })
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

type FilterType = "all" | "unread" | "read"
const LIMIT = 50

/* ─── Page ─────────────────────────────────────────────────────────────── */

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<FilterType>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isMarkingAll, setIsMarkingAll] = useState(false)
  const [markingId, setMarkingId] = useState<string | null>(null)
  const [meta, setMeta] = useState({ total: 0, skip: 0, limit: LIMIT })

  const fetchNotifications = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true)
    else setIsRefreshing(true)
    try {
      const isRead = filter === "all" ? undefined : filter === "read"
      const res = await getNotifications({ limit: LIMIT, is_read: isRead ?? null })
      setNotifications(res.data)
      setMeta(res.meta)
    } catch {
      toast.error("Failed to load notifications")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [filter])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  async function handleMarkAsRead(notification: Notification) {
    if (notification.is_read) return
    setMarkingId(notification.id)
    try {
      await markNotificationAsRead(notification.id)
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
        )
      )
    } catch {
      toast.error("Failed to mark notification as read")
    } finally {
      setMarkingId(null)
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

  const unreadCount = notifications.filter((n) => !n.is_read).length
  const displayedNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.is_read)
      : filter === "read"
      ? notifications.filter((n) => n.is_read)
      : notifications

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold flex items-center gap-3">
            <Bell className="h-8 w-8 text-primary" />
            Notifications
          </h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
              : "All caught up! No unread notifications."}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchNotifications(true)}
            disabled={isRefreshing}
            id="refresh-notifications-btn"
            className="gap-1.5"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          {unreadCount > 0 && (
            <Button
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAll}
              id="mark-all-read-page-btn"
              className="gap-1.5"
            >
              {isMarkingAll ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCheck className="h-4 w-4" />
              )}
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center">
          <CardContent className="pt-5 pb-4">
            <p className="text-3xl font-bold">{meta.total}</p>
            <p className="text-xs text-muted-foreground mt-1">Total</p>
          </CardContent>
        </Card>
        <Card className="text-center border-primary/30">
          <CardContent className="pt-5 pb-4">
            <p className="text-3xl font-bold text-primary">{unreadCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Unread</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-5 pb-4">
            <p className="text-3xl font-bold text-muted-foreground">{meta.total - unreadCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Read</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-muted rounded-lg w-fit" id="notification-filter-tabs">
        {(["all", "unread", "read"] as FilterType[]).map((f) => (
          <button
            key={f}
            id={`filter-${f}-btn`}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${
              filter === f
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
            {f === "unread" && unreadCount > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            {filter === "all" ? "All Notifications" : filter === "unread" ? "Unread Notifications" : "Read Notifications"}
            <Badge variant="secondary" className="ml-auto font-normal">
              {displayedNotifications.length} shown
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : displayedNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-6">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Bell className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <p className="text-base font-medium">
                {filter === "unread" ? "No unread notifications" : filter === "read" ? "No read notifications" : "No notifications yet"}
              </p>
              <p className="text-sm text-muted-foreground max-w-xs">
                {filter === "unread"
                  ? "You've read all your notifications."
                  : "Notifications will appear here when there's activity in your store."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {displayedNotifications.map((notification) => (
                <div
                  key={notification.id}
                  id={`notification-page-item-${notification.id}`}
                  className={`flex gap-4 p-4 transition-colors group ${
                    notification.is_read
                      ? "bg-background hover:bg-muted/30"
                      : "bg-primary/[0.03] hover:bg-primary/[0.06] border-l-[3px] border-l-primary"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center ${getIconBg(
                      notification.priority,
                      notification.is_read
                    )}`}
                  >
                    {getNotificationIcon(notification.notification_type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start gap-2 mb-0.5">
                      <span className={`font-semibold text-sm ${notification.is_read ? "text-muted-foreground" : "text-foreground"}`}>
                        {notification.title}
                      </span>
                      {getPriorityBadge(notification.priority)}
                      <Badge variant="outline" className="text-[10px] h-4 px-1.5 font-normal">
                        {getTypeLabel(notification.notification_type)}
                      </Badge>
                    </div>

                    <p className={`text-sm leading-relaxed ${notification.is_read ? "text-muted-foreground/70" : "text-muted-foreground"}`}>
                      {notification.message}
                    </p>

                    {/* Related entity info */}
                    {notification.related_id && (
                      <div className="flex items-center gap-1 mt-1.5">
                        <Info className="h-3 w-3 text-muted-foreground/50" />
                        <Link 
                          href={getRelatedUrl(notification.related_entity, notification.related_id)}
                          onClick={() => handleMarkAsRead(notification)}
                          className="text-[11px] font-medium text-muted-foreground/60 hover:text-primary hover:underline transition-colors"
                        >
                          Ref: {notification.related_id}
                        </Link>
                      </div>
                    )}

                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[11px] text-muted-foreground/50" title={formatTime(notification.created_at)}>
                        {formatRelativeTime(notification.created_at)} · {formatTime(notification.created_at)}
                      </span>
                      {notification.is_read && notification.read_at && (
                        <span className="text-[11px] text-green-600/70 flex items-center gap-1">
                          <Check className="h-3 w-3" />
                          Read {formatRelativeTime(notification.read_at)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex-shrink-0 flex items-start pt-0.5">
                    {!notification.is_read ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleMarkAsRead(notification)}
                        disabled={markingId === notification.id}
                        id={`mark-read-btn-${notification.id}`}
                      >
                        {markingId === notification.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Check className="h-3 w-3" />
                        )}
                        Mark read
                      </Button>
                    ) : (
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
