import type { ReactElement } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function IndexRoute(): ReactElement {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>Pennywise</Text>
        <Text style={styles.stepTitle}>Phase 1 — Foundation: Layout & Flexbox</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeading}>Flexbox Demo: Row Layout</Text>
        <Text style={styles.description}>
          The container below uses flexDirection: &quot;row&quot; with justifyContent:
          &quot;space-between&quot;.
        </Text>

        <View style={styles.rowDemo}>
          <View style={styles.box}>
            <Text style={styles.boxLabel}>Box 1</Text>
          </View>
          <View style={styles.box}>
            <Text style={styles.boxLabel}>Box 2</Text>
          </View>
          <View style={styles.box}>
            <Text style={styles.boxLabel}>Box 3</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeading}>Layout Concept</Text>
        <Text style={styles.infoText}>
          1. React Native defaults to flexDirection: &quot;column&quot; (unlike web which defaults to
          &quot;row&quot;).
        </Text>
        <Text style={styles.infoText}>
          2. All numeric dimensions (like padding: 16) are density-independent units (dp/points).
        </Text>
        <Text style={styles.infoText}>
          3. Yoga calculates the layout in C++ before native views are drawn.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "white",
    padding: 24,
    justifyContent: "flex-start",
  },
  header: {
    marginBottom: 24,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "black",
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 16,
    color: "gray",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: "600",
    color: "black",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "dimgray",
    marginBottom: 12,
  },
  rowDemo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 8,
  },
  box: {
    width: 70,
    height: 70,
    backgroundColor: "aliceblue",
    borderWidth: 1,
    borderColor: "cornflowerblue",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  boxLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "darkblue",
  },
  infoText: {
    fontSize: 14,
    color: "dimgray",
    marginBottom: 6,
    lineHeight: 20,
  },
});
