# Franchetti — hela sajten (startkit)

Tio HTML-sidor + en delad `style.css`, ingen byggprocess. Öppna `index.html` direkt i webbläsaren för att förhandsgranska — alla länkar mellan sidorna fungerar lokalt.

## Sidor som finns
`index.html` (start) · `foretaget.html` · `tjanster.html` · `kategorier.html` · `kundlosningar.html` (översikt) · `kundlosningar-kedjor.html` (Spår 1) · `kundlosningar-varumarken.html` (Spår 2) · `kundlosningar-uniform.html` (Spår 3) · `bevis.html` · `kontakt.html`

## Vad som är riktigt innehåll
- Kontaktuppgifter överallt (adress, telefon, mejl) — hämtade från er nuvarande sajt
- Hela tjänstekatalogen med prismodell per tjänst
- Alla tre kundspår, fullt beskrivna med villkor och vad de passar för
- De sex produktkategorierna
- Kontaktformuläret är kopplat för Netlify Forms (`data-netlify="true"`) — fungerar utan egen backend om ni hostar där
- `robots.txt` — släpper uttryckligen in GPTBot, ChatGPT-User, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended och Bingbot

## Vad som fortfarande är platshållare
- **Startsidans statistikrad** — grundår, antal fabriker, typisk ledtid (markerat med kommentarer i `index.html`)
- **Case-bilderna** — tre färgade rutor än så länge. Byt till `<img>` med riktiga foton när de finns
- **`foretaget.html`** — väntar på verifierat grundår, antal anställda och ledningsprofiler
- **`bevis.html`** — väntar på kundtillstånd för case, samt er faktiska QA-process
- **`kategorier.html`** — de sex kategorierna listas, men djupare innehåll per kategori behöver underlag från produktionsteamet
- **JSON-LD-schemat** i `index.html` — lägg till `logo` och `foundingDate` när de är verifierade

## Nästa steg
1. Öppna mappen i Claude Code, eller fortsätt be Claude bygga vidare här i chatten
2. Fyll i platshållarna ovan allt eftersom underlaget blir klart
3. Generera `sitemap.xml` när alla sidor är på plats
4. Flytta bilderna från stage.franchetti.se till produktionsdomänen
5. Deploya: pusha till GitHub, koppla repot till Netlify eller Vercel (Netlify ger er formuläret på köpet), peka franchetti.se dit
