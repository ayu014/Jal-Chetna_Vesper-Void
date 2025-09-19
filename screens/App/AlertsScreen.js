// AlertsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { supabase } from '../../services/supabase';

// ✅ Format UTC time in "YYYY-MM-DD HH:mm:ss+00"
const formatUTC = (dateString) => {
  const d = new Date(dateString);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const min = String(d.getUTCMinutes()).padStart(2, "0");
  const ss = String(d.getUTCSeconds()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}+00`;
};

const AlertsScreen = () => {
  const [alerts, setAlerts] = useState([]);

  // Fetch only today's alerts
  useEffect(() => {
    const fetchAlerts = async () => {
      const today = new Date();
      const yyyy = today.getUTCFullYear();
      const mm = String(today.getUTCMonth() + 1).padStart(2, "0");
      const dd = String(today.getUTCDate()).padStart(2, "0");

      const startOfDay = `${yyyy}-${mm}-${dd}T00:00:00.000Z`;
      const endOfDay = `${yyyy}-${mm}-${dd}T23:59:59.999Z`;

      const { data, error } = await supabase
        .from("live_station_data")
        .select("*")
        .or("hgi_status.ilike.Yellow,hgi_status.ilike.Red")
        .gte("last_reading_time", startOfDay)
        .lte("last_reading_time", endOfDay);

      if (error) {
        console.error("Error fetching alerts:", error);
        return;
      }

      const formatted = data.map((row) => ({
        id: row.id,
        title: `Station ${row.name} Alert`,
        description: `HGI is ${row.hgi_status.toUpperCase()} at level ${row.water_level}.`,
        severity: row.hgi_status.toLowerCase() === "red" ? "Critical" : "Warning",
        time: formatUTC(row.last_reading_time),
      }));

      setAlerts(formatted);
    };

    fetchAlerts();
  }, []);

  // Realtime listener for new alerts today
  useEffect(() => {
    const channel = supabase
      .channel("station-alerts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "live_station_data" },
        (payload) => {
          const row = payload.new;
          const today = new Date();
          const yyyy = today.getUTCFullYear();
          const mm = String(today.getUTCMonth() + 1).padStart(2, "0");
          const dd = String(today.getUTCDate()).padStart(2, "0");
          const todayStr = `${yyyy}-${mm}-${dd}`;

          const rowDate = new Date(row.last_reading_time)
            .toISOString()
            .split("T")[0];

          if (
            ["yellow", "red"].includes(row.hgi_status?.toLowerCase()) &&
            rowDate === todayStr
          ) {
            const newAlert = {
              id: row.id,
              title: `Station ${row.name} Alert`,
              description: `HGI is ${row.hgi_status.toUpperCase()} at level ${row.water_level}.`,
              severity: row.hgi_status.toLowerCase() === "red" ? "Critical" : "Warning",
              time: formatUTC(row.last_reading_time),
            };

            setAlerts((prev) => {
              const filtered = prev.filter((a) => a.id !== row.id); // keep latest per station
              return [newAlert, ...filtered];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Today's Alerts</Text>
      {alerts.length === 0 ? (
        <Text style={styles.noAlerts}>✅ No alerts for today</Text>
      ) : (
        <FlatList
          data={alerts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.alertCard}>
              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={24}
                color={item.severity === "Critical" ? "red" : COLORS.primary}
              />
              <View style={styles.alertText}>
                <Text style={styles.alertTitle}>{item.title}</Text>
                <Text style={styles.alertDescription}>{item.description}</Text>
                <Text style={styles.alertTime}>{item.time}</Text>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FDFEFE" },
  header: { fontSize: 24, fontWeight: "700", marginBottom: 20, color: COLORS.primary },
  alertCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#FFF",
    borderRadius: 10,
    elevation: 3,
  },
  alertText: { marginLeft: 10, flex: 1 },
  alertTitle: { fontSize: 16, fontWeight: "600", marginBottom: 5 },
  alertDescription: { fontSize: 14, color: "#555" },
  alertTime: { fontSize: 12, color: "#888", marginTop: 4 },
  noAlerts: { fontSize: 16, color: "#888", textAlign: "center", marginTop: 20 },
});

export default AlertsScreen;
