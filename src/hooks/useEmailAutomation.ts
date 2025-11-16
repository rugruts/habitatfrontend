import { useCallback } from 'react';
import { emailAutomationService, type AutomationTrigger } from '@/services/EmailAutomationService';

export const useEmailAutomation = () => {
  // Trigger booking confirmation email
  const triggerBookingConfirmation = useCallback(async (bookingData: {
    booking_id: string;
    guest_email: string;
    guest_name?: string;
    property_name: string;
    check_in: string;
    check_out: string;
    guest_count: number;
    total_amount: number;
    property_id: string;
  }) => {
    try {
      const trigger: AutomationTrigger = {
        ...bookingData,
        booking_status: 'confirmed'
      };

      await emailAutomationService.processAutomationTrigger(trigger);
      console.log('✅ Booking confirmation email triggered');
    } catch (error) {
      console.error('❌ Error triggering booking confirmation email:', error);
    }
  }, []);

  // Trigger pre-arrival email (24 hours before check-in)
  const triggerPreArrivalEmail = useCallback(async (bookingData: {
    booking_id: string;
    guest_email: string;
    guest_name?: string;
    property_name: string;
    check_in: string;
    check_out: string;
    guest_count: number;
    total_amount: number;
    property_id: string;
  }) => {
    try {
      const trigger: AutomationTrigger = {
        ...bookingData,
        booking_status: 'confirmed'
      };

      // This will be handled by the scheduled email system
      // The automation service will schedule it for 24 hours before check-in
      await emailAutomationService.processAutomationTrigger(trigger);
      console.log('✅ Pre-arrival email scheduled');
    } catch (error) {
      console.error('❌ Error scheduling pre-arrival email:', error);
    }
  }, []);

  // Trigger post-checkout review email (24 hours after check-out)
  const triggerPostCheckoutReview = useCallback(async (bookingData: {
    booking_id: string;
    guest_email: string;
    guest_name?: string;
    property_name: string;
    check_in: string;
    check_out: string;
    guest_count: number;
    total_amount: number;
    property_id: string;
  }) => {
    try {
      const trigger: AutomationTrigger = {
        ...bookingData,
        booking_status: 'completed'
      };

      // This will be handled by the scheduled email system
      // The automation service will schedule it for 24 hours after check-out
      await emailAutomationService.processAutomationTrigger(trigger);
      console.log('✅ Post-checkout review email scheduled');
    } catch (error) {
      console.error('❌ Error scheduling post-checkout review email:', error);
    }
  }, []);

  // Manual trigger for testing
  const triggerManualEmail = useCallback(async (triggerType: 'booking_created' | 'check_in_approaching' | 'check_out_completed', bookingData: AutomationTrigger) => {
    try {
      await emailAutomationService.processAutomationTrigger(bookingData);
      console.log(`✅ Manual email triggered: ${triggerType}`);
    } catch (error) {
      console.error(`❌ Error triggering manual email (${triggerType}):`, error);
    }
  }, []);

  return {
    triggerBookingConfirmation,
    triggerPreArrivalEmail,
    triggerPostCheckoutReview,
    triggerManualEmail
  };
};



