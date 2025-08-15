import React, { useState, useEffect } from 'react';
import { supabase, supabaseHelpers } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Users,
  Search,
  Filter,
  Eye,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  MessageCircle,
  FileText,
  Download,
  Upload,
  AlertCircle,
  User,
  CreditCard,
  Shield,
  Plus,
  Trash2
} from 'lucide-react';
import { centsToEUR } from '@/lib/api';

interface Guest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  country?: string;
  date_of_birth?: string;
  id_verified: boolean;
  id_document_url?: string;
  vip_status: 'none' | 'bronze' | 'silver' | 'gold';
  notes?: string;
  created_at: string;
  last_stay?: string;
  total_bookings: number;
  total_spent: number;
}

interface Booking {
  id: string;
  guest_id: string;
  property_name: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_amount: number;
  status: string;
}

interface GuestNote {
  id: string;
  guest_id: string;
  note: string;
  created_by: string;
  created_at: string;
  type: 'general' | 'preference' | 'issue' | 'compliment';
}

const GuestManagement: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [filteredGuests, setFilteredGuests] = useState<Guest[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [guestBookings, setGuestBookings] = useState<Booking[]>([]);
  const [guestNotes, setGuestNotes] = useState<GuestNote[]>([]);
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    search: '',
    idVerified: 'all',
    lastStay: 'all'
  });

  const [newNote, setNewNote] = useState({
    note: '',
    type: 'general' as const
  });

  useEffect(() => {
    fetchGuests();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [guests, filters]);

  const fetchGuests = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching guests with filters:', filters);

      const { guests: fetchedGuests, total } = await supabaseHelpers.getAllGuests(50, 0, {
        search: filters.search,
        id_verified: filters.idVerified !== 'all' ? filters.idVerified === 'true' : undefined
      });

      console.log('📊 Raw guests data from Supabase:', fetchedGuests);
      console.log('📊 Total guests count:', total);

      // Transform Supabase data to match component interface
      const transformedGuests: Guest[] = (fetchedGuests || []).map(guest => ({
        id: guest.id,
        name: `${guest.first_name || ''} ${guest.last_name || ''}`.trim(),
        email: guest.email,
        phone: guest.phone || '',
        address: guest.address ? `${guest.address}` : '',
        country: guest.nationality || '',
        id_verified: guest.id_verified,
        vip_status: 'none',
        notes: guest.notes || '',
        created_at: guest.created_at,
        last_stay: guest.last_stay_date || '',
        total_bookings: guest.total_bookings || 0,
        total_spent: (guest.total_spent || 0) // Already in cents from database
      }));

      setGuests(transformedGuests);
      console.log('✅ Transformed guests for display:', transformedGuests);
    } catch (error) {
      console.error('❌ Error fetching guests:', error);
      // Fallback to empty array on error
      setGuests([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...guests];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(guest =>
        guest.name.toLowerCase().includes(searchLower) ||
        guest.email.toLowerCase().includes(searchLower) ||
        guest.phone?.toLowerCase().includes(searchLower)
      );
    }

    // ID verification filter
    if (filters.idVerified !== 'all') {
      const isVerified = filters.idVerified === 'verified';
      filtered = filtered.filter(guest => guest.id_verified === isVerified);
    }

    // Last stay filter
    if (filters.lastStay !== 'all') {
      const today = new Date();
      const filterDate = new Date();
      
      switch (filters.lastStay) {
        case 'recent':
          filterDate.setMonth(today.getMonth() - 3);
          filtered = filtered.filter(guest => 
            guest.last_stay && new Date(guest.last_stay) >= filterDate
          );
          break;
        case 'old':
          filterDate.setFullYear(today.getFullYear() - 1);
          filtered = filtered.filter(guest => 
            guest.last_stay && new Date(guest.last_stay) < filterDate
          );
          break;
      }
    }

    setFilteredGuests(filtered);
  };



  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleViewGuest = async (guest: Guest) => {
    setSelectedGuest(guest);

    try {
      // Fetch real booking history for this guest
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          id,
          property_id,
          check_in,
          check_out,
          guests,
          total_amount,
          status,
          properties (
            name
          )
        `)
        .eq('customer_email', guest.email)
        .order('check_in', { ascending: false });

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
        setGuestBookings([]);
      } else {
        // Transform the data to match our Booking interface
        const transformedBookings: Booking[] = (bookings || []).map(booking => ({
          id: booking.id,
          guest_id: guest.id,
          property_name: booking.properties?.name || 'Unknown Property',
          check_in: booking.check_in,
          check_out: booking.check_out,
          guests: booking.guests,
          total_amount: booking.total_amount,
          status: booking.status
        }));

        setGuestBookings(transformedBookings);
      }

      // Fetch real guest notes from database
      const { data: notes, error: notesError } = await supabase
        .from('guest_notes')
        .select('*')
        .eq('guest_id', guest.id)
        .order('created_at', { ascending: false });

      if (notesError) {
        console.error('Error fetching guest notes:', notesError);
        setGuestNotes([]);
      } else {
        setGuestNotes(notes || []);
      }

      setShowGuestDialog(true);
    } catch (error) {
      console.error('Error fetching guest data:', error);
      setGuestBookings([]);
      setGuestNotes([]);
      setShowGuestDialog(true);
    }
  };

  const handleSendIdReminder = async (guest: Guest) => {
    try {
      // Call your backend API to send ID verification reminder email
      const response = await fetch('/api/send-id-verification-reminder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guestEmail: guest.email,
          guestName: `${guest.first_name} ${guest.last_name}`,
          guestId: guest.id
        }),
      });

      if (response.ok) {
        // Show success message
        console.log('ID verification reminder sent successfully to:', guest.email);
        // You could add a toast notification here
      } else {
        console.error('Failed to send ID verification reminder');
      }
    } catch (error) {
      console.error('Error sending ID verification reminder:', error);
    }
  };

  const handleAddNote = async () => {
    if (!selectedGuest || !newNote.note.trim()) return;

    try {
      // Insert note into database
      const { data, error } = await supabase
        .from('guest_notes')
        .insert({
          guest_id: selectedGuest.id,
          note: newNote.note,
          created_by: 'Admin', // You can get this from auth context
          type: newNote.type
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding note:', error);
        return;
      }

      // Add to local state
      setGuestNotes(prev => [data, ...prev]);
      setNewNote({ note: '', type: 'general' });
      setShowAddNoteDialog(false);
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('guest_notes')
        .delete()
        .eq('id', noteId);

      if (error) {
        console.error('Error deleting note:', error);
        return;
      }

      // Remove from local state
      setGuestNotes(prev => prev.filter(note => note.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleDeleteGuest = async (guest: Guest) => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete ${guest.name}?\n\nThis will permanently remove:\n- Guest profile\n- All guest notes\n- Guest booking history\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', guest.id);

      if (error) {
        console.error('Error deleting guest:', error);
        alert('Failed to delete guest. Please try again.');
        return;
      }

      // Remove from local state
      setGuests(prev => prev.filter(g => g.id !== guest.id));
      setFilteredGuests(prev => prev.filter(g => g.id !== guest.id));

      // Close dialog if this guest was selected
      if (selectedGuest?.id === guest.id) {
        setShowGuestDialog(false);
        setSelectedGuest(null);
      }

      console.log('✅ Guest deleted successfully:', guest.name);
    } catch (error) {
      console.error('Error deleting guest:', error);
      alert('Failed to delete guest. Please try again.');
    }
  };

  const getNoteTypeColor = (type: string) => {
    const colors = {
      general: 'bg-blue-100 text-blue-800',
      preference: 'bg-purple-100 text-purple-800',
      issue: 'bg-red-100 text-red-800',
      compliment: 'bg-green-100 text-green-800'
    };
    return colors[type as keyof typeof colors] || colors.general;
  };

  const getBookingStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      checked_in: 'bg-green-100 text-green-800',
      checked_out: 'bg-gray-100 text-gray-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      no_show: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Guest Management</h2>
          <p className="text-gray-600">Manage guest profiles and stay history</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label className="text-sm">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Name, email, phone..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>



            <div>
              <Label className="text-sm">ID Verification</Label>
              <Select value={filters.idVerified} onValueChange={(value) => setFilters(prev => ({ ...prev, idVerified: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="unverified">Not Verified</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm">Last Stay</Label>
              <Select value={filters.lastStay} onValueChange={(value) => setFilters(prev => ({ ...prev, lastStay: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="recent">Last 3 Months</SelectItem>
                  <SelectItem value="old">Over 1 Year Ago</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guests Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Guests ({filteredGuests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading guests...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Guest</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Last Stay</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGuests.map((guest) => (
                    <TableRow key={guest.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{getInitials(guest.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{guest.name}</p>
                            <p className="text-sm text-gray-600">{guest.country}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{guest.email}</p>
                          {guest.phone && <p className="text-sm text-gray-600">{guest.phone}</p>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {guest.id_verified ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className="text-sm">
                            {guest.id_verified ? 'Verified' : 'Not Verified'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{guest.total_bookings}</p>
                      </TableCell>
                      <TableCell>
                        <p className="font-semibold">{centsToEUR(guest.total_spent)}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">
                          {guest.last_stay ? new Date(guest.last_stay).toLocaleDateString() : 'Never'}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewGuest(guest)}
                            title="View guest details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {!guest.id_verified && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSendIdReminder(guest)}
                              title="Send ID verification reminder"
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteGuest(guest)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Delete guest"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Guest Details Dialog */}
      <Dialog open={showGuestDialog} onOpenChange={setShowGuestDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Guest Profile</DialogTitle>
          </DialogHeader>
          {selectedGuest && (
            <div className="space-y-6">
              {/* Guest Header */}
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">
                    {getInitials(selectedGuest.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{selectedGuest.name}</h3>
                    {selectedGuest.id_verified ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        ID Verified
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">
                        <XCircle className="h-3 w-3 mr-1" />
                        ID Not Verified
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{selectedGuest.email}</span>
                    </div>
                    {selectedGuest.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{selectedGuest.phone}</span>
                      </div>
                    )}
                    {selectedGuest.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{selectedGuest.address}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>Member since {new Date(selectedGuest.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{centsToEUR(selectedGuest.total_spent)}</div>
                  <div className="text-sm text-gray-600">Total Spent</div>
                  <div className="text-lg font-semibold mt-1">{selectedGuest.total_bookings}</div>
                  <div className="text-sm text-gray-600">Bookings</div>
                </div>
              </div>

              <Separator />

              <Tabs defaultValue="bookings" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="bookings">Booking History</TabsTrigger>
                  <TabsTrigger value="notes">Notes & Preferences</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="bookings" className="space-y-4">
                  <div className="space-y-3">
                    {guestBookings.map((booking) => (
                      <Card key={booking.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{booking.property_name}</h4>
                              <p className="text-sm text-gray-600">
                                {new Date(booking.check_in).toLocaleDateString()} - {new Date(booking.check_out).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-gray-600">{booking.guests} guests</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{centsToEUR(booking.total_amount)}</p>
                              <Badge className={`mt-1 ${getBookingStatusColor(booking.status)}`}>
                                {booking.status.replace('_', ' ').toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Guest Notes</h4>
                    <Button onClick={() => setShowAddNoteDialog(true)} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Note
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {guestNotes.map((note) => (
                      <Card key={note.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className={getNoteTypeColor(note.type)}>
                                  {note.type}
                                </Badge>
                                <span className="text-sm text-gray-600">
                                  by {note.created_by} • {new Date(note.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm">{note.note}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteNote(note.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {selectedGuest.notes && (
                    <Card>
                      <CardContent className="pt-4">
                        <h5 className="font-medium mb-2">Profile Notes</h5>
                        <p className="text-sm text-gray-600">{selectedGuest.notes}</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                  <div className="text-center py-8">
                    <div className="flex items-center justify-center gap-4">
                      {selectedGuest.id_verified ? (
                        <div className="text-center">
                          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
                          <p className="font-medium">ID Document Verified</p>
                          <p className="text-sm text-gray-600">Document uploaded and verified</p>
                          <Button variant="outline" size="sm" className="mt-2">
                            <Eye className="h-4 w-4 mr-2" />
                            View Document
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <AlertCircle className="h-12 w-12 text-orange-600 mx-auto mb-2" />
                          <p className="font-medium">ID Verification Pending</p>
                          <p className="text-sm text-gray-600">Guest needs to upload ID document</p>
                          <Button onClick={() => handleSendIdReminder(selectedGuest)} size="sm" className="mt-2">
                            <Mail className="h-4 w-4 mr-2" />
                            Send Reminder
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Actions */}
              <div className="flex justify-between gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => selectedGuest && handleDeleteGuest(selectedGuest)}
                  className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Guest
                </Button>
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Note Dialog */}
      <Dialog open={showAddNoteDialog} onOpenChange={setShowAddNoteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Guest Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Note Type</Label>
              <Select value={newNote.type} onValueChange={(value: 'general' | 'preference' | 'issue' | 'compliment') => setNewNote(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="preference">Preference</SelectItem>
                  <SelectItem value="issue">Issue</SelectItem>
                  <SelectItem value="compliment">Compliment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Note</Label>
              <Textarea
                value={newNote.note}
                onChange={(e) => setNewNote(prev => ({ ...prev, note: e.target.value }))}
                placeholder="Add a note about this guest..."
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddNoteDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddNote}>
                Add Note
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GuestManagement;
