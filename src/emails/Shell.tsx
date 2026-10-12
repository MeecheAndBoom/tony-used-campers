import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";
import { SITE } from "@/lib/constants";
import type { SiteInfo } from "@/lib/settings";
import { siteOrigin } from "@/lib/seo";

const siteUrl = siteOrigin();

const theme = {
  ink: "#1d1d1f",
  muted: "#6e6e73",
  alt: "#f5f5f7",
  line: "#d2d2d7",
  accent: "#0071e3",
} as const;

/** Apple-order-email shell: white card on #f5f5f7, logo left, ref right. */
export function EmailShell({
  preview,
  heading,
  reference,
  children,
  footerNote,
  site = SITE as unknown as SiteInfo,
}: {
  preview: string;
  heading: string;
  /** Order reference shown top-right, e.g. "TUC-ABC123". */
  reference?: string;
  children: ReactNode;
  footerNote?: string;
  site?: SiteInfo;
}) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: theme,
              fontFamily: {
                sans: [
                  "-apple-system",
                  "BlinkMacSystemFont",
                  "SF Pro Text",
                  "Helvetica Neue",
                  "Helvetica",
                  "Arial",
                  "sans-serif",
                ],
              },
            },
          },
        }}
      >
        <Body className="m-0 bg-alt font-sans text-ink">
          <Container className="mx-auto max-w-[600px] bg-white px-5 py-8">
            {/* Header: logo left, reference right */}
            <Section className="flex items-center justify-between">
              <Link href={siteUrl} className="no-underline">
                <Img
                  src="https://res.cloudinary.com/qkbrqtav/image/upload/tuc/tony-campers-logo.png"
                  alt={site.name}
                  width={2117}
                  height={743}
                  style={{ width: "auto", height: 32 }}
                />
              </Link>
              {reference ? (
                <Text className="m-0 text-[13px] text-muted">{reference}</Text>
              ) : null}
            </Section>

            <Hr className="my-6 border-0 border-t border-line" />

            <Heading className="m-0 text-[24px] font-semibold leading-tight tracking-[-0.02em] text-ink">
              {heading}
            </Heading>

            <Section className="mt-4">{children}</Section>

            <Hr className="my-7 border-0 border-t border-line" />

            <Section>
              {footerNote ? (
                <Text className="m-0 mb-3 text-[13px] leading-relaxed text-muted">
                  {footerNote}
                </Text>
              ) : null}
              <Text className="m-0 text-[13px] leading-relaxed text-muted">
                {site.name} · {site.address} · {site.phone}
              </Text>
              <Text className="m-0 mt-2 text-[12px] text-muted">
                © {new Date().getFullYear()} {site.name}. All rights reserved.
                {" · "}
                <Link href={`${siteUrl}/legal/privacy`} className="text-muted underline">
                  Privacy
                </Link>
                {" · "}
                <Link href={`${siteUrl}/legal/terms`} className="text-muted underline">
                  Terms
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

/** Blue pill CTA matching the site's .btn-primary. */
export function EmailButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Section className="mt-6">
      <Link
        href={href}
        className="inline-block rounded-full bg-accent px-7 py-3.5 text-[15px] font-medium text-white no-underline"
      >
        {children}
      </Link>
    </Section>
  );
}

/** Label/value row separated by hairlines — used for totals and details. */
export function DetailRow({
  label,
  value,
  strong,
}: {
  label: string;
  value: ReactNode;
  strong?: boolean;
}) {
  return (
    <Section className="flex items-baseline justify-between border-b border-line py-3">
      <Text className={`m-0 text-[14px] ${strong ? "font-semibold text-ink" : "text-muted"}`}>
        {label}
      </Text>
      <Text
        className={`m-0 text-right text-[14px] ${
          strong ? "font-semibold text-ink" : "text-ink"
        }`}
      >
        {value}
      </Text>
    </Section>
  );
}

export function EmailBody({ children }: { children: ReactNode }) {
  return (
    <Text className="m-0 mt-3 text-[15px] leading-[1.55] text-muted">{children}</Text>
  );
}
