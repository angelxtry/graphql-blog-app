export interface ErrorType {
  __typename: string;
  message: string;
}

export interface PaginationInput {
  pagination: {
    limit: number;
    page: number;
  };
}
