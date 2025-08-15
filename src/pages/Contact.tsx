import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Phone, MapPin, Clock, Send, Loader2 } from "lucide-react";
import Footer from "@/components/Footer";
import ViberIcon from "@/components/ui/viber-icon";

const Contact: React.FC = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
    arrivalDate: '',
    departureDate: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Open email client with form data
      const emailSubject = encodeURIComponent(formData.subject);
      const emailBody = encodeURIComponent(
        `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Phone: ${formData.phone}\n` +
        `Arrival Date: ${formData.arrivalDate}\n` +
        `Departure Date: ${formData.departureDate}\n\n` +
        `Message:\n${formData.message}`
      );
      
      window.open(`mailto:info@habitatlobby.com?subject=${emailSubject}&body=${emailBody}`, '_blank');
      
      toast({ 
        title: "Opening email client", 
        description: "Please send the email to complete your inquiry." 
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: '',
        arrivalDate: '',
        departureDate: ''
      });
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Please try again or contact us directly." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Helmet>
        <title>Contact Stefanos - Habitat Lobby Trikala</title>
        <meta name="description" content="Get in touch with Stefanos at Habitat Lobby in Trikala, Greece. Quick responses via Viber, email, or phone. We're here to help plan your perfect stay." />
        <link rel="canonical" href="https://habitat-lobby.lovable.app/contact" />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl mb-6">
              Get in Touch with Stefanos
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Have questions about your stay? Need local recommendations? 
              Stefanos is here to help make your Trikala experience unforgettable.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Information */}
            <div>
              <h2 className="font-serif text-3xl mb-8">Contact Information</h2>
              
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Mail className="h-6 w-6 text-accent mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Email</h3>
                        <p className="text-gray-600 mb-2">Best for detailed inquiries</p>
                        <a 
                          href="mailto:info@habitatlobby.com"
                          className="text-accent hover:underline font-medium"
                        >
                          info@habitatlobby.com
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Phone className="h-6 w-6 text-accent mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Phone</h3>
                        <p className="text-gray-600 mb-2">Direct line to Stefanos</p>
                        <a 
                          href="tel:+302431234567"
                          className="text-accent hover:underline font-medium"
                        >
                          +30 243 123 4567
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <ViberIcon className="h-6 w-6 text-accent mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Viber</h3>
                        <p className="text-gray-600 mb-3">Quick responses, usually within minutes</p>
                        <Button
                          onClick={() => window.open('viber://chat?number=stefanos_habitat', '_blank')}
                          variant="outline"
                          size="sm"
                        >
                          Chat on Viber
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Clock className="h-6 w-6 text-accent mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Response Times</h3>
                        <div className="text-gray-600 space-y-1">
                          <p>Viber: Usually within 30 minutes</p>
                          <p>Email: Within 24 hours</p>
                          <p>Phone: Available 9 AM - 10 PM (Greek time)</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">Send a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={onSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Name *</label>
                        <Input 
                          name="name" 
                          value={formData.name}
                          onChange={handleInputChange}
                          required 
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Email *</label>
                        <Input 
                          type="email" 
                          name="email" 
                          value={formData.email}
                          onChange={handleInputChange}
                          required 
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Phone</label>
                        <Input 
                          name="phone" 
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+30 123 456 7890"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Subject</label>
                        <select 
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Booking Question">Booking Question</option>
                          <option value="Local Recommendations">Local Recommendations</option>
                          <option value="Special Request">Special Request</option>
                          <option value="Feedback">Feedback</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Arrival Date</label>
                        <Input 
                          type="date" 
                          name="arrivalDate" 
                          value={formData.arrivalDate}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Departure Date</label>
                        <Input 
                          type="date" 
                          name="departureDate" 
                          value={formData.departureDate}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Message *</label>
                      <Textarea 
                        name="message" 
                        value={formData.message}
                        onChange={handleInputChange}
                        required 
                        rows={6} 
                        placeholder="Tell us about your inquiry, special requests, or questions about Trikala..."
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Contact;
