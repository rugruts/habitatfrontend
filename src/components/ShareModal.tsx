import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Share2, 
  Copy, 
  Mail, 
  MessageCircle, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  MessageSquare, 
  Link as LinkIcon,
  X,
  Check
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: {
    id: string;
    name: string;
    description: string;
    images: string[];
    city: string;
    country: string;
  };
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, property }) => {
  console.log('ShareModal props:', { isOpen, property });
  
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Don't render if property is not available
  if (!property) {
    return null;
  }

  const shareUrl = `${window.location.origin}/apartments/${property.id}`;
  const shareText = `Check out this amazing apartment: ${property.name} in ${property.city}, ${property.country}`;
  const shareImage = property.images[0] || '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleEmailShare = () => {
    const subject = `Check out this apartment: ${property.name}`;
    const body = `${message}\n\n${shareText}\n\n${shareUrl}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const handleWhatsAppShare = () => {
    const text = `${shareText}\n\n${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
  };

  const handleFacebookShare = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
  };

  const handleTwitterShare = () => {
    const text = `${shareText}\n\n${shareUrl}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`);
  };

  const handleLinkedInShare = () => {
    const url = encodeURIComponent(shareUrl);
    const title = encodeURIComponent(property.name);
    const summary = encodeURIComponent(property.description);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`);
  };

  const handleInstagramShare = () => {
    // Instagram doesn't support direct URL sharing, so we copy the link
    handleCopyLink();
  };

  const shareOptions = [
    {
      name: 'Copy Link',
      icon: copied ? Check : Copy,
      onClick: handleCopyLink,
      color: copied ? 'text-green-600' : 'text-blue-600',
      bgColor: copied ? 'bg-green-100' : 'bg-blue-100'
    },
    {
      name: 'WhatsApp',
      icon: MessageSquare,
      onClick: handleWhatsAppShare,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Email',
      icon: Mail,
      onClick: handleEmailShare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      onClick: handleFacebookShare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      onClick: handleTwitterShare,
      color: 'text-blue-400',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      onClick: handleLinkedInShare,
      color: 'text-blue-700',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      onClick: handleInstagramShare,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    }
  ];

  console.log('ShareModal rendering with isOpen:', isOpen);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share this apartment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Property Preview */}
          <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
            <img 
              src={shareImage} 
              alt={property.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">{property.name}</h3>
              <p className="text-xs text-muted-foreground truncate">{property.city}, {property.country}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{property.description}</p>
            </div>
          </div>

          {/* Share Link */}
          <div className="space-y-2">
            <Label htmlFor="share-link">Share link</Label>
            <div className="flex gap-2">
              <Input 
                id="share-link"
                value={shareUrl}
                readOnly
                className="flex-1"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCopyLink}
                className="shrink-0"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Quick Share Options */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Quick share</Label>
            <div className="grid grid-cols-4 gap-3">
              {shareOptions.map((option) => (
                <Button
                  key={option.name}
                  variant="ghost"
                  size="sm"
                  onClick={option.onClick}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                >
                  <div className={`p-2 rounded-full ${option.bgColor}`}>
                    <option.icon className={`h-4 w-4 ${option.color}`} />
                  </div>
                  <span className="text-xs">{option.name}</span>
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Email Share with Custom Message */}
          <div className="space-y-3">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <Label htmlFor="message">Message (optional)</Label>
            <textarea
              id="message"
              placeholder="Add a personal message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full min-h-[80px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
            
            <Button 
              onClick={handleEmailShare}
              className="w-full"
              disabled={!email}
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
