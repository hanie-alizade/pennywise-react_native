import type { ReactElement } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { useCategories } from "@/apiHooks";
import { StateBlock } from "@/components/common";
import { AppText, Badge, Card, Screen } from "@/components/ui";
import { getErrorMessage } from "@/helpers";
import { colors, spacing } from "@/theme";
import type { Category } from "@/types";

export default function CategoriesRoute(): ReactElement {
  const { data, isLoading, isError, error, refetch, isRefetching } =
    useCategories();

  const handleRefresh = (): void => {
    void refetch();
  };

  if (isLoading && !isRefetching) {
    return (
      <Screen style={styles.stateContainer}>
        <StateBlock
          message="Fetching categories from API..."
          type="loading"
        />
      </Screen>
    );
  }

  if (isError && (!data || data.length === 0)) {
    return (
      <Screen style={styles.stateContainer}>
        <StateBlock
          message={getErrorMessage(error)}
          onRetry={handleRefresh}
          title="Unable to load categories"
          type="error"
        />
      </Screen>
    );
  }

  const renderHeader = (): ReactElement => {
    return (
      <View style={styles.header}>
        <AppText style={styles.title} variant="title">
          Categories
        </AppText>
        <AppText style={styles.subtitle} variant="label">
          Budget hierarchy & groups
        </AppText>
      </View>
    );
  };

  const renderItem = ({ item }: { item: Category }): ReactElement => {
    const isIncome = item.type === "income";

    return (
      <Card padding="md" style={styles.categoryCard} variant="default">
        <View style={styles.categoryHeader}>
          <AppText style={styles.categoryName} variant="body">
            {item.name}
          </AppText>
          <Badge
            label={isIncome ? "Income" : "Expense"}
            size="sm"
            variant={isIncome ? "income" : "expense"}
          />
        </View>

        {item.subcategories && item.subcategories.length > 0 ? (
          <View style={styles.subcategoriesContainer}>
            <AppText style={styles.subcategoriesLabel} variant="label">
              Subcategories:
            </AppText>
            <View style={styles.subcategoriesList}>
              {item.subcategories.map((sub) => (
                <Badge
                  key={sub.id}
                  label={sub.name}
                  size="sm"
                  style={styles.subcategoryBadge}
                  variant="neutral"
                />
              ))}
            </View>
          </View>
        ) : (
          <AppText style={styles.noSubcategories} variant="label">
            No subcategories
          </AppText>
        )}
      </Card>
    );
  };

  const renderEmpty = (): ReactElement => {
    return (
      <StateBlock
        message="No categories returned by the server. Pull down to refresh."
        onRetry={handleRefresh}
        title="No categories"
        type="empty"
      />
    );
  };

  const renderSeparator = (): ReactElement => {
    return <View style={styles.separator} />;
  };

  return (
    <Screen keyboardAvoiding={false} scrollable={false}>
      <FlatList
        ItemSeparatorComponent={renderSeparator}
        ListEmptyComponent={renderEmpty}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        data={data ?? []}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            onRefresh={handleRefresh}
            refreshing={isRefetching}
            tintColor={colors.primary}
          />
        }
        renderItem={renderItem}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  stateContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: spacing.md,
  },
  header: {
    marginBottom: spacing.md,
  },
  title: {
    marginBottom: spacing.xxs,
  },
  subtitle: {
    color: colors.textSecondary,
  },
  categoryCard: {
    borderColor: colors.border,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryName: {
    fontWeight: "600",
    color: colors.textPrimary,
  },
  subcategoriesContainer: {
    marginTop: spacing.sm,
  },
  subcategoriesLabel: {
    color: colors.textSecondary,
    marginBottom: spacing.xxs,
  },
  subcategoriesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  subcategoryBadge: {
    marginRight: spacing.xxs,
    marginBottom: spacing.xxs,
  },
  noSubcategories: {
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  separator: {
    height: spacing.sm,
  },
});
