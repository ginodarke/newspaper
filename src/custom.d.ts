/**
 * Type definitions for resolving TypeScript module errors in Render deployment
 */

// Add explicit declarations for file extensions
declare module "*.svg" {
  const content: any;
  export default content;
}

declare module "*.png" {
  const content: any;
  export default content;
}

declare module "*.jpg" {
  const content: any;
  export default content;
}

// Add explicit declarations for project structure
declare module "src/components/*" {
  const content: any;
  export default content;
}

declare module "src/contexts/*" {
  const content: any;
  export default content;
}

declare module "src/pages/*" {
  const content: any;
  export default content;
}

declare module "src/services/*" {
  const content: any;
  export default content;
} 