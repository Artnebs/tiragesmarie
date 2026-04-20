import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Hr,
  Preview,
} from "@react-email/components";

export interface BookletRequestAdminProps {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  message?: string;
  requestId: number;
}

export default function BookletRequestAdmin({
  firstName,
  lastName,
  email,
  dateOfBirth,
  timeOfBirth,
  placeOfBirth,
  message,
  requestId,
}: BookletRequestAdminProps) {
  const appUrl = process.env.APP_URL ?? "https://tiragesmarie.fr";

  return (
    <Html lang="fr">
      <Head />
      <Preview>
        Nouvelle demande de livret — {firstName} {lastName}
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Nouvelle demande de livret</Heading>
          <Hr style={divider} />
          <Text style={badge}>Référence #{requestId}</Text>

          <Text style={sectionTitle}>Coordonnées du client</Text>
          <Row label="Prénom" value={firstName} />
          <Row label="Nom" value={lastName} />
          <Row label="Email" value={email} />

          <Text style={sectionTitle}>Données astrologiques</Text>
          <Row label="Date de naissance" value={dateOfBirth} />
          <Row label="Heure de naissance" value={timeOfBirth} />
          <Row label="Lieu de naissance" value={placeOfBirth} />

          {message && (
            <>
              <Text style={sectionTitle}>Message</Text>
              <Text style={messageBox}>{message}</Text>
            </>
          )}

          <Hr style={divider} />
          <Button href={`${appUrl}/admin`} style={button}>
            Voir dans l'administration
          </Button>
          <Hr style={divider} />
          <Text style={footer}>Les Tirages de Marie — notification automatique</Text>
        </Container>
      </Body>
    </Html>
  );
}

// ---------------------------------------------------------------------------
// Sub-component for data rows
// ---------------------------------------------------------------------------
function Row({ label, value }: { label: string; value: string }) {
  return (
    <Text style={rowText}>
      <span style={labelStyle}>{label} : </span>
      {value}
    </Text>
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
  fontSize: "26px",
  fontWeight: "700",
  margin: "0 0 8px",
  textAlign: "center" as const,
};

const divider: React.CSSProperties = {
  borderColor: "#D4AF6A",
  borderTopWidth: "1px",
  margin: "16px 0",
};

const badge: React.CSSProperties = {
  backgroundColor: "#FDF6E3",
  border: "1px solid #D4AF6A",
  borderRadius: "4px",
  color: "#8B6914",
  fontSize: "13px",
  fontWeight: "600",
  padding: "4px 10px",
  textAlign: "center" as const,
  width: "fit-content",
};

const sectionTitle: React.CSSProperties = {
  borderBottom: "1px solid #EDE8DC",
  color: "#D4AF6A",
  fontSize: "13px",
  fontWeight: "700",
  letterSpacing: "1px",
  margin: "20px 0 8px",
  paddingBottom: "4px",
  textTransform: "uppercase" as const,
};

const rowText: React.CSSProperties = {
  color: "#5C4A3A",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "4px 0",
};

const labelStyle: React.CSSProperties = {
  color: "#8B7355",
  fontWeight: "600",
};

const messageBox: React.CSSProperties = {
  backgroundColor: "#FDF6E3",
  border: "1px solid #EDE8DC",
  borderRadius: "6px",
  color: "#5C4A3A",
  fontSize: "14px",
  lineHeight: "1.7",
  padding: "12px 16px",
  whiteSpace: "pre-wrap" as const,
};

const button: React.CSSProperties = {
  backgroundColor: "#D4AF6A",
  borderRadius: "6px",
  color: "#FFFFFF",
  display: "block",
  fontSize: "15px",
  fontWeight: "600",
  margin: "16px auto",
  padding: "12px 32px",
  textAlign: "center" as const,
  textDecoration: "none",
};

const footer: React.CSSProperties = {
  color: "#8B7355",
  fontSize: "12px",
  textAlign: "center" as const,
};
