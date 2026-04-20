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

export interface AppointmentCustomerProps {
  firstName: string;
  appointmentDate: Date;
  message?: string;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Paris",
  }).format(date);
}

export default function AppointmentCustomer({
  firstName,
  appointmentDate,
  message,
}: AppointmentCustomerProps) {
  const formattedDate = formatDate(
    appointmentDate instanceof Date ? appointmentDate : new Date(appointmentDate)
  );

  return (
    <Html lang="fr">
      <Head />
      <Preview>Votre rendez-vous avec Marie est confirmé</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Les Tirages de Marie</Heading>
          <Hr style={divider} />
          <Text style={greeting}>Bonjour {firstName},</Text>
          <Text style={paragraph}>
            Votre demande de rendez-vous a bien été reçue. Marie prendra
            contact avec vous pour confirmer les détails.
          </Text>
          <Text style={dateBlock}>
            Date souhaitée : <strong>{formattedDate}</strong>
          </Text>
          {message && (
            <Text style={paragraph}>
              Votre message a bien été transmis à Marie.
            </Text>
          )}
          <Hr style={divider} />
          <Text style={paragraph}>
            En cas de question, n'hésitez pas à répondre directement à cet
            e-mail.
          </Text>
          <Hr style={divider} />
          <Text style={footer}>
            Avec bienveillance, <br />
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
  fontSize: "18px",
  fontWeight: "600",
  margin: "24px 0 8px",
};

const paragraph: React.CSSProperties = {
  color: "#5C4A3A",
  fontSize: "15px",
  lineHeight: "1.7",
  margin: "8px 0",
};

const dateBlock: React.CSSProperties = {
  backgroundColor: "#FDF6E3",
  border: "1px solid #D4AF6A",
  borderRadius: "6px",
  color: "#4A3728",
  fontSize: "15px",
  margin: "16px 0",
  padding: "12px 16px",
  textAlign: "center" as const,
};

const footer: React.CSSProperties = {
  color: "#8B7355",
  fontSize: "14px",
  lineHeight: "1.6",
  marginTop: "24px",
  textAlign: "center" as const,
};
