import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica" },
  header: { marginBottom: 24 },
  title: { fontSize: 22, fontWeight: "bold", color: "#1e1b4b" },
  subtitle: { fontSize: 12, color: "#6b7280", marginTop: 4 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 13, fontWeight: "bold", color: "#1e1b4b", marginBottom: 8, borderBottomWidth: 1, borderBottomColor: "#e5e7eb", paddingBottom: 4 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
  label: { color: "#6b7280" },
  value: { fontWeight: "bold", color: "#111827" },
  table: { marginTop: 8 },
  tableHeader: { flexDirection: "row", backgroundColor: "#f3f4f6", padding: 6, fontSize: 10, fontWeight: "bold", color: "#374151" },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#f3f4f6", padding: 6, fontSize: 10 },
  colName: { flex: 3 },
  colAge: { flex: 1, textAlign: "center" },
  colGender: { flex: 1, textAlign: "center" },
  colPhone: { flex: 2, textAlign: "right" },
  footer: { marginTop: 32, borderTopWidth: 1, borderTopColor: "#e5e7eb", paddingTop: 12, fontSize: 9, color: "#9ca3af", textAlign: "center" },
  badge: { fontSize: 10, color: "#7c3aed", marginTop: 4 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8, borderTopWidth: 1, borderTopColor: "#d1d5db", paddingTop: 6 },
  totalLabel: { fontSize: 14, fontWeight: "bold", color: "#111827" },
  totalValue: { fontSize: 14, fontWeight: "bold", color: "#7c3aed" },
});

interface BookingPDFProps {
  bookingId: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  listingTitle: string;
  listingType: string;
  departAt: string;
  returnAt: string;
  travelers: { full_name: string; age: number; gender: string; phone?: string }[];
  baseAmount: number;
  gstAmount: number;
  gstPercent: number;
  totalAmount: number;
  status: string;
}

export function BookingConfirmationPDF({
  bookingId,
  contactName,
  contactEmail,
  contactPhone,
  listingTitle,
  listingType,
  departAt,
  returnAt,
  travelers,
  baseAmount,
  gstAmount,
  gstPercent,
  totalAmount,
  status,
}: BookingPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Booking Confirmation</Text>
          <Text style={styles.subtitle}>HolidayHub — {listingType === "package" ? "Weekend Trip" : "Activity"}</Text>
          <Text style={styles.badge}>Booking ID: {bookingId.slice(0, 8)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lead Contact</Text>
          <View style={styles.row}><Text style={styles.label}>Name</Text><Text style={styles.value}>{contactName}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Email</Text><Text style={styles.value}>{contactEmail}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Phone</Text><Text style={styles.value}>{contactPhone}</Text></View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trip Details</Text>
          <View style={styles.row}><Text style={styles.label}>Listing</Text><Text style={styles.value}>{listingTitle}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Departure</Text><Text style={styles.value}>{new Date(departAt).toLocaleString("en-IN")}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Return</Text><Text style={styles.value}>{new Date(returnAt).toLocaleString("en-IN")}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Status</Text><Text style={styles.value}>{status.replace("_", " ")}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Guests</Text><Text style={styles.value}>{travelers.length}</Text></View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Traveler Manifest</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.colName}>Name</Text>
              <Text style={styles.colAge}>Age</Text>
              <Text style={styles.colGender}>Gender</Text>
              <Text style={styles.colPhone}>Phone</Text>
            </View>
            {travelers.map((t, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.colName}>{t.full_name}</Text>
                <Text style={styles.colAge}>{t.age}</Text>
                <Text style={styles.colGender}>{t.gender}</Text>
                <Text style={styles.colPhone}>{t.phone ?? "—"}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          <View style={styles.row}><Text style={styles.label}>Base Amount</Text><Text style={styles.value}>₹{baseAmount.toLocaleString("en-IN")}</Text></View>
          <View style={styles.row}><Text style={styles.label}>GST ({gstPercent}%)</Text><Text style={styles.value}>₹{gstAmount.toLocaleString("en-IN")}</Text></View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{totalAmount.toLocaleString("en-IN")}</Text>
          </View>
        </View>

        <Text style={styles.footer}>HolidayHub — Generated on {new Date().toLocaleDateString("en-IN")} · Contact support@holidayhub.in</Text>
      </Page>
    </Document>
  );
}
