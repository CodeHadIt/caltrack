'use client'

import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ShareCard } from './share-card'
import { DailySummary } from '@/types'
import {
  Download,
  Share2,
  Loader2,
  Twitter,
  Facebook,
  MessageCircle,
  Copy,
  Check,
} from 'lucide-react'
import { toast } from 'sonner'

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  summary: DailySummary
  calorieGoal?: number
  userName?: string
}

export function ShareDialog({
  open,
  onOpenChange,
  summary,
  calorieGoal = 2000,
  userName
}: ShareDialogProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const generateImage = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null

    setIsGenerating(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false,
        useCORS: true,
      })

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob)
        }, 'image/png', 1.0)
      })
    } catch (error) {
      console.error('Failed to generate image:', error)
      toast.error('Failed to generate image')
      return null
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async () => {
    const blob = await generateImage()
    if (!blob) return

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `caltrack-${summary.date}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success('Image downloaded!')
  }

  const handleNativeShare = async () => {
    const blob = await generateImage()
    if (!blob) return

    const file = new File([blob], `caltrack-${summary.date}.png`, { type: 'image/png' })

    if (navigator.share && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: 'My CalTrack Daily Summary',
          text: `I consumed ${summary.totalCalories} calories today! Track your nutrition with CalTrack.`,
          files: [file],
        })
        toast.success('Shared successfully!')
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast.error('Failed to share')
        }
      }
    } else {
      // Fallback: download the image
      handleDownload()
    }
  }

  const shareText = `I consumed ${summary.totalCalories} calories today! 💪\n\nProtein: ${summary.totalProtein}g | Carbs: ${summary.totalCarbs}g | Fat: ${summary.totalFat}g\n\nTrack your nutrition with CalTrack!`

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
    window.open(url, '_blank', 'width=550,height=420')
  }

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(shareText)}`
    window.open(url, '_blank', 'width=550,height=420')
  }

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`
    window.open(url, '_blank')
  }

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[480px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-emerald-600" />
            Share Your Progress
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Preview Card */}
          <div className="flex justify-center bg-slate-100 dark:bg-slate-800 rounded-2xl p-4 overflow-hidden">
            <div className="transform scale-[0.85] origin-top">
              <ShareCard
                ref={cardRef}
                summary={summary}
                calorieGoal={calorieGoal}
                userName={userName}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Primary actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleDownload}
                disabled={isGenerating}
                className="h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
              >
                {isGenerating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Download
              </Button>
              <Button
                onClick={handleNativeShare}
                disabled={isGenerating}
                variant="outline"
                className="h-12"
              >
                {isGenerating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Share2 className="mr-2 h-4 w-4" />
                )}
                Share
              </Button>
            </div>

            {/* Social media buttons */}
            <div className="grid grid-cols-4 gap-2">
              <Button
                onClick={handleTwitterShare}
                variant="outline"
                size="icon"
                className="h-12 w-full hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] hover:border-[#1DA1F2]"
                title="Share on X (Twitter)"
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button
                onClick={handleFacebookShare}
                variant="outline"
                size="icon"
                className="h-12 w-full hover:bg-[#1877F2]/10 hover:text-[#1877F2] hover:border-[#1877F2]"
                title="Share on Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Button>
              <Button
                onClick={handleWhatsAppShare}
                variant="outline"
                size="icon"
                className="h-12 w-full hover:bg-[#25D366]/10 hover:text-[#25D366] hover:border-[#25D366]"
                title="Share on WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
              <Button
                onClick={handleCopyText}
                variant="outline"
                size="icon"
                className="h-12 w-full"
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check className="h-5 w-5 text-emerald-500" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
