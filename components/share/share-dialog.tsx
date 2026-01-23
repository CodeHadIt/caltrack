'use client'

import { useRef, useState, useCallback } from 'react'
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
  Instagram,
  ImageIcon,
} from 'lucide-react'
import { toast } from 'sonner'

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  summary: DailySummary
  calorieGoal?: number
  userName?: string
}

// TikTok icon component (not in lucide)
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  )
}

export function ShareDialog({
  open,
  onOpenChange,
  summary,
  calorieGoal = 2000,
  userName
}: ShareDialogProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const hiddenCardRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [imageCopied, setImageCopied] = useState(false)

  const generateImage = useCallback(async (): Promise<Blob | null> => {
    // Use the hidden full-size card for better quality
    const targetRef = hiddenCardRef.current || cardRef.current
    if (!targetRef) {
      toast.error('Unable to generate image')
      return null
    }

    setIsGenerating(true)
    try {
      const canvas = await html2canvas(targetRef, {
        scale: 2,
        backgroundColor: '#059669',
        logging: false,
        useCORS: true,
        allowTaint: true,
      })

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          setIsGenerating(false)
          if (blob) {
            resolve(blob)
          } else {
            toast.error('Failed to create image')
            resolve(null)
          }
        }, 'image/png', 1.0)
      })
    } catch (error) {
      console.error('Failed to generate image:', error)
      toast.error('Failed to generate image')
      setIsGenerating(false)
      return null
    }
  }, [])

  const handleDownload = async () => {
    const blob = await generateImage()
    if (!blob) return

    try {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `caltrack-${summary.date}.png`
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()

      // Cleanup after a short delay
      setTimeout(() => {
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }, 100)

      toast.success('Image downloaded!')
    } catch (error) {
      console.error('Download failed:', error)
      toast.error('Download failed')
    }
  }

  const handleCopyImage = async () => {
    const blob = await generateImage()
    if (!blob) return

    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob
        })
      ])
      setImageCopied(true)
      toast.success('Image copied to clipboard!')
      setTimeout(() => setImageCopied(false), 2000)
    } catch (error) {
      console.error('Copy image failed:', error)
      // Fallback: download instead
      toast.error('Could not copy image. Downloading instead...')
      handleDownload()
    }
  }

  const handleNativeShare = async () => {
    const blob = await generateImage()
    if (!blob) return

    const file = new File([blob], `caltrack-${summary.date}.png`, { type: 'image/png' })

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: 'My CalTrack Daily Summary',
          text: `I consumed ${summary.totalCalories} calories today! Track your nutrition with CalTrack.`,
          files: [file],
        })
        toast.success('Shared successfully!')
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Share failed:', error)
          toast.error('Share failed. Try downloading instead.')
        }
      }
    } else {
      // Fallback: download the image
      toast.info('Native share not supported. Downloading image...')
      handleDownload()
    }
  }

  const shareText = `I consumed ${summary.totalCalories} calories today! 💪\n\nProtein: ${summary.totalProtein}g | Carbs: ${summary.totalCarbs}g | Fat: ${summary.totalFat}g\n\nTrack your nutrition with CalTrack!`

  const handleTwitterShare = async () => {
    // Download image first for user to attach
    await handleDownload()
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
    window.open(url, '_blank', 'width=550,height=420')
    toast.info('Attach the downloaded image to your tweet!')
  }

  const handleFacebookShare = async () => {
    await handleDownload()
    const url = `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(shareText)}`
    window.open(url, '_blank', 'width=550,height=420')
    toast.info('Upload the downloaded image to your post!')
  }

  const handleWhatsAppShare = async () => {
    // Try native share first for better WhatsApp experience
    const blob = await generateImage()
    if (blob) {
      const file = new File([blob], `caltrack-${summary.date}.png`, { type: 'image/png' })
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], text: shareText })
          return
        } catch (e) {
          if ((e as Error).name === 'AbortError') return
        }
      }
    }
    // Fallback to text-only
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`
    window.open(url, '_blank')
  }

  const handleInstagramShare = async () => {
    await handleDownload()
    toast.success('Image downloaded! Open Instagram and create a new post with the image.', {
      duration: 5000,
    })
  }

  const handleTikTokShare = async () => {
    await handleDownload()
    toast.success('Image downloaded! Open TikTok and create a new post with the image.', {
      duration: 5000,
    })
  }

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      toast.success('Text copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy text')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[480px] p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-emerald-600" />
            Share Your Progress
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Hidden full-size card for capture */}
          <div className="absolute -left-[9999px] -top-[9999px]">
            <ShareCard
              ref={hiddenCardRef}
              summary={summary}
              calorieGoal={calorieGoal}
              userName={userName}
            />
          </div>

          {/* Preview Card (scaled for display) */}
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
                onClick={handleCopyImage}
                disabled={isGenerating}
                variant="outline"
                className="h-12"
              >
                {isGenerating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : imageCopied ? (
                  <Check className="mr-2 h-4 w-4 text-emerald-500" />
                ) : (
                  <ImageIcon className="mr-2 h-4 w-4" />
                )}
                Copy Image
              </Button>
            </div>

            {/* Native share button */}
            <Button
              onClick={handleNativeShare}
              disabled={isGenerating}
              variant="outline"
              className="w-full h-12"
            >
              {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Share2 className="mr-2 h-4 w-4" />
              )}
              Share to Any App
            </Button>

            {/* Social media buttons */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={handleInstagramShare}
                disabled={isGenerating}
                variant="outline"
                className="h-12 w-full hover:bg-gradient-to-r hover:from-[#833AB4]/10 hover:via-[#FD1D1D]/10 hover:to-[#F77737]/10 hover:text-[#E1306C] hover:border-[#E1306C]"
                title="Share on Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Button>
              <Button
                onClick={handleTikTokShare}
                disabled={isGenerating}
                variant="outline"
                className="h-12 w-full hover:bg-black/5 hover:text-black hover:border-black dark:hover:bg-white/10 dark:hover:text-white"
                title="Share on TikTok"
              >
                <TikTokIcon className="h-5 w-5" />
              </Button>
              <Button
                onClick={handleTwitterShare}
                disabled={isGenerating}
                variant="outline"
                className="h-12 w-full hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] hover:border-[#1DA1F2]"
                title="Share on X (Twitter)"
              >
                <Twitter className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={handleFacebookShare}
                disabled={isGenerating}
                variant="outline"
                className="h-12 w-full hover:bg-[#1877F2]/10 hover:text-[#1877F2] hover:border-[#1877F2]"
                title="Share on Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Button>
              <Button
                onClick={handleWhatsAppShare}
                disabled={isGenerating}
                variant="outline"
                className="h-12 w-full hover:bg-[#25D366]/10 hover:text-[#25D366] hover:border-[#25D366]"
                title="Share on WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
              <Button
                onClick={handleCopyText}
                variant="outline"
                className="h-12 w-full"
                title="Copy text to clipboard"
              >
                {copied ? (
                  <Check className="h-5 w-5 text-emerald-500" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              For Instagram & TikTok: Download the image, then upload it in the app
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
