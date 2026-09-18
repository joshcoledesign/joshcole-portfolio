import type { SVGProps } from "react";

type WorkflowIconProps = SVGProps<SVGSVGElement> & {
  title?: string;
};

function accessibilityProps(title?: string) {
  return title
    ? { role: "img" as const, "aria-label": title }
    : { "aria-hidden": true as const };
}

/** Monochrome interpretation of the current Microsoft Teams mark. */
export function TeamsIcon({ title, ...props }: WorkflowIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...accessibilityProps(title)}
      {...props}
    >
      <path
        d="M22 20h12a6 6 0 0 1 6 6v10a6 6 0 0 1-12 0V26a6 6 0 0 0-6-6Z"
        opacity="0.55"
      />
      <path
        d="M8 24a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v12a6 6 0 0 0 6 6H18A10 10 0 0 1 8 32v-8Z"
        opacity="0.8"
      />
      <circle cx="33" cy="13" r="5" opacity="0.55" />
      <circle cx="18" cy="10" r="6" opacity="0.8" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.25 23h9.5A3.25 3.25 0 0 1 20 26.25v9.5A3.25 3.25 0 0 1 16.75 39h-9.5A3.25 3.25 0 0 1 4 35.75v-9.5A3.25 3.25 0 0 1 7.25 23Zm1.27 3.429v1.676h2.447v7.466h2.065v-7.466h2.447v-1.676H8.52Z"
      />
    </svg>
  );
}

/** Monochrome interpretation of the current Microsoft Copilot mark. */
export function CopilotIcon({ title, ...props }: WorkflowIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      fillRule="evenodd"
      xmlns="http://www.w3.org/2000/svg"
      {...accessibilityProps(title)}
      {...props}
    >
      <path d="M9 23l.073-.001a2.53 2.53 0 0 1-2.347-1.838l-.697-2.433a2.529 2.529 0 0 0-2.426-1.839h-.497l-.104-.002c-4.485 0-2.935-5.278-1.75-9.225l.162-.525C2.412 3.99 3.883 1 6.25 1h8.86c1.12 0 2.106.745 2.422 1.829l.715 2.453a2.53 2.53 0 0 0 2.247 1.823l.147.005.534.001c3.557.115 3.088 3.745 2.156 7.206l-.113.413c-.154.548-.315 1.089-.47 1.607l-.163.525C21.588 20.01 20.116 23 17.75 23H9Zm8.22-15.89-3.856.001a2.526 2.526 0 0 0-2.35 1.615L9.21 15.04a2.529 2.529 0 0 1-2.43 1.847l3.853.002c1.056 0 1.992-.661 2.361-1.644l1.796-6.287a2.529 2.529 0 0 1 2.43-1.848Z" />
    </svg>
  );
}

/** Single-color, layered version of the Microsoft Power Automate mark. */
export function PowerAutomateIcon({ title, ...props }: WorkflowIconProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...accessibilityProps(title)}
      {...props}
    >
      <path
        d="M52.509 3c2.857 0 5.577 1.221 7.474 3.356l22.675 25.509c6.253 7.034 2.343 18.201-6.933 19.798L21.5 61l6.8-7.687a8 8 0 0 0-.013-10.615L7.794 19.644C2.062 13.195 6.64 3 15.268 3h37.241Z"
        opacity="0.58"
      />
      <path
        d="M15.268 93C6.64 93 2.062 82.805 7.794 76.356l51.3-57.712a10 10 0 0 0 0-13.288L57 3l34.095 38.356a10 10 0 0 1 0 13.288l-31.112 35A10 10 0 0 1 52.509 93H15.268Z"
        opacity="0.82"
      />
      <path d="M38.361 93c-5.177 0-7.924-6.117-4.484-9.986l41.218-46.37a10 10 0 0 0 0-13.288L71 18.75l20.095 22.606a10 10 0 0 1 0 13.288l-31.112 35A10 10 0 0 1 52.509 93H38.361Z" />
    </svg>
  );
}

export function DocumentIcon({ title, ...props }: WorkflowIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      {...accessibilityProps(title)}
      {...props}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6M8 13h8M8 17h6" />
    </svg>
  );
}

export function UserIcon({ title, ...props }: WorkflowIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      {...accessibilityProps(title)}
      {...props}
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}
