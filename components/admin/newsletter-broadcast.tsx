"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Mail,
    Loader2,
    CheckCircle,
    AlertCircle,
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    Link as LinkIcon,
    Heading1,
    Heading2,
    Heading3,
    RemoveFormatting
} from "lucide-react"
import { toast } from "sonner"
import { broadcastNewsletter } from "@/lib/api/services/newsletter"
import { getAuthToken } from "@/lib/api/services/auth"

interface BroadcastResponse {
    success: boolean
    message: string
    emails_sent: number
    failed_emails: string[]
}

export function NewsletterBroadcast() {
    const [subject, setSubject] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<BroadcastResponse | null>(null)
    const editorRef = useRef<HTMLDivElement>(null)

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!editorRef.current?.contains(e.target as Node)) return

            if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                    case 'b':
                        e.preventDefault()
                        executeCommand('bold')
                        break
                    case 'i':
                        e.preventDefault()
                        executeCommand('italic')
                        break
                    case 'u':
                        e.preventDefault()
                        executeCommand('underline')
                        break
                }
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [])

    const executeCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value)
        editorRef.current?.focus()
    }

    const insertLink = () => {
        const url = prompt('Enter URL:')
        if (url) {
            executeCommand('createLink', url)
        }
    }

    const getEditorHTML = (): string => {
        return editorRef.current?.innerHTML || ''
    }

    const clearEditor = () => {
        if (editorRef.current) {
            editorRef.current.innerHTML = ''
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const htmlBody = getEditorHTML()

        if (!subject.trim() || !htmlBody.trim() || htmlBody === '<br>') {
            toast.error("Please fill in both subject and message")
            return
        }

        setIsLoading(true)
        setResult(null)

        try {
            // Get admin token from auth service
            const token = getAuthToken()
            if (!token) {
                toast.error("Authentication required. Please log in again.")
                return
            }

            const response = await broadcastNewsletter(subject, htmlBody, token)

            if (response.data) {
                setResult(response.data)

                if (response.data.success) {
                    toast.success(response.data.message)
                    // Clear form on success
                    setSubject("")
                    clearEditor()
                } else {
                    toast.error(response.data.message)
                }
            }
        } catch (error: any) {
            console.error("Newsletter broadcast error:", error)
            toast.error(error.response?.data?.detail || "Failed to send newsletter")
        } finally {
            setIsLoading(false)
        }
    }

    const toolbarButtons = [
        { icon: Bold, command: 'bold', title: 'Bold (Ctrl+B)' },
        { icon: Italic, command: 'italic', title: 'Italic (Ctrl+I)' },
        { icon: Underline, command: 'underline', title: 'Underline (Ctrl+U)' },
        { icon: Heading1, command: 'formatBlock', value: 'h1', title: 'Heading 1' },
        { icon: Heading2, command: 'formatBlock', value: 'h2', title: 'Heading 2' },
        { icon: Heading3, command: 'formatBlock', value: 'h3', title: 'Heading 3' },
        { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
        { icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
        { icon: LinkIcon, command: 'link', title: 'Insert Link' },
        { icon: RemoveFormatting, command: 'removeFormat', title: 'Clear Formatting' },
    ]

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    <CardTitle>Send Newsletter</CardTitle>
                </div>
                <CardDescription>
                    Broadcast an email newsletter to all subscribers
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                            id="subject"
                            type="text"
                            placeholder="e.g., New Candle Collection Launch!"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Message</Label>

                        {/* Formatting Toolbar */}
                        <div className="flex flex-wrap gap-1 p-2 border rounded-t-lg bg-muted/50">
                            {toolbarButtons.map((btn, index) => (
                                <Button
                                    key={index}
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => {
                                        if (btn.command === 'link') {
                                            insertLink()
                                        } else {
                                            executeCommand(btn.command, btn.value)
                                        }
                                    }}
                                    disabled={isLoading}
                                    title={btn.title}
                                >
                                    <btn.icon className="h-4 w-4" />
                                </Button>
                            ))}
                        </div>

                        {/* Rich Text Editor */}
                        <div
                            ref={editorRef}
                            contentEditable
                            className="min-h-[200px] p-3 border border-t-0 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 prose prose-sm max-w-none dark:prose-invert"
                            style={{
                                wordWrap: 'break-word',
                                overflowWrap: 'break-word',
                            }}
                            suppressContentEditableWarning
                            onPaste={(e) => {
                                // Prevent pasting formatted content, paste as plain text
                                e.preventDefault()
                                const text = e.clipboardData.getData('text/plain')
                                document.execCommand('insertText', false, text)
                            }}
                        />
                        <p className="text-xs text-muted-foreground">
                            Use the toolbar above to format your newsletter content
                        </p>
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Mail className="mr-2 h-4 w-4" />
                                Send Newsletter
                            </>
                        )}
                    </Button>
                </form>

                {/* Result Display */}
                {result && (
                    <div className={`mt-4 p-4 rounded-lg border ${result.success
                        ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                        : "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
                        }`}>
                        <div className="flex items-start gap-3">
                            {result.success ? (
                                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                            ) : (
                                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                            )}
                            <div className="flex-1">
                                <p className={`font-medium ${result.success
                                    ? "text-green-900 dark:text-green-100"
                                    : "text-red-900 dark:text-red-100"
                                    }`}>
                                    {result.message}
                                </p>
                                <div className="mt-2 space-y-1 text-sm">
                                    <p className={result.success ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}>
                                        Emails sent: <span className="font-semibold">{result.emails_sent}</span>
                                    </p>
                                    {result.failed_emails && result.failed_emails.length > 0 && (
                                        <div className="mt-2">
                                            <p className="text-red-700 dark:text-red-300 font-medium">
                                                Failed emails ({result.failed_emails.length}):
                                            </p>
                                            <ul className="mt-1 list-disc list-inside text-red-600 dark:text-red-400">
                                                {result.failed_emails.slice(0, 5).map((email, index) => (
                                                    <li key={index} className="text-xs">{email}</li>
                                                ))}
                                                {result.failed_emails.length > 5 && (
                                                    <li className="text-xs">...and {result.failed_emails.length - 5} more</li>
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
