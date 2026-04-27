# Dryguard Review Flow

Statische review-flow op basis van de Figma ontwerpen.

## Routes

- `/` toont de keuze-pagina
- `/We horen graag wat beter kan`
- `/Het spijt ons dat het niet naar wens was`

De keuze-pagina stuurt `Ja` naar Google Reviews en de twee andere keuzes naar de juiste landingspagina.

## Webhook

De formulieren posten naar de Zapier-webhook met:

- de gekozen knop (`Ja/Nee` of `Nee`)
- alle formuliergegevens
- geuploade foto's

## Lokaal draaien

```sh
npm install
npm run dev
```
