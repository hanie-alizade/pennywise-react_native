import type { components } from "./api.generated";

export type { components, paths } from "./api.generated";

export type Schemas = components["schemas"];

// Core domain & auth types
export type User = Schemas["User"];
export type Workspace = Schemas["Workspace"];
export type Me = Schemas["Me"];
export type Tokens = Schemas["Tokens"];
export type Credentials = Schemas["Credentials"];
export type AuthResponse = Schemas["AuthResponse"];

// Category types
export type CategoryType = Schemas["CategoryType"];
export type Subcategory = Schemas["Subcategory"];
export type Category = Schemas["Category"];
export type CategoryCreate = Schemas["CategoryCreate"];
export type SubcategoryCreate = Schemas["SubcategoryCreate"];
export type CategoryUpdate = Schemas["CategoryUpdate"];
export type SubcategoryUpdate = CategoryUpdate;

// Month & budget line types
export type YearMonth = Schemas["YearMonth"];
export type MonthRef = Schemas["MonthRef"];
export type MonthCreate = Schemas["MonthCreate"];
export type LineCreate = Schemas["LineCreate"];
export type LineRow = Schemas["LineRow"];
export type CategoryRow = Schemas["CategoryRow"];
export type Totals = Schemas["Totals"];
export type Section = Schemas["Section"];
export type MonthView = Schemas["MonthView"];

// Transaction types
export type Transaction = Schemas["Transaction"];
export type TransactionCreate = Schemas["TransactionCreate"];
export type TransactionUpdate = Schemas["TransactionUpdate"];

// Common scalar aliases
export type Money = Schemas["Money"];
export type NullableMoney = Schemas["NullableMoney"];
export type LocalDate = Schemas["LocalDate"];
export type ApiErrorResponse = Schemas["Error"];
