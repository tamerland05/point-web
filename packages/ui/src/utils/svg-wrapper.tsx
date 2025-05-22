import type { SVGAttributes } from "react";

import { memo } from "react";

export type SvgProps = SVGAttributes<SVGSVGElement>;

export const Svg: React.FC<SvgProps> = memo(({ children, ...otherProps }) => (
  <svg width="20px" xmlns="http://www.w3.org/2000/svg" {...otherProps}>
    {children}
  </svg>
));

Svg.displayName = "SvgWrapper";
