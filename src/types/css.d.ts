// This allows importing CSS files directly
declare module "*.css" {
  const content: string;
  export default content;
}
