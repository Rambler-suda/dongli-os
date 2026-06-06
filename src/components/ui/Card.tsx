import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  tone?: "default" | "pear" | "soft";
};

export function Card({
  children,
  className = "",
  tone = "default",
  ...props
}: CardProps) {
  return (
    <article className={`card card--${tone} ${className}`.trim()} {...props}>
      {children}
    </article>
  );
}
