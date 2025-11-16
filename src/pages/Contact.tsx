import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  Loader2, 
  MessageCircle,
  Building2,
  CheckCircle,
  AlertCircle,
  Calendar,
  Globe,
  Star,
  Heart,
  HelpCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  preferredContact: 'email' | 'phone';
  urgency: 'low' | 'medium' | 'high';
}

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    preferredContact: 'email',
    urgency: 'medium'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://backendhabitatapi.vercel.app/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          to: 'admin@habitatlobby.com',
          from: formData.email,
          subject: `Contact Form: ${formData.subject}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
            <p><strong>Subject:</strong> ${formData.subject}</p>
            <p><strong>Preferred Contact:</strong> ${formData.preferredContact}</p>
            <p><strong>Urgency:</strong> ${formData.urgency}</p>
            <p><strong>Message:</strong></p>
            <p>${formData.message.replace(/\n/g, '<br>')}</p>
          `
        }),
      });

      if (response.ok) {
        toast({
          title: "Message sent successfully!",
          description: "We'll get back to you within 24 hours.",
          variant: "default",
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          preferredContact: 'email',
          urgency: 'medium'
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending contact form:', error);
      toast({
        title: "Error sending message",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      value: "+30 697 769 0685",
      href: "tel:+306977690685",
      description: "Call us anytime",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      icon: Mail,
      title: "Email",
      value: "admin@habitatlobby.com",
      href: "mailto:admin@habitatlobby.com",
      description: "We reply within 24h",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: MapPin,
      title: "Address",
      value: "Alexandras 59, Trikala 42100",
      href: "https://maps.google.com/?q=Alexandras+59,+Trikala+42100,+Greece",
      description: "City center location",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      icon: Clock,
      title: "Response Time",
      value: "Within 24 hours",
      href: "#",
      description: "Usually much faster",
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  const features = [
    {
      icon: Star,
      title: "4.9/5 Rating",
      description: "From 200+ guests"
    },
    {
      icon: Heart,
      title: "Local Hospitality",
      description: "Authentic Greek experience"
    },
    {
      icon: Building2,
      title: "Premium Apartments",
      description: "Luxury amenities included"
    },
    {
      icon: Globe,
      title: "Multilingual Support",
      description: "English, Greek, German"
    }
  ];

  return (
    <main className="mobile-main-content bg-gradient-to-br from-background via-muted/30 to-background">
      <Helmet>
        <title>Contact Habitat Lobby – Premium Apartments in Trikala</title>
        <meta name="description" content="Get in touch with Habitat Lobby in Trikala, Greece. We're here to help you plan the perfect stay with our premium apartments." />
        <link rel="canonical" href="https://habitatlobby.com/contact" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Habitat Lobby',
          url: 'https://habitatlobby.com',
          contactPoint: [
            { 
              '@type': 'ContactPoint', 
              email: 'admin@habitatlobby.com', 
              telephone: '+306977690685',
              contactType: 'customer service',
              availableLanguage: ['English', 'Greek', 'German']
            }
          ],
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Alexandras 59',
            addressLocality: 'Trikala',
            postalCode: '42100',
            addressCountry: 'GR'
          }
        })}</script>
      </Helmet>

      <div className="mobile-container">
        {/* Hero Section */}
                 <div className="text-center mb-12">
           <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 shadow-lg overflow-hidden">
             <img 
               src="/favicon.svg" 
               alt="Habitat Lobby Logo" 
               className="w-full h-full object-cover"
             />
           </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions about our premium apartments in Trikala? 
            We're here to help you plan your perfect stay.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <Card className="mobile-card-elevated">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
                <Send className="w-6 h-6 text-primary" />
                Send us a Message
              </CardTitle>
              <p className="text-muted-foreground">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Full Name *
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="mobile-input"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="mobile-input"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mobile-input"
                      placeholder="+30 697 769 0685"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Subject *
                    </label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="mobile-input"
                      placeholder="Booking inquiry, question, etc."
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Preferred Contact Method
                    </label>
                    <select
                      name="preferredContact"
                      value={formData.preferredContact}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:border-primary focus:outline-none transition-colors"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Urgency Level
                    </label>
                    <select
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:border-primary focus:outline-none transition-colors"
                    >
                      <option value="low">Low - General inquiry</option>
                      <option value="medium">Medium - Planning a trip</option>
                      <option value="high">High - Urgent booking</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Message *
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="mobile-textarea"
                    placeholder="Tell us about your inquiry, preferred dates, number of guests, or any special requirements..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mobile-button-primary h-14"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Info Cards */}
            <div className="space-y-4">
              {contactInfo.map((info) => {
                const Icon = info.icon;
                return (
                  <Card key={info.title} className="mobile-card-interactive">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 ${info.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-6 h-6 ${info.color}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">{info.title}</h3>
                          <a
                            href={info.href}
                            className={`text-lg font-medium ${info.color} hover:opacity-80 transition-opacity`}
                          >
                            {info.value}
                          </a>
                          <p className="text-sm text-muted-foreground mt-1">{info.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Features */}
            <Card className="mobile-card-elevated">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground">
                  Why Choose Habitat Lobby?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {features.map((feature) => {
                    const Icon = feature.icon;
                    return (
                      <div key={feature.title} className="text-center p-4 bg-muted/30 rounded-xl">
                        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <h4 className="font-semibold text-foreground text-sm mb-1">{feature.title}</h4>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mobile-card-elevated">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full mobile-button-outline" asChild>
                  <a href="/apartments">
                    <Building2 className="w-4 h-4 mr-2" />
                    View Our Apartments
                  </a>
                </Button>
                <Button variant="outline" className="w-full mobile-button-outline" asChild>
                  <a href="/reviews">
                    <Star className="w-4 h-4 mr-2" />
                    Read Guest Reviews
                  </a>
                </Button>
                <Button variant="outline" className="w-full mobile-button-outline" asChild>
                  <a href="/about-trikala">
                    <Globe className="w-4 h-4 mr-2" />
                    Learn About Trikala
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Quick Link */}
        <Card className="mobile-card-elevated mb-16 text-center">
          <CardContent className="pt-8">
            <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Need Quick Answers?</h3>
            <p className="text-muted-foreground mb-6">
              Check our comprehensive FAQ page for answers to common questions about booking, 
              check-in, amenities, and local recommendations.
            </p>
            <Button asChild variant="outline" size="lg">
              <Link to="/faq">
                View All FAQs
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Contact;
