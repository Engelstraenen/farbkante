# PROJEKT-MASTERFILE – FARBKANTE
Gilt zusätzlich zur globalen Masterfile (~/.claude/CLAUDE.md).

## 1. Ziel und Endprodukt
Interaktive Demo-Website für einen erfundenen Maler- und Lackiererbetrieb (FARBKANTE Malerwerkstatt, Essen). Musterbeispiel für Akquise-Mails von PROJEKT EX an Maler und Lackierer (nächste Branche nach Elektro/LICHTBOGEN).
Probleme, die die Seite löst: Nachwuchs/Fachkräfte (Azubi- und Mitarbeiter-Gewinnung, eigenes Kapitel), unnötige Besichtigungen (Angebot per Foto + Flächenrechner ohne Euro), Kunde kann sich Farbe nicht vorstellen (Farblabor), Preisdruck (Qualität und Ablauf sichtbar, Bewertungen, Social), Winterloch.

## 2. Qualitätsanspruch & Referenzen
- Aufbau wie FLUTLICHT27 („Padelhalle“, github.com/Engelstraenen/flutlicht27-site, docs/storyboard.md): Film-Kapitel (Scrollen spult das Video) im Wechsel mit Motion-Design-Kapiteln, verbunden durch Übergänge.
- Niveau wie LICHTBOGEN V3: Fotolook in 4K, cinematic, dunkle Farbwelt, alles bewegt sich und ist anklickbar.

## 3. Regeln für dieses Projekt
- ALLE SEITEN MOBIL-OPTIMIERT (Eugen 21.11.2026, VERBINDLICH): Jedes Kapitel, Modal, Menü, Formular und der Footer werden fürs Handy angepasst und vor jeder Lieferung in 390×844, 360×740, 430×932 und quer 844×390 geprüft.
- 2K-ENDRENDER NIE MIT REFERENZVIDEO (Eugen 20.11.2026, VERBINDLICH): Draft → 2K nur per Prompt + Einstellung 2K, nie das Draft-Video als Referenz; höchstens das 4K-Startbild als First Frame. Seite liefert die 2K-Dateien unverkleinert (tools/video.py: Desktop 2560×1440, Handy hochkant -p 1080×1440, Handy quer -m 1280).
- Keine echten Firmen, keine Preise/Euro, kein Wort „KI“, keine Rechtsaussagen.
- Demo-Hinweis oben auf jeder Seite, Formulare senden nichts. Persönlicher Link per `?firma=Name`.
- Leitmotiv muss eindeutig Maler/Lackierer sein (Gerüst, Renovierungs-Zeitraffer, Rolle über die Linse, Spritzpistole), nichts, was nach Deko/DIY aussieht.
- Bilder für die Seite in 4K (sjinn 5504×3072), Storyboards nur zum Ansehen in 2K.
- sjinn Unlimited (Nano Banana 2.1) nimmt nur 3 gleichzeitige Aufträge an (gemessen 19.11.2026), Skript-Limit 3.

## 4. Skills, Plugins, Agenten, MCP
Keine zusätzlichen nötig.

## 5. Zugänge
gh (Account Engelstraenen) vorhanden, sjinn in Chrome eingeloggt (Unlimited).

## 6. Workflow & Freigabepunkte
Storyboard-Wahl (Eugen) → First Frames 4K je Film-Kapitel (Eugen) → Video-Drafts kostenlos → Seite bauen → Screenshot-Vergleich mit Storyboard → GitHub Pages.

## 7. Befehle
(folgt mit dem ersten Code)

## 8. Offene Fragen
- Wahl Mix A „Ein Raum“ oder Mix B „Ein Haus“ (Storyboards in konzepte/mix-a-*, mix-b-*). Kapitel-Material: konzepte/4-, 5-, 6-.

## 9. Entschieden
- 19.11.2026: Name FARBKANTE, Stadt Essen (Annahme, kein Widerspruch).
- 19.11.2026: Storyboards 1 Rolle, 2 Krepp ab, 3 Zeitraffer gezeigt. Krepp abgelehnt (nicht maler-typisch). Eugens Wahl: Mix aus 1 + 3 wie FLUTLICHT27, Kapitel frei verbinden, Farblabor und alle Ideen rein, Recruiting (Azubis/Mitarbeiter) besonders wichtig.
- 19.11.2026: Konzepte nur als Bild (globale Masterfile V2.17), Handwerks-Demo-Regeln (V2.18).
- 19.11.2026: Mix B „Ein Haus“ gewählt (+ Bewerbungs-Doppelkapitel aus A). Bilder/Videos kostenlos (Eugen lehnte 975 bzw. 2.100 Credits ab).
- 19.11.2026 (Eugens Video IMG_4604): Fenster + Rahmen/Leistungen gefallen. Ändern: Fassade startet OHNE Gerüst (Altbau grau), beim Scrollen baut sich das Gerüst auf, dann wird die Fassade im Zeitraffer gestrichen. Raum: Maler macht jeden Schritt sichtbar (Abdecken, Spachteln, Grundieren, Streichen). Karriere: Vorteile groß und animiert (umgesetzt: Kinetik-Typo auf echten Rollstrichen, + „Meister? Zahlen wir mit.“). Bewerben: linke Seite schöner (umgesetzt: gestaltetes Handy, Kartenstapel). Finale: keine lange graue Strecke (umgesetzt: 150vh, Rollstrich). Platzhalter nie zeigen.
- 19.11.2026: Handy in Bewerben ist CSS (kein Foto M7 nötig), Finale nutzt Rollstrich aus M1 (M8 entfällt). Neue Startbilder FKM-F0 (Fassade vorher) und FKM-F4A (Raum vorher) in der Gratis-Schlange.

- 20.11.2026: Bewerbung endet mit Kontaktkarte (Vorname, Nachname, Wohnort, E-Mail, Handynummer), mehr Felder nicht (Eugen).

- 20.11.2026: Fassade-Film Draft 2 (Haus ohne Gerüst → Gerüst → ocker) abgenommen (Eugen „Passt“).

- 20.11.2026: Raum-Film Draft 2 (Abdecken → Spachteln → Grundieren → Streichen) abgenommen (Eugen „Passt“).

- 20.11.2026: Alle Endvideos auf MiniMax H3 2K (Eugen). Raum-Endrender daher als 15-s-Fassung (Schritte zusammengeschoben), nicht Wan.
- 20.11.2026: Eugen „Alle passen“: Fassade-Endvideo 2K, Raum-Endvideo 2K und Karriere-Entwurf abgenommen. Karriere-Endrender MiniMax 2K nur nach Kosten-OK.
- 20.11.2026: Karriere-Endrender MiniMax 2K gemacht (Eugen: „muss nochmal auf 2K“), 1.500 Credits. Alle drei Filme jetzt 2K-Endrender.
- 20.11.2026: Eugen „Passt“: Karriere-Endvideo 2K und Storyboard-Abgleich abgenommen, Demo fertig (live engelstraenen.github.io/farbkante/).

## 10. Ablage
Code: Dropbox/CLAUDE/Projekte/FARBKANTE · Repo: github.com/Engelstraenen/farbkante (öffentlich) · Storyboards: konzepte/
