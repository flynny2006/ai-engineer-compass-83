
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"
import { cn } from "@/lib/utils";

const AspectRatio = ({ 
  ratio = 16 / 9, 
  className, 
  children, 
  ...props 
}: AspectRatioPrimitive.AspectRatioProps & { className?: string }) => (
  <AspectRatioPrimitive.Root 
    ratio={ratio} 
    className={cn("relative overflow-hidden rounded-lg", className)} 
    {...props}
  >
    {children}
  </AspectRatioPrimitive.Root>
);

export { AspectRatio }
