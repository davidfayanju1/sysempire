export type Error = {
  response: {
    data: {
      success: boolean;
      message: string;
      error: string;
      statusCode: number;
      timestamp: string;
    };
    status: number;
  };
};
