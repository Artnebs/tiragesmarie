/**
 * Booklet PDF renderer — uses @react-pdf/renderer.
 * Style inspired by Marie's Canva template: cream background, gold accents,
 * italic serif headings, bodies in warm brown.
 */

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { BookletContent, SectionBlock } from "./booklet-assembly";

// ---------------------------------------------------------------------------
// Fonts — Google Fonts ship direct TTF URLs we can register at runtime.
// Playfair for display (italic gold headings), Lora for body (warm serif).
// ---------------------------------------------------------------------------

const PLAYFAIR_REGULAR =
  "https://github.com/google/fonts/raw/main/ofl/playfairdisplay/PlayfairDisplay%5Bwght%5D.ttf";
const PLAYFAIR_ITALIC =
  "https://github.com/google/fonts/raw/main/ofl/playfairdisplay/PlayfairDisplay-Italic%5Bwght%5D.ttf";
const LORA_REGULAR =
  "https://github.com/google/fonts/raw/main/ofl/lora/Lora%5Bwght%5D.ttf";
const LORA_ITALIC =
  "https://github.com/google/fonts/raw/main/ofl/lora/Lora-Italic%5Bwght%5D.ttf";

let fontsRegistered = false;
function ensureFonts() {
  if (fontsRegistered) return;
  Font.register({
    family: "Playfair",
    fonts: [
      { src: PLAYFAIR_REGULAR, fontWeight: 400 },
      { src: PLAYFAIR_REGULAR, fontWeight: 700 },
      { src: PLAYFAIR_ITALIC, fontStyle: "italic", fontWeight: 400 },
    ],
  });
  Font.register({
    family: "Lora",
    fonts: [
      { src: LORA_REGULAR, fontWeight: 400 },
      { src: LORA_ITALIC, fontStyle: "italic", fontWeight: 400 },
    ],
  });
  // Silence hyphenation so accented French words aren't broken awkwardly.
  Font.registerHyphenationCallback((word: string) => [word]);
  fontsRegistered = true;
}

// ---------------------------------------------------------------------------
// Palette & styles
// ---------------------------------------------------------------------------

const COLORS = {
  bg: "#FFF8EE", // warm cream
  gold: "#C99A48",
  goldDeep: "#A87A2C",
  ink: "#5C4A3D", // warm brown for body
  inkDark: "#3E2723",
  whisper: "#BFA880",
  line: "#E6D9BE",
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.bg,
    paddingHorizontal: 54,
    paddingTop: 56,
    paddingBottom: 64,
    fontFamily: "Lora",
    fontSize: 11,
    color: COLORS.ink,
    lineHeight: 1.55,
  },
  // --- cover ---
  coverWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    paddingHorizontal: 30,
  },
  coverKicker: {
    fontFamily: "Playfair",
    fontStyle: "italic",
    fontSize: 12,
    color: COLORS.gold,
    letterSpacing: 4,
    textTransform: "uppercase",
    marginBottom: 16,
  },
  coverTitle: {
    fontFamily: "Playfair",
    fontStyle: "italic",
    fontSize: 42,
    color: COLORS.gold,
    textAlign: "center",
    lineHeight: 1.1,
    marginBottom: 18,
  },
  coverSub: {
    fontFamily: "Lora",
    fontSize: 11,
    color: COLORS.ink,
    marginTop: 16,
  },
  coverOrnament: {
    fontFamily: "Playfair",
    fontSize: 22,
    color: COLORS.gold,
    marginVertical: 26,
  },
  // --- page header ---
  pageHeader: {
    fontFamily: "Playfair",
    fontStyle: "italic",
    fontSize: 10,
    color: COLORS.whisper,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 18,
  },
  // --- section titles ---
  h1: {
    fontFamily: "Playfair",
    fontStyle: "italic",
    fontSize: 30,
    color: COLORS.gold,
    marginBottom: 8,
  },
  h2: {
    fontFamily: "Playfair",
    fontStyle: "italic",
    fontSize: 18,
    color: COLORS.goldDeep,
    marginTop: 18,
    marginBottom: 8,
  },
  h3: {
    fontFamily: "Playfair",
    fontStyle: "italic",
    fontSize: 14,
    color: COLORS.goldDeep,
    marginTop: 14,
    marginBottom: 4,
  },
  divider: {
    textAlign: "center",
    fontFamily: "Playfair",
    color: COLORS.gold,
    fontSize: 12,
    marginVertical: 16,
  },
  paragraph: {
    marginBottom: 10,
    textAlign: "justify",
  },
  chartTable: {
    borderTop: `1pt solid ${COLORS.line}`,
    borderBottom: `1pt solid ${COLORS.line}`,
    marginVertical: 18,
    paddingVertical: 12,
  },
  chartRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  chartLabel: {
    fontFamily: "Playfair",
    fontStyle: "italic",
    fontSize: 11,
    color: COLORS.goldDeep,
  },
  chartValue: {
    fontFamily: "Lora",
    fontSize: 11,
    color: COLORS.ink,
  },
  pageNumber: {
    position: "absolute",
    bottom: 28,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 9,
    color: COLORS.whisper,
    fontFamily: "Playfair",
    fontStyle: "italic",
  },
});

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const Divider: React.FC = () => <Text style={styles.divider}>✦</Text>;

const Paragraphs: React.FC<{ text: string }> = ({ text }) => (
  <>
    {text.split(/\n{2,}/).map((p, i) => (
      <Text key={i} style={styles.paragraph}>
        {p.trim()}
      </Text>
    ))}
  </>
);

