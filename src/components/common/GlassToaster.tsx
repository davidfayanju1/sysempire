// The single place every toast in the app is styled.
//
// Sonner's own box styling is switched off (`unstyled`), so the smoked-glass
// treatment lives in one CSS block in App.css. That keeps the pseudo-element
// eyebrow ("CONFIRMED" / "ATTENTION") and the backdrop filter in stylesheet
// territory rather than inline styles. Animations are untouched by `unstyled`.
import { Toaster } from "sonner";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const Check = () => (
  <svg viewBox="0 0 20 20" width="18" height="18" {...stroke} aria-hidden="true">
    <circle cx="10" cy="10" r="8.4" opacity={0.35} />
    <path d="M6 10.3 L8.8 13 L14.2 7.2" />
  </svg>
);

const Alert = () => (
  <svg viewBox="0 0 20 20" width="18" height="18" {...stroke} aria-hidden="true">
    <circle cx="10" cy="10" r="8.4" opacity={0.35} />
    <path d="M10 5.8 L10 10.8" />
    <path d="M10 13.8 L10 14" />
  </svg>
);

const Info = () => (
  <svg viewBox="0 0 20 20" width="18" height="18" {...stroke} aria-hidden="true">
    <circle cx="10" cy="10" r="8.4" opacity={0.35} />
    <path d="M10 9.2 L10 14.2" />
    <path d="M10 6 L10 6.2" />
  </svg>
);

const Warning = () => (
  <svg viewBox="0 0 20 20" width="18" height="18" {...stroke} aria-hidden="true">
    <path d="M10 3.2 L18 16.4 L2 16.4 Z" opacity={0.35} />
    <path d="M10 8 L10 12" />
    <path d="M10 14 L10 14.2" />
  </svg>
);

const Loading = () => (
  <svg
    viewBox="0 0 20 20"
    width="18"
    height="18"
    {...stroke}
    aria-hidden="true"
    className="sys-toast-spin"
  >
    <circle cx="10" cy="10" r="8.4" opacity={0.25} />
    <path d="M18.4 10 A8.4 8.4 0 0 0 10 1.6" />
  </svg>
);

const GlassToaster = () => (
  <Toaster
    position="bottom-right"
    duration={4000}
    gap={12}
    offset={28}
    visibleToasts={3}
    icons={{
      success: <Check />,
      error: <Alert />,
      info: <Info />,
      warning: <Warning />,
      loading: <Loading />,
    }}
    toastOptions={{
      unstyled: true,
      classNames: {
        toast: "sys-toast",
        title: "sys-toast-title",
        description: "sys-toast-description",
        actionButton: "sys-toast-action",
        cancelButton: "sys-toast-cancel",
        closeButton: "sys-toast-close",
      },
    }}
  />
);

export default GlassToaster;
