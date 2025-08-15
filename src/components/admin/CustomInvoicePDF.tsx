import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';
import { format } from 'date-fns';

// Professional invoice styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 40,
    borderBottom: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 20,
  },
  logo: {
    width: 120,
    height: 60,
  },
  companyInfo: {
    textAlign: 'right',
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  companyDetails: {
    fontSize: 10,
    color: '#6b7280',
    lineHeight: 1.4,
  },
  invoiceTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2563eb',
    textAlign: 'center',
    marginBottom: 30,
  },
  invoiceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  invoiceDetails: {
    flex: 1,
  },
  customerDetails: {
    flex: 1,
    marginLeft: 40,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 10,
    color: '#6b7280',
    width: 80,
  },
  detailValue: {
    fontSize: 10,
    color: '#1f2937',
    fontWeight: 'bold',
  },
  table: {
    marginTop: 20,
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 4,
  },
  tableHeaderCell: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottom: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableCell: {
    fontSize: 10,
    color: '#1f2937',
  },
  description: {
    flex: 3,
  },
  dates: {
    flex: 2,
    textAlign: 'center',
  },
  amount: {
    flex: 1,
    textAlign: 'right',
  },
  totalsSection: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 11,
    color: '#6b7280',
  },
  totalValue: {
    fontSize: 11,
    color: '#1f2937',
    fontWeight: 'bold',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginTop: 8,
    paddingTop: 8,
    borderTop: 2,
    borderTopColor: '#2563eb',
  },
  grandTotalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  grandTotalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  footer: {
    marginTop: 40,
    paddingTop: 20,
    borderTop: 1,
    borderTopColor: '#e5e7eb',
  },
  footerText: {
    fontSize: 9,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 1.4,
  },
  paymentInfo: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 4,
  },
  paymentTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  paymentText: {
    fontSize: 9,
    color: '#6b7280',
    lineHeight: 1.4,
  },
});

interface InvoiceData {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  customer: {
    name: string;
    email: string;
  };
  property: {
    name: string;
    address?: string;
  };
  booking: {
    checkIn: string;
    checkOut: string;
    guests: number;
    nights: number;
  };
  amounts: {
    subtotal: number;
    tax: number;
    total: number;
  };
  status: string;
}

const CustomInvoiceDocument: React.FC<{ data: InvoiceData }> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.companyName}>Habitat Lobby</Text>
          <Text style={styles.companyDetails}>
            Premium Accommodation Services{'\n'}
            Trikala, Greece{'\n'}
            info@habitatlobby.com{'\n'}
            +30 123 456 7890
          </Text>
        </View>
        <View style={styles.companyInfo}>
          <Text style={styles.companyDetails}>
            VAT: GR123456789{'\n'}
            Registration: 12345678{'\n'}
            www.habitatlobby.com
          </Text>
        </View>
      </View>

      {/* Invoice Title */}
      <Text style={styles.invoiceTitle}>INVOICE</Text>

      {/* Invoice & Customer Info */}
      <View style={styles.invoiceInfo}>
        <View style={styles.invoiceDetails}>
          <Text style={styles.sectionTitle}>Invoice Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Number:</Text>
            <Text style={styles.detailValue}>{data.invoiceNumber}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Issue Date:</Text>
            <Text style={styles.detailValue}>{format(new Date(data.issueDate), 'dd/MM/yyyy')}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Due Date:</Text>
            <Text style={styles.detailValue}>{format(new Date(data.dueDate), 'dd/MM/yyyy')}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={styles.detailValue}>{data.status.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.customerDetails}>
          <Text style={styles.sectionTitle}>Bill To</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Name:</Text>
            <Text style={styles.detailValue}>{data.customer.name}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email:</Text>
            <Text style={styles.detailValue}>{data.customer.email}</Text>
          </View>
        </View>
      </View>

      {/* Services Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, styles.description]}>Description</Text>
          <Text style={[styles.tableHeaderCell, styles.dates]}>Period</Text>
          <Text style={[styles.tableHeaderCell, styles.amount]}>Amount</Text>
        </View>
        
        <View style={styles.tableRow}>
          <View style={styles.description}>
            <Text style={[styles.tableCell, { fontWeight: 'bold', marginBottom: 4 }]}>
              {data.property.name}
            </Text>
            <Text style={[styles.tableCell, { color: '#6b7280' }]}>
              Accommodation for {data.booking.guests} guest{data.booking.guests > 1 ? 's' : ''} • {data.booking.nights} night{data.booking.nights > 1 ? 's' : ''}
            </Text>
            {data.property.address && (
              <Text style={[styles.tableCell, { color: '#6b7280', fontSize: 9 }]}>
                {data.property.address}
              </Text>
            )}
          </View>
          <View style={styles.dates}>
            <Text style={styles.tableCell}>
              {format(new Date(data.booking.checkIn), 'dd/MM/yyyy')}
            </Text>
            <Text style={[styles.tableCell, { color: '#6b7280' }]}>to</Text>
            <Text style={styles.tableCell}>
              {format(new Date(data.booking.checkOut), 'dd/MM/yyyy')}
            </Text>
          </View>
          <View style={styles.amount}>
            <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>
              €{data.amounts.subtotal.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {/* Totals */}
      <View style={styles.totalsSection}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal:</Text>
          <Text style={styles.totalValue}>€{data.amounts.subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>VAT (24%):</Text>
          <Text style={styles.totalValue}>€{data.amounts.tax.toFixed(2)}</Text>
        </View>
        <View style={styles.grandTotalRow}>
          <Text style={styles.grandTotalLabel}>TOTAL:</Text>
          <Text style={styles.grandTotalValue}>€{data.amounts.total.toFixed(2)}</Text>
        </View>
      </View>

      {/* Payment Information */}
      <View style={styles.paymentInfo}>
        <Text style={styles.paymentTitle}>Payment Information</Text>
        <Text style={styles.paymentText}>
          Payment has been processed securely via Stripe.{'\n'}
          Thank you for choosing Habitat Lobby for your accommodation needs.{'\n'}
          For any questions, please contact us at info@habitatlobby.com
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          This invoice was generated electronically and is valid without signature.{'\n'}
          Habitat Lobby • Thessaloniki, Greece • VAT: GR123456789{'\n'}
          Thank you for your business!
        </Text>
      </View>
    </Page>
  </Document>
);

export { CustomInvoiceDocument, type InvoiceData };
