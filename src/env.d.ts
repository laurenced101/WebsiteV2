/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    /** Set by the /studies middleware: true → render the password gate instead of content. */
    studiesGate?: boolean;
    /** Set when a submitted /studies password was wrong → show the gate error. */
    studiesAuthError?: boolean;
  }
}
