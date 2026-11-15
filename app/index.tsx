import { useMemo, useState } from "react";
import type { ReactElement } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import {
  AppText,
  Badge,
  Button,
  Card,
  Screen,
  TextField,
} from "@/components/ui";
import type { BadgeVariant } from "@/components/ui";
import { colors, spacing } from "@/theme";

interface FakeRow {
  id: string;
  title: string;
  category: string;
  amountMinor: number;
  date: string;
  type: "income" | "expense";
}

/**
 * Temporary demo screen for Step 1.3 (Inputs and lists).
 * Demonstrates controlled TextField (valid and error states), Badge, Card,
 * and a 200-row virtualized FlatList.
 * Removed in Step 2.1.
 */
export default function IndexRoute(): ReactElement {
  const [categoryName, setCategoryName] = useState("Groceries");
  const [expectedAmount, setExpectedAmount] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Fake dataset of 200 rows for virtualization testing
  const fakeRows: FakeRow[] = useMemo(() => {
    return Array.from({ length: 200 }, (_, index) => {
      const rowNumber = index + 1;
      const isIncome = rowNumber % 5 === 0;
      return {
        id: `txn-${rowNumber}`,
        title: isIncome ? `Salary / Client #${rowNumber}` : `Expense #${rowNumber}`,
        category: isIncome ? "Income" : rowNumber % 2 === 0 ? "Groceries" : "Transport",
        amountMinor: (rowNumber * 1500) % 50000 + 1000,
        date: "2026-11-15",
        type: isIncome ? "income" : "expense",
      };
    });
  }, []);

  const amountError = useMemo(() => {
    if (!expectedAmount.trim()) {
      return "Amount is required";
    }
    if (!/^\d+$/.test(expectedAmount.trim())) {
      return "Amount must contain integer numbers only";
    }
    return undefined;
  }, [expectedAmount]);

  const handleSubmit = (): void => {
    setSubmitted(true);
  };

  const renderHeader = (): ReactElement => {
    return (
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <AppText style={styles.brandTitle} variant="title">
            Pennywise
          </AppText>
          <AppText variant="label">Phase 1 — Inputs & Lists Demo</AppText>
        </View>

        <Card padding="md" style={styles.formCard} variant="default">
          <AppText style={styles.sectionHeading} variant="label">
            Controlled TextFields & Validation
          </AppText>

          <TextField
            accessibilityHint="Enter name for the category"
            autoCapitalize="words"
            helperText="Valid state: Category name"
            label="Category Name"
            onChangeText={setCategoryName}
            placeholder="e.g. Groceries"
            value={categoryName}
          />

          <TextField
            accessibilityHint="Enter integer minor amount for the budget"
            error={submitted ? amountError : undefined}
            helperText={submitted ? undefined : "Enter numbers only (triggers error if empty or non-numeric)"}
            keyboardType="number-pad"
            label="Monthly Expected Amount"
            onChangeText={setExpectedAmount}
            placeholder="e.g. 25000"
            value={expectedAmount}
          />

          <Button
            accessibilityHint="Submits form to validate the amount field"
            onPress={handleSubmit}
            style={styles.submitButton}
            title="Validate Form"
            variant="primary"
          />
        </Card>

        <Card padding="md" style={styles.badgesCard} variant="outlined">
          <AppText style={styles.sectionHeading} variant="label">
            Badge Semantic Variants
          </AppText>
          <View style={styles.badgesRow}>
            <Badge label="Income" variant="income" />
            <Badge label="Expense" variant="expense" />
            <Badge label="Warning" variant="warning" />
            <Badge label="Info" variant="info" />
            <Badge label="Neutral" variant="neutral" />
          </View>
        </Card>

        <View style={styles.listHeaderTitle}>
          <AppText style={styles.listSectionTitle} variant="label">
            Virtualized List (200 Items)
          </AppText>
        </View>
      </View>
    );
  };

  const renderItem = ({ item }: { item: FakeRow }): ReactElement => {
    const badgeVariant: BadgeVariant =
      item.type === "income" ? "income" : "expense";
    const amountPrefix = item.type === "income" ? "+" : "-";

    return (
      <Card padding="sm" style={styles.rowCard} variant="default">
        <View style={styles.rowContent}>
          <View style={styles.rowLeft}>
            <AppText style={styles.itemTitle} variant="body">
              {item.title}
            </AppText>
            <View style={styles.rowMeta}>
              <Badge label={item.category} size="sm" variant={badgeVariant} />
              <AppText style={styles.itemDate} variant="label">
                {item.date}
              </AppText>
            </View>
          </View>

          <View style={styles.rowRight}>
            <AppText style={styles.itemAmount} variant="mono">
              {amountPrefix}MYR {(item.amountMinor / 100).toFixed(2)}
            </AppText>
          </View>
        </View>
      </Card>
    );
  };

  const renderSeparator = (): ReactElement => {
    return <View style={styles.separator} />;
  };

  const renderEmpty = (): ReactElement => {
    return (
      <View style={styles.emptyContainer}>
        <AppText variant="body">No rows found.</AppText>
      </View>
    );
  };

  return (
    <Screen keyboardAvoiding={true} scrollable={false}>
      <FlatList
        ListEmptyComponent={renderEmpty}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        data={fakeRows}
        initialNumToRender={15}
        ItemSeparatorComponent={renderSeparator}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        maxToRenderPerBatch={10}
        renderItem={renderItem}
        windowSize={5}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: spacing.md,
  },
  header: {
    marginBottom: spacing.sm,
  },
  titleSection: {
    marginBottom: spacing.md,
  },
  brandTitle: {
    marginBottom: spacing.xxs,
  },
  formCard: {
    marginBottom: spacing.md,
  },
  badgesCard: {
    marginBottom: spacing.md,
  },
  sectionHeading: {
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  submitButton: {
    marginTop: spacing.xs,
  },
  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  listHeaderTitle: {
    paddingVertical: spacing.xs,
  },
  listSectionTitle: {
    color: colors.textSecondary,
  },
  rowCard: {
    borderColor: colors.border,
  },
  rowContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowLeft: {
    flex: 1,
  },
  rowRight: {
    marginLeft: spacing.sm,
    alignItems: "flex-end",
  },
  rowMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.xxs,
  },
  itemTitle: {
    fontWeight: "500",
  },
  itemDate: {
    color: colors.textTertiary,
  },
  itemAmount: {
    fontWeight: "600",
  },
  separator: {
    height: spacing.xs,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
});
