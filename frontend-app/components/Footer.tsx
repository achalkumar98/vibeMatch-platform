"use client";

import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="vm-footer">
      <div className="vm-footer__inner">
        {/* ── Brand ─────────────────────────────────────────────────────── */}
        <div className="vm-footer__brand">
          <Image
            src="/assets/vibeMatch-logo.png"
            alt="VibeMatch logo"
            width={24}
            height={24}
            className="vm-footer__logo-img"
          />
          <span className="vm-footer__brand-name">VibeMatch</span>
          <span className="vm-footer__dot" aria-hidden>·</span>
          <span className="vm-footer__copy">
            © {new Date().getFullYear()} All rights reserved
          </span>
        </div>

        {/* ── Nav + Socials ─────────────────────────────────────────────── */}
        <nav className="vm-footer__nav" aria-label="Footer navigation">
          <Link href="/feed"    className="vm-footer__link">Feed</Link>
          <Link href="/premium" className="vm-footer__link">Premium</Link>

          <div className="vm-footer__socials">
            <a
              href="https://github.com/achalkumar98"
              target="_blank"
              rel="noopener noreferrer"
              className="vm-footer__social-icon"
              aria-label="GitHub profile"
            >
              <Github size={16} strokeWidth={1.8} aria-hidden />
            </a>
            <a
              href="https://www.linkedin.com/in/achalkumar1998"
              target="_blank"
              rel="noopener noreferrer"
              className="vm-footer__social-icon vm-footer__social-icon--linkedin"
              aria-label="LinkedIn profile"
            >
              <Linkedin size={16} strokeWidth={1.8} aria-hidden />
            </a>
            <a
              href="https://www.instagram.com/achal.pand98"
              target="_blank"
              rel="noopener noreferrer"
              className="vm-footer__social-icon vm-footer__social-icon--instagram"
              aria-label="Instagram profile"
            >
              <Instagram size={16} strokeWidth={1.8} aria-hidden />
            </a>
          </div>
        </nav>
      </div>
    </footer>
  );
}
