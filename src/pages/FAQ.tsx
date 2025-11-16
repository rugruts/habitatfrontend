import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Phone, Search, HelpCircle, Clock, MapPin, CreditCard, Users, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ViberIcon from '@/components/ui/viber-icon';

const FAQ: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const faqData = [
    // Booking & Reservations
    {
      id: 'booking',
      category: 'booking',
      icon: CreditCard,
      question: 'How do I make a reservation?',
      answer: 'You can book directly through our website for the best rates and personalized service. Simply select your dates, choose your apartment, and complete the secure booking process. You\'ll receive instant confirmation!'
    },
    {
      id: 'best-booking',
      category: 'booking',
      icon: Star,
      question: 'What is the best way to book?',
      answer: 'Book direct here for the best rate, flexible policies, and personal tips from our local team.'
    },
    {
      id: 'cancellation',
      category: 'booking',
      icon: Clock,
      question: 'What is your cancellation policy?',
      answer: 'We offer flexible cancellation up to 48 hours before your arrival for a full refund. For cancellations within 48 hours, we charge one night. We understand plans change and try to be as accommodating as possible!'
    },
    {
      id: 'payment',
      category: 'booking',
      icon: CreditCard,
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment system. Payment is processed immediately upon booking confirmation.'
    },
    {
      id: 'groups',
      category: 'booking',
      icon: Users,
      question: 'Can you accommodate larger groups?',
      answer: 'Yes! We have multiple apartments that can accommodate different group sizes. For groups of 6+ people, we can arrange multiple apartments in the same building or nearby. Contact us for special group rates!'
    },

    // Check-in & Check-out
    {
      id: 'check-in',
      category: 'checkin',
      icon: Clock,
      question: 'What are the check-in and check-out times?',
      answer: 'Check-in is from 3:00 PM onwards, and check-out is until 11:00 AM. We offer flexible timing when possible - just let us know your arrival time in advance!'
    },
    {
      id: 'late-checkin',
      category: 'checkin',
      icon: Clock,
      question: 'Do you offer late check-in?',
      answer: 'Absolutely, with prior notice we provide seamless self check-in at any hour.'
    },
    {
      id: 'early-checkin',
      category: 'checkin',
      icon: Clock,
      question: 'Can I check in early?',
      answer: 'Early check-in is available subject to availability. Please contact us in advance and we\'ll do our best to accommodate your request.'
    },

    // Location & Transportation
    {
      id: 'location',
      category: 'location',
      icon: MapPin,
      question: 'How close are the apartments to Trikala center?',
      answer: 'All our apartments are located in the heart of Trikala, within walking distance of the main square, restaurants, cafes, and local attractions. The historic center is just 2-3 minutes on foot!'
    },
    {
      id: 'walkable',
      category: 'location',
      icon: MapPin,
      question: 'Is Trikala walkable?',
      answer: 'Yes—most sights are 5–15 minutes on foot or by bicycle along the river. The city center is very pedestrian-friendly.'
    },
    {
      id: 'parking',
      category: 'location',
      icon: MapPin,
      question: 'Is parking available?',
      answer: 'Yes! We provide free parking spaces for our guests. The parking area is secure and just a short walk from the apartments. We\'ll send you detailed directions upon booking confirmation.'
    },

    // Amenities & Services
    {
      id: 'amenities',
      category: 'amenities',
      icon: Star,
      question: 'What amenities are included?',
      answer: 'All apartments include free WiFi, air conditioning, fully equipped kitchen, fresh linens and towels, toiletries, coffee/tea, and local welcome treats. Each apartment also has unique features - check the individual listings for details!'
    },
    {
      id: 'cleaning',
      category: 'amenities',
      icon: Star,
      question: 'Is cleaning service included?',
      answer: 'Professional cleaning is included before your arrival and after departure. For stays longer than 7 days, we provide complimentary mid-stay cleaning.'
    },

    // Local Experience
    {
      id: 'local-tips',
      category: 'local',
      icon: MapPin,
      question: 'Do you provide local recommendations?',
      answer: 'Absolutely! Stefanos loves sharing his local knowledge. You\'ll receive a personalized guide with restaurant recommendations, hidden gems, day trip ideas, and insider tips to make your stay unforgettable.'
    },
    {
      id: 'market-shopping',
      category: 'local',
      icon: MapPin,
      question: 'Can I shop at the local market without speaking Greek?',
      answer: 'Yes — vendors are used to visitors and happy to help with gestures and basic English. The market is a wonderful cultural experience!'
    },
    {
      id: 'cafe-culture',
      category: 'local',
      icon: MapPin,
      question: 'Are cafés laptop-friendly?',
      answer: 'Many have Wi-Fi, but the culture leans towards socializing rather than working. Perfect for people-watching and experiencing local life!'
    },

    // Contact & Support
    {
      id: 'contact',
      category: 'support',
      icon: HelpCircle,
      question: 'How can I contact you during my stay?',
      answer: 'Stefanos is available 24/7 via Viber or phone for any questions or assistance. You\'ll receive his direct contact information upon booking confirmation.'
    },
    {
      id: 'response-time',
      category: 'support',
      icon: HelpCircle,
      question: 'How quickly do you respond to messages?',
      answer: 'We typically respond within 1 hour during business hours (9 AM - 9 PM Greek time), and within a few hours outside business hours.'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Questions', icon: HelpCircle },
    { id: 'booking', name: 'Booking & Reservations', icon: CreditCard },
    { id: 'checkin', name: 'Check-in & Check-out', icon: Clock },
    { id: 'location', name: 'Location & Transportation', icon: MapPin },
    { id: 'amenities', name: 'Amenities & Services', icon: Star },
    { id: 'local', name: 'Local Experience', icon: MapPin },
    { id: 'support', name: 'Contact & Support', icon: HelpCircle },
  ];

  const filteredFAQs = faqData.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Helmet>
        <title>Frequently Asked Questions - Habitat Lobby</title>
        <meta name="description" content="Find answers to common questions about staying at Habitat Lobby apartments in Trikala, Greece. Get information about check-in, amenities, location, and more." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-white/90 leading-relaxed mb-8">
              Everything you need to know about your stay at Habitat Lobby. 
              Can't find what you're looking for? We're here to help!
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-3 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            
            {/* Category Statistics */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <CreditCard className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Booking & Reservations</h3>
                  <p className="text-sm text-muted-foreground">Payment, cancellation, group bookings</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Location & Amenities</h3>
                  <p className="text-sm text-muted-foreground">Parking, location, services included</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <HelpCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Local Experience</h3>
                  <p className="text-sm text-muted-foreground">Tips, recommendations, local culture</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-7 mb-8">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const categoryFAQs = category.id === 'all' ? faqData : faqData.filter(faq => faq.category === category.id);
                  return (
                    <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{category.name}</span>
                      <Badge variant="secondary" className="ml-1">{categoryFAQs.length}</Badge>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {categories.map((category) => (
                <TabsContent key={category.id} value={category.id}>
                  <Accordion type="single" collapsible className="space-y-4">
                    {(category.id === 'all' ? filteredFAQs : filteredFAQs.filter(faq => faq.category === category.id))
                      .map((faq) => {
                        const Icon = faq.icon;
                        return (
                          <AccordionItem key={faq.id} value={faq.id}>
                            <Card className="hover:shadow-md transition-shadow">
                              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                                <div className="flex items-center gap-3 text-left">
                                  <Icon className="h-5 w-5 text-primary flex-shrink-0" />
                                  <CardTitle className="text-lg font-medium">
                                    {faq.question}
                                  </CardTitle>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <CardContent className="pt-0 pb-6">
                                  <p className="text-gray-600 leading-relaxed ml-8">
                                    {faq.answer}
                                  </p>
                                </CardContent>
                              </AccordionContent>
                            </Card>
                          </AccordionItem>
                        );
                      })}
                  </Accordion>
                  
                  {(category.id === 'all' ? filteredFAQs : filteredFAQs.filter(faq => faq.category === category.id)).length === 0 && (
                    <Card className="text-center py-12">
                      <CardContent>
                        <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No questions found</h3>
                        <p className="text-gray-600">Try adjusting your search terms or browse other categories.</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl mb-6">Still Have Questions?</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Stefanos is always happy to help! Reach out through your preferred method and get personalized assistance.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <ViberIcon className="h-8 w-8 text-accent mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Viber Chat</h3>
                  <p className="text-sm text-gray-600 mb-4">Quick responses via Viber</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('viber://chat?number=stefanos_habitat', '_blank')}
                  >
                    Chat Now
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <Mail className="h-8 w-8 text-accent mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-sm text-gray-600 mb-4">Detailed inquiries welcome</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('mailto:info@habitatlobby.com', '_blank')}
                  >
                    Send Email
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <Phone className="h-8 w-8 text-accent mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Phone</h3>
                  <p className="text-sm text-gray-600 mb-4">Direct line to Stefanos</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('tel:+302431234567', '_blank')}
                  >
                    Call Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
