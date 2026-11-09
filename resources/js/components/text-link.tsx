import React from "react";
import { Link, type InertiaLinkProps } from "@inertiajs/react";

interface TextLinkProps {
  href: NonNullable<InertiaLinkProps['href']> | string | { url: string } | any;
  children: React.ReactNode;
  className?: string;
  tabIndex?: number;
}

export default function TextLink({ href, children, className = "", tabIndex }: TextLinkProps) {
  const resolvedHref = typeof href === 'object' && href !== null && 'url' in href ? href.url : href;

  return (
    <Link
      href={resolvedHref}
      tabIndex={tabIndex}
      className={`text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors duration-150 ${className}`}
    >
      {children}
    </Link>
  );
}
