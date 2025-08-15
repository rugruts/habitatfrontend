import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Mail, Phone } from 'lucide-react';
import ViberIcon from '@/components/ui/viber-icon';

const FAQ: React.FC = () => {
  const faqData = [
    {
      id: 'check-in',
      question: 'What are the check-in and check-out times?',
      answer: 'Check-in is from 3:00 PM onwards, and check-out is until 11:00 AM. We offer flexible timing when possible - just let us know your arrival time in advance!'
    },
    {
      id: 'location',
      question: 'How close are the apartments to Trikala center?',
      answer: 'All our apartments are located in the heart of Trikala, within walking distance of the main square, restaurants, cafes, and local attractions. The historic center is just 2-3 minutes on foot!'
    },
    {
      id: 'parking',
      question: 'Is parking available?',
      answer: 'Yes! We provide free parking spaces for our guests. The parking area is secure and just a short walk from the apartments. We\'ll send you detailed directions upon booking confirmation.'
    },
    {
      id: 'amenities',
      question: 'What amenities are included?',
      answer: 'All apartments include free WiFi, air conditioning, fully equipped kitchen, fresh linens and towels, toiletries, coffee/tea, and local welcome treats. Each apartment also has unique features - check the individual listings for details!'
    },
    {
      id: 'booking',
      question: 'How do I make a reservation?',
      answer: 'You can book directly through our website for the best rates and personalized service. Simply select your dates, choose your apartment, and complete the secure booking process. You\'ll receive instant confirmation!'
    },
    {
      id: 'cancellation',
      question: 'What is your cancellation policy?',
      answer: 'We offer flexible cancellation up to 48 hours before your arrival for a full refund. For cancellations within 48 hours, we charge one night. We understand plans change and try to be as accommodating as possible!'
    },
    {
      id: 'local-tips',
      question: 'Do you provide local recommendations?',
      answer: 'Absolutely! Stefanos loves sharing his local knowledge. You\'ll receive a personalized guide with restaurant recommendations, hidden gems, day trip ideas, and insider tips to make your stay unforgettable.'
    },
    {
      id: 'contact',
      question: 'How can I contact you during my stay?',
      answer: 'Stefanos is available 24/7 via Viber or phone for any questions or assistance. You\'ll receive his direct contact information upon booking confirmation.'
    },
    {
      id: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment system. Payment is processed immediately upon booking confirmation.'
    },
    {
      id: 'groups',
      question: 'Can you accommodate larger groups?',
      answer: 'Yes! We have multiple apartments that can accommodate different group sizes. For groups of 6+ people, we can arrange multiple apartments in the same building or nearby. Contact us for special group rates!'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Helmet>
        <title>Frequently Asked Questions - Habitat Lobby</title>
        <meta name="description" content="Find answers to common questions about staying at Habitat Lobby apartments in Trikala, Greece. Get information about check-in, amenities, location, and more." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Everything you need to know about your stay at Habitat Lobby. 
              Can't find what you're looking for? We're here to help!
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqData.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <Card>
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <CardTitle className="text-left text-lg font-medium">
                        {faq.question}
                      </CardTitle>
                    </AccordionTrigger>
                    <AccordionContent>
                      <CardContent className="pt-0 pb-6">
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </CardContent>
                    </AccordionContent>
                  </Card>
                </AccordionItem>
              ))}
            </Accordion>
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
