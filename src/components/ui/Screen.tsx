import type { ReactElement, ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/theme";

export type ScreenEdge = "top" | "bottom" | "left" | "right";

export interface ScreenProps {
  children: ReactNode;
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  keyboardAvoiding?: boolean;
  keyboardOffset?: number;
  edges?: readonly ScreenEdge[];
}

const DEFAULT_EDGES: readonly ScreenEdge[] = ["top", "bottom", "left", "right"];

export function Screen({
  children,
  scrollable = false,
  style,
  contentContainerStyle,
  keyboardAvoiding = true,
  keyboardOffset = 0,
  edges = DEFAULT_EDGES,
}: ScreenProps): ReactElement {
  const insets = useSafeAreaInsets();

  const insetPadding: ViewStyle = {
    paddingTop: edges.includes("top") ? insets.top : 0,
    paddingBottom: edges.includes("bottom") ? insets.bottom : 0,
    paddingLeft: edges.includes("left") ? insets.left : 0,
    paddingRight: edges.includes("right") ? insets.right : 0,
  };

  const body = scrollable ? (
    <ScrollView
      style={[styles.container, style]}
      contentContainerStyle={[insetPadding, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.container, insetPadding, style]}>{children}</View>
  );

  if (!keyboardAvoiding) {
    return body;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={keyboardOffset}
      style={styles.keyboardAvoiding}
    >
      {body}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoiding: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