const Section: React.FC<{ block: SectionBlock; heading?: "h2" | "h3" }> = ({
  block,
  heading = "h2",
}) => (
  <View wrap={false} style={{ marginBottom: 6 }}>
    <Text style={heading === "h2" ? styles.h2 : styles.h3}>{block.title}</Text>
    <Paragraphs text={block.body} />
  </View>
);

// ---------------------------------------------------------------------------
// Document
// ---------------------------------------------------------------------------

export const BookletDocument: React.FC<{ content: BookletContent }> = ({
  content,
}) => {
  return (
    <Document
      title={`Livret astral — ${content.cover.title}`}
      author="Marie Guéhenneuc"
      subject="Livret astral personnalisé"
    >
      {/* ── Cover ───────────────────────────────────────────────────────── */}
      <Page size="A4" style={styles.page}>
        <View style={styles.coverWrap}>
          <Text style={styles.coverKicker}>Alignement en détails</Text>
          <Text style={styles.coverOrnament}>✦</Text>
          <Text style={styles.coverTitle}>{content.cover.title}</Text>
          <Text style={styles.coverSub}>{content.cover.subtitle}</Text>
          <Text style={styles.coverOrnament}>✧</Text>
          <Text style={{ fontFamily: "Lora", fontStyle: "italic", color: COLORS.whisper }}>
            Un livret personnalisé, écrit à la main par Marie.
          </Text>
        </View>
      </Page>

      {/* ── Overview + chart table ──────────────────────────────────────── */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.pageHeader}>Votre ciel</Text>
        <Text style={styles.h1}>{content.overview.title}</Text>
        <Paragraphs text={content.overview.body} />

        <View style={styles.chartTable}>
          <View style={styles.chartRow}>
            <Text style={styles.chartLabel}>Soleil</Text>
            <Text style={styles.chartValue}>
              {content.chart.sun.sign} · {content.chart.sun.degree.toFixed(1)}°
            </Text>
          </View>
          <View style={styles.chartRow}>
            <Text style={styles.chartLabel}>Lune</Text>
            <Text style={styles.chartValue}>
              {content.chart.moon.sign} · {content.chart.moon.degree.toFixed(1)}°
            </Text>
          </View>
          <View style={styles.chartRow}>
            <Text style={styles.chartLabel}>Ascendant</Text>
            <Text style={styles.chartValue}>
              {content.chart.ascendant.sign} · {content.chart.ascendant.degree.toFixed(1)}°
            </Text>
          </View>
          {Object.entries(content.chart.planets).map(([name, pos]) => (
            <View key={name} style={styles.chartRow}>
              <Text style={styles.chartLabel}>{name}</Text>
              <Text style={styles.chartValue}>
                {pos.sign} · {pos.degree.toFixed(1)}°
              </Text>
            </View>
          ))}
        </View>

        <Divider />
        <Text style={{ ...styles.paragraph, textAlign: "center", color: COLORS.whisper, fontStyle: "italic" }}>
          Les pages qui suivent déploient chaque position, une à une.
        </Text>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber }) => `— ${pageNumber} —`}
          fixed
        />
      </Page>

      {/* ── Trinity: Sun, Moon, Ascendant ──────────────────────────────── */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.pageHeader}>La trinité</Text>
        <Text style={styles.h1}>Soleil, Lune, Ascendant</Text>
        <Section block={content.sun} heading="h2" />
        <Divider />
        <Section block={content.moon} heading="h2" />
        <Divider />
        <Section block={content.ascendant} heading="h2" />
        <Text
          style={styles.pageNumber}
          render={({ pageNumber }) => `— ${pageNumber} —`}
          fixed
        />
      </Page>

      {/* ── Planets ────────────────────────────────────────────────────── */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.pageHeader}>Les planètes</Text>
        <Text style={styles.h1}>Vos influences planétaires</Text>
        {content.planets.map((block) => (
          <Section key={block.anchor} block={block} heading="h3" />
        ))}
        <Text
          style={styles.pageNumber}
          render={({ pageNumber }) => `— ${pageNumber} —`}
          fixed
        />
      </Page>

      {/* ── Houses ─────────────────────────────────────────────────────── */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.pageHeader}>Les maisons</Text>
        <Text style={styles.h1}>Les douze maisons</Text>
        {content.houses.map((block) => (
          <Section key={block.anchor} block={block} heading="h3" />
        ))}
        <Text
          style={styles.pageNumber}
          render={({ pageNumber }) => `— ${pageNumber} —`}
          fixed
        />
      </Page>

      {/* ── Conclusion ─────────────────────────────────────────────────── */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.pageHeader}>Clôture</Text>
        <Text style={styles.h1}>{content.conclusion.title}</Text>
        <Paragraphs text={content.conclusion.body} />
        <View style={{ marginTop: 40, alignItems: "center" }}>
          <Text style={{ fontFamily: "Playfair", fontSize: 18, color: COLORS.gold }}>
            ✦
          </Text>
        </View>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber }) => `— ${pageNumber} —`}
          fixed
        />
      </Page>
    </Document>
  );
};

// ---------------------------------------------------------------------------
// Public render helper
// ---------------------------------------------------------------------------

export async function renderBookletPDF(
  content: BookletContent,
): Promise<Buffer> {
  ensureFonts();
  const doc = <BookletDocument content={content} />;
  return await renderToBuffer(doc);
}
