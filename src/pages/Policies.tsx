import React from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HelpCircle, FileText, Shield, Clock } from "lucide-react";

const Policies: React.FC = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Policies & Terms – Habitat Lobby</title>
        <meta name="description" content="House rules, booking policies, and terms of service for Habitat Lobby apartments in Trikala." />
        <link rel="canonical" href="https://habitat-lobby.lovable.app/policies" />
      </Helmet>

      <section className="container py-10 md:py-14">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-3xl md:text-5xl mb-6">Policies & Terms</h1>
          <p className="text-muted-foreground text-lg mb-12 max-w-2xl">
            Important information about booking policies, house rules, and terms of service for your stay.
          </p>

          <div className="grid gap-8">
            {/* Booking Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary" />
                  Booking & Cancellation Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Reservation Confirmation</h4>
                  <p className="text-muted-foreground">All bookings require confirmation within 24 hours. Payment is processed immediately upon confirmation.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Cancellation Terms</h4>
                  <p className="text-muted-foreground">Free cancellation up to 48 hours before check-in for full refund. Cancellations within 48 hours incur one night charge.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">No-Show Policy</h4>
                  <p className="text-muted-foreground">No-shows will be charged the full amount of the reservation.</p>
                </div>
              </CardContent>
            </Card>

            {/* House Rules */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-primary" />
                  House Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Check-in & Check-out</h4>
                  <p className="text-muted-foreground">Check-in: 3:00 PM - 9:00 PM | Check-out: Until 11:00 AM. Late check-in available with advance notice.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Quiet Hours</h4>
                  <p className="text-muted-foreground">Please keep noise levels low between 10:00 PM and 8:00 AM out of respect for neighbors.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Smoking & Parties</h4>
                  <p className="text-muted-foreground">No smoking inside apartments. No parties or events. Maximum occupancy must be respected.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Pets</h4>
                  <p className="text-muted-foreground">Pets are welcome with prior approval and additional cleaning fee. Please inform us during booking.</p>
                </div>
              </CardContent>
            </Card>

            {/* Terms of Service */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-primary" />
                  Terms of Service
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Liability</h4>
                  <p className="text-muted-foreground">Guests are responsible for any damage to the property beyond normal wear and tear.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Privacy</h4>
                  <p className="text-muted-foreground">Your privacy is important to us. We collect only necessary information for booking and communication purposes.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Contact</h4>
                  <p className="text-muted-foreground">For any questions about these policies, please contact us directly.</p>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Link */}
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardContent className="pt-8 text-center">
                <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Have Questions?</h3>
                <p className="text-muted-foreground mb-6">
                  Visit our comprehensive FAQ page for answers to common questions about booking, 
                  check-in, amenities, and local recommendations.
                </p>
                <Button asChild size="lg">
                  <Link to="/faq">
                    View All FAQs
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

    </main>
  );
};

export default Policies;
