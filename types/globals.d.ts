export {};

// Create a type for the roles
export type Roles = "admin" | "moderator";
declare module "*.pdf";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }

  interface Book {
    id: number;
    title: string;
    author: string;
    genre: string;
    isbn: string;
    rating: number;
    total_copies: number;
    available_copies: number;
    description: string;
    color: string;
    cover: string;
    summary: string;
  }
}


declare module "pdfjs-dist/build/pdf.worker.min.js?url" {
  const workerSrc: string;
  export default workerSrc;
}
