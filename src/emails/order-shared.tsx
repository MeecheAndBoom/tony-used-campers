import { Section, Text } from "@react-email/components";
import type { OrderRecord } from "@/lib/orders";
import { money } from "@/lib/format";
import { PAYMENT_METHODS, SITE } from "@/lib/constants";
import type { PaymentMethodSetting, SiteInfo } from "@/lib/settings";
import { DetailRow, EmailBody, EmailButton, EmailShell } from "./Shell";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function paymentLabel(
  order: OrderRecord,
  methods: PaymentMethodSetting[] = PAYMENT_METHODS as PaymentMethodSetting[],
) {
  if (order.payment.method === "other") {
    return order.payment.methodOther || order.payment.label || "Other";
  }
  const known = methods.find((m) => m.id === order.payment.method);
  return known?.label ?? order.payment.label;
}

export function ItemsRows({ order }: { order: OrderRecord }) {
  return (
    <Section>
      {order.items.map((item) => (
        <Section
          key={item.slug}
          className="flex items-center justify-between border-b border-line py-3"
        >
          <Text className="m-0 text-[14px] text-ink">
            {item.title}
            <span className="text-muted"> · Qty {item.qty}</span>
          </Text>
          <Text className="m-0 text-[14px] text-ink">
            {money(item.price * item.qty)}
          </Text>
        </Section>
      ))}
    </Section>
  );
}

export function TotalsRows({ order }: { order: OrderRecord }) {
  return (
    <Section className="mt-2">
      <DetailRow label="Subtotal" value={money(order.subtotal)} />
      <DetailRow
        label={order.delivery.method === "delivery" ? "Delivery" : "Pickup"}
        value={order.deliveryFee === 0 ? "Free" : money(order.deliveryFee)}
      />
      <DetailRow label="Total" value={money(order.total)} strong />
    </Section>
  );
}

/** Email 1 — order received (client). */
export function OrderReceivedEmail({
  order,
  site,
}: {
  order: OrderRecord;
  site?: SiteInfo;
}) {
  const first = order.customer.name.split(" ")[0] || "there";
  const info = site ?? (SITE as unknown as SiteInfo);
  return (
    <EmailShell
      preview={`Order received — ${order.reference}`}
      heading="We got your order."
      reference={order.reference}
      site={info}
      footerNote="Keep this reference handy — you'll need it with your email address to track your order any time."
    >
      <EmailBody>
        Thanks, {first}. We've reserved {order.items.length === 1 ? "your camper" : "your campers"} and
        our team will call you within one business day to confirm pickup or delivery.
      </EmailBody>

      <ItemsRows order={order} />
      <TotalsRows order={order} />

      <Section className="mt-5 border-b border-line pb-3">
        <Text className="m-0 text-[14px] font-semibold text-ink">
          {order.delivery.method === "delivery" ? "Delivery" : "Pickup"}
        </Text>
        <Text className="m-0 mt-1 text-[14px] leading-relaxed text-muted">
          {order.delivery.method === "delivery"
            ? [
                order.delivery.address?.line1,
                [order.delivery.address?.city, order.delivery.address?.state, order.delivery.address?.zip]
                  .filter(Boolean)
                  .join(", "),
              ]
                .filter(Boolean)
                .join(", ") || "Address to be confirmed on our call"
            : `Pickup at our lot — ${info.address}`}
        </Text>
        <Text className="m-0 mt-1 text-[14px] text-muted">
          Payment method: {paymentLabel(order)}
        </Text>
      </Section>

      <EmailBody>
        Next: we'll email your payment details shortly. Once payment is confirmed, your
        camper is prepped and ready — most orders are ready within 48 hours.
      </EmailBody>

      <EmailButton href={`${siteUrl}/track?ref=${order.reference}`}>
        Track your order
      </EmailButton>
    </EmailShell>
  );
}