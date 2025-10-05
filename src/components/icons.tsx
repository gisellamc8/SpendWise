import { Leaf, Wallet } from 'lucide-react';
import type { SVGProps } from 'react';

export const AppLogo = (props: SVGProps<SVGSVGElement>) => {
  return (
    <div className="relative" style={{ width: props.width, height: props.height }}>
      <Wallet {...props} className="text-primary" />
      <Leaf
        className="absolute text-green-500"
        style={{
          width: `calc(${props.width}px * 0.5)`,
          height: `calc(${props.height}px * 0.5)`,
          top: '-5%',
          right: '-10%',
        }}
      />
    </div>
  );
};
