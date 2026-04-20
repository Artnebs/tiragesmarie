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
  Link,
} from "@react-email/components";

export interface BookletRequestCustomerProps {
  firstName: string;
  email: string;
  requestId: number;
}

export default function BookletRequestCustomer({
  firstName,
  email,
  requestId,
}: BookletRequestCustomerProps) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>Votre demande de livret astrologique a bien été reçue</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Les Tirages de Marie</Heading>
          <Hr style={divider} />
          <Text style={greeting}>Bonjour {firstName},</Text>
          <Text style={paragraph}>
            Merci pour votre demande de livret astrologique personnalisé. Nous
            avons bien reçu votre demande et nous la traiterons dans les
            meilleurs délais.
          </Text>
          <Text style={paragraph}>
            Marie vous contactera directement à l'adresse{" "}
            <Link href={`mailto:${email}`} style={link}>
              {email}
            </Link>{" "}
            pour vous faire parvenir votre livret.
          </Text>
          <Text style={paragraph}>
            Numéro de référence de votre demande :{" "}
            <strong style={refStyle}>#{requestId}</strong>
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

const link: React.CSSProperties = {
  color: "#D4AF6A",
  textDecoration: "underline",
};

const refStyle: React.CSSProperties = {
  color: "#D4AF6A",
};

const footer: React.CSSProperties = {
  color: "#8B7355",
  fontSize: "14px",
  lineHeight: "1.6",
  marginTop: "24px",
  textAlign: "center" as const,
};
