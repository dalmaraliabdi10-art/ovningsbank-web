# Övningsbank för fotbollstränaren — webbapplikation

React-applikation byggd med Vite. Låter en fotbollstränare samla sina övningar,
kategorisera dem, markera dem som genomförda och ladda upp en bild på
taktiktavlan.

Applikationen hämtar all data från projektets eget REST-API
([ovningsbank-api](../ovningsbank-api)), som körs separat.

## Kom igång

Applikationen behöver både backend och frontend igång. Starta dem i den här
ordningen, i **två terminalfönster**.

### 1. Backend (API)

Krävs: .NET SDK 8.0 eller senare, med .NET 8-runtime installerad.

```bash
cd ovningsbank-api
dotnet restore
dotnet run
```

API:et lyssnar på **http://localhost:5080**. Databasen (SQLite) skapas
automatiskt vid första uppstarten och fylls med fyra exempelövningar, ingen
databasinstallation behövs. Swagger finns på http://localhost:5080/swagger.

### 2. Webbapplikationen

Krävs: Node.js 18 eller senare.

```bash
cd ovningsbank-web
npm install
npm run dev
```

Appen körs på **http://localhost:5173** och öppnas i webbläsaren.

### API-adressen

Adressen till API:et läses från `.env` i projektroten:

```
VITE_API_URL=http://localhost:5080
```

Filen är tillagd för det finns ingen hemlighet. Den som klonar projektet får rätt adress direkt. Kör du API:et på en annan port ändrar du den här och startar om `npm run dev`.

Ändrar du porten måste adressen också läggas till i backendens CORS-lista, under
`Cors:AllowedOrigins` i `appsettings.json`.

## Funktioner

- Lista alla övningar, med filtrering på kategori
- Lägga till en övning (POST)
- Redigera en övning och växla dess status mellan planerad och genomförd (PUT)
- Ladda upp en bild till en övning och se den i listan (multipart POST)
- Responsivt gränssnitt, från desktop till mobil
- Fel från API:et visas som ett meddelande i gränssnittet, appen kraschar inte

### Testa felhanteringen

Stäng av backend och ladda om sidan. Appen visar då *"Kunde inte nå API:et.
Kontrollera att backend är igång på http://localhost:5080 samtidigt med en
"Försök igen"-knapp, istället för en vit skärm eller en spinner som snurrar i evighet.

## Projektstruktur

```
src/
├─ components/      Presenterande komponenter, en per fil
│  ├─ Header.jsx
│  ├─ FilterBar.jsx
│  ├─ ExerciseForm.jsx      formulär för både skapa och redigera
│  ├─ ExerciseList.jsx      hanterar laddar / tomt / data
│  ├─ ExerciseCard.jsx
│  ├─ ImageUploader.jsx
│  └─ Message.jsx           fel- och bekräftelsebanderoll
├─ hooks/
│  └─ useExercises.js       data, laddningsläge och fel på ett ställe
├─ services/
│  └─ api.js                allt fetch-anrop och all felöversättning
├─ constants/
│  └─ exercise.js           API:ets enum-värden → svenska etiketter
├─ App.jsx                  sätter ihop delarna, äger vy-state
└─ index.css                all styling, media queries längst ned
```

## Tekniska val

**Vite före Create React App.** Vite startar utvecklingsservern på under en
sekund och byggsteget är märkbart snabbare. CRA underhålls dessutom inte längre.

**Egen CSS med Flexbox och Grid, inget UI-bibliotek.** 
Ett färdigt komponentbibliotek hade dolt de
media queries och relativa enheter som kursmålet handlar om bakom
färdiga klasser. All styling ligger i `index.css` med CSS-variabler överst och
brytpunkterna samlade längst ned, i en app av den här storleken gör det
responsiviteten lättare att läsa än om den varit utspridd över ett tiotal
CSS-modulfiler.

**Mobil först, med två uttalade brytpunkter.** Grundlayouten är en kolumn. Vid
48rem (surfplatta) får formuläret en egen kolumn vid sidan av listan, och vid
75rem (desktop) breddas den kolumnen. Kortrutnätet använder
`repeat(auto-fill, minmax(...))` och behöver därför ingen egen media query, det
byter kolumnantal av sig självt även i bredder mellan brytpunkterna.

**En egen `useExercises`-hook istället för Redux eller Context.** Appen har en
enda datadomän och ett grunt komponentträd. Ett globalt state-bibliotek hade
tillfört konfiguration utan att lösa ett problem som faktiskt finns här. Hooken
samlar `loading`, `error` och `data` på ett plats och alla tre har en synlig
representation i gränssnittet.

**Ett servicelager för alla API-anrop.** `services/api.js` är enda stället som
känner till `fetch`, HTTP-statuskoder och API:ets felformat. Komponenterna får
antingen data eller ett `ApiError` med en färdig, läsbar text. Det gör att ett
nytt anrop inte kan glömma bort felhanteringen.

**Nätverksfel och serverfel skiljs åt.** `fetch` kastar bara vid nätverksfel,
inte vid 4xx och 5xx, en klassisk fallgrop. Servicelagret kontrollerar därför
`response.ok` explicit och ger olika meddelanden för "API:et svarar inte" och
"API:et svarade med ett fel".

**Alla skrivande anrop går genom en gemensam wrapper i `App.jsx`.** Den sätter
`saving`, nollställer meddelanden, fångar fel och släcker alltid laddningsläget i
ett `finally`. Därmed finns ingen väg där ett misslyckat anrop lämnar
gränssnittet låst.

**Enum-etiketter i `constants/exercise.js`.** API:et använder ASCII-namn
(`Uppvarmning`, `Latt`, `Genomford`) för att hålla JSON och URL fria från
teckenkodningsproblem. Översättningen till svenska etiketter sker på ett ställe
i klienten, så en ny kategori kräver en ändring i API:et och en i den här filen.

**Filtrering i klienten.** Hela listan hämtas ändå i ett anrop. En
filterparameter i API:et hade inneburit ett nytt nätverksanrop per knapptryck
utan någon vinst vid den här datamängden.

**Ingen `Content-Type`-header vid filuppladdning.** Webbläsaren sätter själv
`multipart/form-data` med rätt gräns när kroppen är ett `FormData`. En
handskriven header hade gjort att servern inte kunde tolka kroppen.
