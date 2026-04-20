import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Hr,
  Preview,
} from "@react-email/components";

export interface PaymentSuccessCustomerProps {
  firstName: string;
  productType: "booklet" | "appointment";
  amountCents: number;
}

function formatAmount(cents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

const productLabels: Record<PaymentSuccessCustomerProps["productType"], string> = {
  booklet: "livret astrologique personnalisé",
  appointment: "consultation astrologique",
};

export default function PaymentSuccessCustomer({
  firstName,
  productType,
  amountCents,
}: PaymentSuccessCustomerProps) {
  const productLabel = productLabels[productType];
  const amount = formatAmount(amountCents);

  return (
    <Html lang="fr">
      <Head />
      <Preview>Paiement reçu — merci pour votre commande</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Les Tirages de Marie</Heading>
          <Hr style={divider} />
          <Text style={greeting}>Merci, {firstName} !</Text>
          <Text style={paragraph}>
            Votre paiement de <strong style={highlight}>{amount}</strong> pour
            votre {productLabel} a bien été reçu.
          </Text>
          <Text style={confirmationBox}>Paiement confirmé</Text>
          <Text style={paragraph}>
            Marie vous contactera très prochainement pour la suite de votre
            commande.
          </Text>
          <Hr style={divider} />
          <Text style={paragraph}>
            Si vous avez des questions, n'hésitez pas à répondre à cet e-mail.
          </Text>
          <Hr style={divider} />
          <Text style={footer}>
            Avec gratitude, <br />
            <strong>Marie</strong> — Les Tirages de Marie
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const body: React.CSSProperties = {
  backgroundColor: "#F5F1E8",
  fontFamily: "Georgia, 'Times New Roman', serif",
  margin: 0,
  padding: 0,
};

const container: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  borderRadius: "8px",
  margin: "32px auto",
  maxWidth: "560px",
  padding: "40px 48px",
};

const heading: React.CSSProperties = {
  color: "#D4AF6A",
  fontFamily: "'Playfair Display', serif",
  fontSize: "28px",
  fontWeight: "700",
  letterSpacing: "0.5px",
  margin: "0 0 8px",
  textAlign: "center" as const,
};

const divider: React.CSSProperties = {
  borderColor: "#D4AF6A",
  borderTopWidth: "1px",
  margin: "16px 0",
};

const greeting: React.CSSProperties = {
  color: "#4A3728",
  fontSize: "20px",
  fontWeight: "600",
  margin: "24px 0 8px",
  textAlign: "center" as const,
};

const paragraph: React.CSSProperties = {
  color: "#5C4A3A",
  fontSize: "15px",
  lineHeight: "1.7",
  margin: "8px 0",
  textAlign: "center" as const,
};

const highlight: React.CSSProperties = {
  color: "#D4AF6A",
};

const confirmationBox: React.CSSProperties = {
  backgroundColor: "#F0FAF0",
  border: "1px solid #78C878",
  borderRadius: "6px",
  color: "#2E7D32",
  fontSize: "16px",
  fontWeight: "700",
  margin: "20px auto",
  padding: "12px 24px",
  textAlign: "center" as const,
};

const footer: React.CSSProperties = {
  color: "#8B7355",
  fontSize: "14px",
  lineHeight: "1.6",
  marginTop: "24px",
  textAlign: "center" as const,
};
