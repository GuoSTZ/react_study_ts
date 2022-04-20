/// <reference types="react-scripts" />
declare module "*.less" {
  const classes: { readonly [className: string]: string };
  export default classes;
}
