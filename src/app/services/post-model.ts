export interface Post {
    id?: number;
    userId: number;
    title: string;
    content: string;
    timestamp?: Date;
    comments?: Comment[];
  }
  