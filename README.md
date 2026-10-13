# Forma come app sul telefono

Serve un computer, Node.js e due account gratuiti: Vercel e Anthropic (per la chiave API).

## Installazione (10 minuti)

1. Scompatta questa cartella e apri il terminale dentro.
2. `npm i -g vercel` poi `vercel login`.
3. `vercel` e rispondi di sì alle domande. Se chiede il tipo di progetto, scegli "Other".
4. Aggiungi i due segreti:
   - `vercel env add ANTHROPIC_API_KEY` (la chiave da console.anthropic.com)
   - `vercel env add APP_PASSCODE` (un codice a tua scelta: protegge l'accesso a Claude)
   Scegli "Production" quando lo chiede.
5. `vercel --prod`. Ti dà l'indirizzo dell'app.
6. Su iPhone apri l'indirizzo in Safari, tocca Condividi, poi "Aggiungi alla schermata Home".

La prima volta che usi coach, foto o piano, l'app ti chiede il codice del punto 4. Lo ricorda.

## Portare i tuoi dati

1. Nella versione dentro Claude: Oggi, ingranaggio in alto a destra, "Scarica una copia".
2. Nell'app sul telefono: Oggi, ingranaggio, "Ripristina", scegli il file.

## Cose da sapere

- I dati stanno solo sul telefono: ogni tanto scarica una copia.
- Coach, foto all'etichetta, idee pasto, piano e valutazione da foto passano dal tuo server e usano la tua chiave: costano pochi centesimi a uso.
- Il codice a barre usa Open Food Facts: non ha tutti i prodotti. Se manca, usa la foto alla tabella o la voce manuale.
- Senza connessione funzionano scheda, allenamento guidato, diario e omino. Coach, foto e ricerca prodotti no.
- Non l'ho provata su un iPhone vero: la prima volta controlla fotocamera e scanner.
