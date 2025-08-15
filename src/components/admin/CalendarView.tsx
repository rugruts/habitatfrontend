import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, ChevronLeft, ChevronRight, Plus, Edit, Trash2 } from 'lucide-react';
import { supabaseHelpers } from '@/lib/supabase';
import { centsToEUR } from '@/lib/api';

interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_amount: number;
  status: string;
  booking_source?: string;
  source?: 'direct' | 'airbnb' | 'booking_com';
  special_requests?: string;
  property_id: string;
  properties?: {
    id: string;
    name: string;
    city: string;
    country: string;
  };
}

interface CalendarDay {
  date: string;
  isCurrentMonth: boolean;
  bookings: Booking[];
  isToday: boolean;
}

interface CalendarViewProps {
  onBookingCreate?: (booking: Partial<Booking>) => void;
  onBookingEdit?: (booking: Booking) => void;
  onBookingDelete?: (bookingId: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  onBookingCreate,
  onBookingEdit,
  onBookingDelete
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const [newBooking, setNewBooking] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    check_in: '',
    check_out: '',
    guests: 2,
    property_id: '',
    notes: '',
    source: 'direct' as const
  });

  // Fetch bookings and properties
  useEffect(() => {
    fetchBookings();
    fetchProperties();
  }, [currentDate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await supabaseHelpers.getAllBookings();
      setBookings(response.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      const propertiesData = await supabaseHelpers.getAllProperties();
      setProperties(propertiesData || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  // Generate calendar days
  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: CalendarDay[] = [];
    const today = new Date().toISOString().split('T')[0];
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayBookings = bookings.filter(booking => {
        const checkIn = booking.check_in;
        const checkOut = booking.check_out;
        return dateStr >= checkIn && dateStr < checkOut;
      });

      days.push({
        date: dateStr,
        isCurrentMonth: date.getMonth() === month,
        bookings: dayBookings,
        isToday: dateStr === today
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'direct':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'airbnb':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'booking_com':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setNewBooking(prev => ({
      ...prev,
      check_in: date,
      check_out: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));
    setShowBookingDialog(true);
  };

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowEditDialog(true);
  };

  const handleCreateBooking = async () => {
    try {
      // Validate required fields
      if (!newBooking.property_id || !newBooking.customer_name || !newBooking.customer_email ||
          !newBooking.check_in || !newBooking.check_out) {
        console.error('Missing required fields');
        return;
      }

      // Calculate total amount (basic calculation - you can make this more sophisticated)
      const checkInDate = new Date(newBooking.check_in);
      const checkOutDate = new Date(newBooking.check_out);
      const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      const pricePerNight = 95; // Default price - you can get this from property data
      const totalAmount = nights * pricePerNight;

      // Create booking in Supabase
      const bookingData = {
        property_id: newBooking.property_id,
        check_in: newBooking.check_in,
        check_out: newBooking.check_out,
        guests: newBooking.guests,
        customer_name: newBooking.customer_name,
        customer_email: newBooking.customer_email,
        customer_phone: newBooking.customer_phone,
        total_amount: totalAmount,
        currency: 'EUR',
        status: 'confirmed' as const,
        source: newBooking.source,
        notes: newBooking.notes
      };

      const createdBooking = await supabaseHelpers.createBooking(bookingData);
      console.log('Booking created successfully:', createdBooking);

      if (onBookingCreate) {
        onBookingCreate(createdBooking);
      }

      setShowBookingDialog(false);
      setNewBooking({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        check_in: '',
        check_out: '',
        guests: 2,
        property_id: '',
        notes: '',
        source: 'direct'
      });

      // Refresh bookings to show the new one
      await fetchBookings();
    } catch (error) {
      console.error('Error creating booking:', error);
      // You could show an error toast here
    }
  };

  const handleEditBooking = (booking: Booking) => {
    // Close the details dialog and open edit in BookingManagement
    setShowEditDialog(false);
    if (onBookingUpdate) {
      // Pass the booking to parent component for editing
      console.log('Edit booking:', booking.id);
      // You could emit an event or call a callback to open the edit dialog in BookingManagement
      alert(`Edit functionality: Open booking ${booking.id} in BookingManagement component`);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      return;
    }

    try {
      // Delete booking from Supabase
      await supabaseHelpers.deleteBooking(bookingId);
      console.log('Booking deleted successfully:', bookingId);

      // Close the dialog
      setShowEditDialog(false);
      setSelectedBooking(null);

      // Refresh bookings
      await fetchBookings();

      // Notify parent component
      if (onBookingUpdate) {
        onBookingUpdate(null); // Signal that a booking was deleted
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Failed to delete booking. Please try again.');
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Legend */}
          <div className="flex items-center gap-4 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-200 rounded"></div>
              <span>Direct</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-200 rounded"></div>
              <span>Airbnb</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-200 rounded"></div>
              <span>Booking.com</span>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {dayNames.map(day => (
              <div key={day} className="p-2 text-center font-medium text-gray-500 text-sm">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`min-h-[120px] p-1 border border-gray-200 cursor-pointer hover:bg-gray-50 ${
                  !day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
                } ${day.isToday ? 'bg-blue-50 border-blue-300' : ''}`}
                onClick={() => handleDateClick(day.date)}
              >
                <div className="text-sm font-medium mb-1">
                  {new Date(day.date).getDate()}
                </div>
                
                {/* Bookings for this day */}
                <div className="space-y-1">
                  {day.bookings.slice(0, 2).map((booking) => (
                    <div
                      key={booking.id}
                      className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 ${getSourceColor(booking.source)}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookingClick(booking);
                      }}
                    >
                      <div className="font-medium truncate">{booking.customer_name}</div>
                      <div className="truncate">{booking.properties?.name}</div>
                    </div>
                  ))}
                  {day.bookings.length > 2 && (
                    <div className="text-xs text-gray-500 p-1">
                      +{day.bookings.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Check-in</Label>
                <Input
                  type="date"
                  value={newBooking.check_in}
                  onChange={(e) => setNewBooking(prev => ({ ...prev, check_in: e.target.value }))}
                />
              </div>
              <div>
                <Label>Check-out</Label>
                <Input
                  type="date"
                  value={newBooking.check_out}
                  onChange={(e) => setNewBooking(prev => ({ ...prev, check_out: e.target.value }))}
                />
              </div>
            </div>
            
            <div>
              <Label>Guest Name</Label>
              <Input
                value={newBooking.customer_name}
                onChange={(e) => setNewBooking(prev => ({ ...prev, customer_name: e.target.value }))}
                placeholder="Guest full name"
              />
            </div>
            
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={newBooking.customer_email}
                onChange={(e) => setNewBooking(prev => ({ ...prev, customer_email: e.target.value }))}
                placeholder="guest@email.com"
              />
            </div>

            <div>
              <Label>Property</Label>
              <Select value={newBooking.property_id} onValueChange={(value) => setNewBooking(prev => ({ ...prev, property_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map(property => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name} - {property.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Guests</Label>
                <Select value={newBooking.guests.toString()} onValueChange={(value) => setNewBooking(prev => ({ ...prev, guests: parseInt(value) }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num} guest{num > 1 ? 's' : ''}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Source</Label>
                <Select value={newBooking.source} onValueChange={(value: 'direct' | 'airbnb' | 'booking_com') => setNewBooking(prev => ({ ...prev, source: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direct">Direct</SelectItem>
                    <SelectItem value="airbnb">Airbnb</SelectItem>
                    <SelectItem value="booking_com">Booking.com</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label>Notes</Label>
              <Textarea
                value={newBooking.notes}
                onChange={(e) => setNewBooking(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Special requests, notes..."
                rows={3}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowBookingDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateBooking}>
                Create Booking
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Booking Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              {/* Property Name */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <Label className="text-sm font-medium text-blue-700">Property</Label>
                <p className="font-semibold text-blue-900">
                  {selectedBooking.properties?.name || 'Unknown Property'}
                </p>
                <p className="text-sm text-blue-600">
                  {selectedBooking.properties?.city || 'Trikala'}, Greece
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Guest</Label>
                  <p className="font-medium">{selectedBooking.customer_name}</p>
                  <p className="text-sm text-gray-600">{selectedBooking.customer_email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Amount</Label>
                  <p className="font-semibold text-lg">{centsToEUR(selectedBooking.total_amount)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Check-in</Label>
                  <p>{new Date(selectedBooking.check_in).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Check-out</Label>
                  <p>{new Date(selectedBooking.check_out).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Guests</Label>
                  <p>{selectedBooking.guests}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Source</Label>
                  <Badge className={getSourceColor(selectedBooking.booking_source || 'direct')}>
                    {selectedBooking.booking_source || 'Direct'}
                  </Badge>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditBooking(selectedBooking)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteBooking(selectedBooking.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarView;
