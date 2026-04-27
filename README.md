# Dryguard Review Flow

Statische review-flow op basis van de Figma ontwerpen.

## Routes

- `/` toont de keuze-pagina
- `/we_horen_graag_wat_beter_kan`
- `/het_spijt_ons_dat_het_niet_naar_wens_was`

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
