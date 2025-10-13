import React from "react";
import { Link } from "@inertiajs/react";

interface TextLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function TextLink({ href, children, className = "" }: TextLinkProps) {
  return (
    <Link
      href={href}
      className={`text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-150 ${className}`}
    >
      {children}
    </Link>
  );
}
