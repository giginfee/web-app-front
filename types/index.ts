export enum IssueCategory {
  DB = "database",
  JS = "javascript",
  JAVA = "java",
  PYTHON = "python",
  C_PLUS_PLUS = "c++",
  C_SHARP = "c#",
}

export const categoriesTitles: Record<IssueCategory, string> = {
  [IssueCategory.DB]: "База даних",
  [IssueCategory.JS]: "Javascript",
  [IssueCategory.JAVA]: "Java",
  [IssueCategory.PYTHON]: "Python",
  [IssueCategory.C_PLUS_PLUS]: "C++",
  [IssueCategory.C_SHARP]: "C#",
};

export const categories = Object.values(IssueCategory).map((category) => ({
  title: categoriesTitles[category],
  value: category,
}));

export const categoriesBgColors: Record<IssueCategory, string> = {
  [IssueCategory.DB]: "red",
  [IssueCategory.JS]: "green",
  [IssueCategory.JAVA]: "yellow",
  [IssueCategory.PYTHON]: "blue",
  [IssueCategory.C_PLUS_PLUS]: "purple",
  [IssueCategory.C_SHARP]: "pink",
};

export type Issue = {
  id: number;
  title: string;
  body: string;
  category: IssueCategory;
  userId: number;
  isResolved: boolean;
  isActive: boolean;
  user: { name: string };
  createdAt?: string;
};

export type Issues = {
  total: number;
  issues: Issue[];
};

export type Comment = {
  id?: number;
  userId?: number;
  issueId?: number;
  body: string;
  user?: { name: string };
  createdAt?: string;
};
export type Comments = {
  total: number;
  comments: Comment[];
};

export type ApiError = {
  message: string;
};

export type IsLoading = {
  isLoading: true;
};

export type ApiResultStatus = {
  status: "success" | "error";
  message: string;
};
