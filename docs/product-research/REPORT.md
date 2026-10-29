# Audyt i research danych produktowych FrigAC

Stan researchu: 2026-10-29.

Uzupełnienie sprawności sezonowej KAISAI i źródła: [KAISAI-ENERGY-UPDATE.md](KAISAI-ENERGY-UPDATE.md).

## Zakres i znaczenie statusów

Katalog: **18 modeli, 65 wariantów mocy**; w tym dostępne: 17 modeli i 64 wariantów.

`VERIFIED` dla zastanych wartości oznacza zgodnie z poleceniem użytkownika „wartość już używana przez stronę i zachowana”. Nie oznacza ponownego potwierdzenia każdej zastanej wartości u producenta. Nowe wartości VERIFIED mają dowód z rejestru źródeł. `MISSING` oznacza null / brak dowodu. `CONFLICT` oznacza różnicę względem zastanej wartości albo jawną sprzeczność źródeł; w drugim przypadku parametr może pozostać null. Obecne wartości pozostają bez zmian.

Nie przepisujemy hałasu „od” ani zbiorczej klasy energetycznej serii na wszystkie moce. Ciśnienie i moc akustyczna są osobnymi polami. Brak cechy nie oznacza false. Dane badawcze są dowodami audytu; dane używane przez aplikację pozostają wyłącznie w centralnym lineups.ts.

Dodano **1555 parametrów**: 1342 przy wariantach i 213 wspólnych dla modeli. Liczba dotyczy zapisanych pól, bez mnożenia przez kolory.

Wiersze audytu (obejmują powtórzenia na kombinacje kolorów): VERIFIED 7364, MISSING 2665, CONFLICT 41. Pełna tabela: [AUDIT.csv](AUDIT.csv).

Konflikty względem zastanych danych: **16** unikalnych par wariant / parametr. Osobno udokumentowano **4** jawnie oznaczone sprzeczności źródeł, dotyczące **10** par wariant / parametr. Dodatkowe zastrzeżenia opisowe producentów znajdują się w uwagach badawczych; nie są automatycznie zaliczane do tej liczby.

Komplet coolingCapacityKw / heatingCapacityKw / SEER / SCOP: **65/65 wariantów**. Algorytmy energii pozostają bez zmian.

## Kompletność danych i pozostałe braki

Najważniejsze pozostałe braki według zastosowania w ofercie (liczba wariantów z null):

- **Akustyka i warunki pomiaru:** Moc akustyczna wewnątrz — 61/65; Moc akustyczna na zewnątrz — 15/65; Warunki pomiaru hałasu na zewnątrz — 32/65.
- **Ogrzewanie przy niskiej temperaturze:** Wydajność w niskich temperaturach — 64/65; Grzałka karteru — 24/65; Klimat dla SCOP / klasy grzania — 35/65.
- **Komfort nawiewu i higiena:** Łagodny nawiew — 56/65; Tryb nocny — 30/65; Filtry — 41/65; Sterylizacja — 60/65.
- **Sterowanie i integracje:** Aplikacja — 26/65; Sterowanie głosowe — 65/65; Modbus — 29/65; BMS — 65/65.
- **Design i przypisanie wariantów:** Kolory — 33/65; Wykończenie — 57/65; Wymiary jednostki wewnętrznej — 3/65.

Procent dotyczy kontraktu TECHNICAL_FIELDS na wariant (bez powielania przez kolory); obejmuje także kontekst pomiarów i pola opcjonalne. Nie jest oceną jakości urządzenia. Dokładne null znajdują się w CSV i summary.json.

| Model | Warianty | Uzupełnione pola / wszystkie | Kompletność |
| --- | ---: | ---: | ---: |
| Clivia | 4 | 188/256 | 73% |
| Airy | 4 | 188/256 | 73% |
| G-TIME | 4 | 176/256 | 69% |
| Cosmo Pearl | 4 | 176/256 | 69% |
| Fairy | 4 | 176/256 | 69% |
| Pular | 4 | 176/256 | 69% |
| Pular PRO | 4 | 176/256 | 69% |
| PRO HEAT+ (KRW / KRB) | 4 | 176/256 | 69% |
| Amber Prestige | 4 | 166/256 | 65% |
| FLY+ (KKWX) | 4 | 160/256 | 63% |
| GEO+ (KKWR / KKWS) | 4 | 158/256 | 62% |
| ART (KKWI / KKWF) | 4 | 146/256 | 57% |
| NORDIC (KNP) (niedostępny) | 1 | 36/64 | 56% |
| GEO (KGE) | 4 | 140/256 | 55% |
| ICE (KLW / KLB) | 4 | 138/256 | 54% |
| AIR (KKWK) | 4 | 132/256 | 52% |
| Konsola (KKGB / KKOS) | 1 | 32/64 | 50% |
| U-Crown Silver | 3 | 72/192 | 38% |

**Clivia** — nadal brakuje: heatingClimate (4/4), indoorNoise.soundPowerDb (4/4), heatingFeatures.compressorWindingHeating (4/4), heatingFeatures.lowTempPerformance (4/4), airflow.gentleCooling (4/4), airflow.indirectAirflow (4/4), airQuality.filters (4/4), airQuality.sterilization (4/4), airQuality.sterilizationTempC (4/4), controls.voiceControl (4/4), controls.bms (4/4), design.finish (4/4), airflow.fanSpeedControl (4/4), airQuality.dehumidificationLh (4/4), controls.onOffPort (4/4), outdoorNoise.soundPowerContext (4/4), outdoorNoise.silentMode (4/4).

**Airy** — nadal brakuje: heatingClimate (4/4), indoorNoise.soundPowerDb (4/4), heatingFeatures.compressorWindingHeating (4/4), heatingFeatures.lowTempPerformance (4/4), airflow.gentleCooling (4/4), airQuality.filters (4/4), airQuality.sterilization (4/4), airQuality.sterilizationTempC (4/4), airQuality.humidityControl (4/4), controls.voiceControl (4/4), controls.bms (4/4), design.finish (4/4), airflow.fanSpeedControl (4/4), airQuality.dehumidificationLh (4/4), controls.onOffPort (4/4), outdoorNoise.soundPowerContext (4/4), outdoorNoise.silentMode (4/4).

**G-TIME** — nadal brakuje: heatingClimate (4/4), indoorNoise.soundPowerDb (4/4), heatingFeatures.compressorWindingHeating (4/4), heatingFeatures.lowTempPerformance (4/4), airflow.gentleCooling (4/4), airflow.indirectAirflow (4/4), airQuality.uvc (4/4), airQuality.filters (4/4), airQuality.sterilization (4/4), airQuality.sterilizationTempC (4/4), controls.voiceControl (4/4), controls.bms (4/4), design.colors (4/4), design.finish (4/4), colorAffectsPrice (4/4), airflow.fanSpeedControl (4/4), airQuality.dehumidificationLh (4/4), controls.onOffPort (4/4), outdoorNoise.soundPowerContext (4/4), outdoorNoise.silentMode (4/4).

**Cosmo Pearl** — nadal brakuje: heatingClimate (4/4), indoorNoise.soundPowerDb (4/4), heatingFeatures.compressorWindingHeating (4/4), heatingFeatures.lowTempPerformance (4/4), airflow.gentleCooling (4/4), airflow.indirectAirflow (4/4), airQuality.uvc (4/4), airQuality.filters (4/4), airQuality.sterilization (4/4), airQuality.sterilizationTempC (4/4), airQuality.humidityControl (4/4), controls.voiceControl (4/4), controls.bms (4/4), design.colors (4/4), colorAffectsPrice (4/4), airflow.fanSpeedControl (4/4), airQuality.dehumidificationLh (4/4), controls.onOffPort (4/4), outdoorNoise.soundPowerContext (4/4), outdoorNoise.silentMode (4/4).

**Fairy** — nadal brakuje: heatingClimate (4/4), indoorNoise.soundPowerDb (4/4), heatingFeatures.compressorWindingHeating (4/4), heatingFeatures.lowTempPerformance (4/4), airflow.gentleCooling (4/4), airflow.indirectAirflow (4/4), airQuality.uvc (4/4), airQuality.filters (4/4), airQuality.sterilization (4/4), airQuality.sterilizationTempC (4/4), airQuality.humidityControl (4/4), controls.voiceControl (4/4), controls.bms (4/4), design.finish (4/4), colorAffectsPrice (4/4), airflow.fanSpeedControl (4/4), airQuality.dehumidificationLh (4/4), controls.onOffPort (4/4), outdoorNoise.soundPowerContext (4/4), outdoorNoise.silentMode (4/4).

**Pular** — nadal brakuje: heatingClimate (4/4), indoorNoise.soundPowerDb (4/4), heatingFeatures.compressorWindingHeating (4/4), heatingFeatures.lowTempPerformance (4/4), airflow.gentleCooling (4/4), airflow.indirectAirflow (4/4), airQuality.uvc (4/4), airQuality.filters (4/4), airQuality.sterilization (4/4), airQuality.sterilizationTempC (4/4), airQuality.humidityControl (4/4), controls.voiceControl (4/4), controls.bms (4/4), design.colors (4/4), colorAffectsPrice (4/4), airflow.fanSpeedControl (4/4), airQuality.dehumidificationLh (4/4), controls.onOffPort (4/4), outdoorNoise.soundPowerContext (4/4), outdoorNoise.silentMode (4/4).

**Pular PRO** — nadal brakuje: heatingClimate (4/4), indoorNoise.soundPowerDb (4/4), heatingFeatures.compressorWindingHeating (4/4), heatingFeatures.lowTempPerformance (4/4), airflow.gentleCooling (4/4), airflow.indirectAirflow (4/4), airQuality.uvc (4/4), airQuality.filters (4/4), airQuality.sterilization (4/4), airQuality.sterilizationTempC (4/4), airQuality.humidityControl (4/4), controls.voiceControl (4/4), controls.bms (4/4), design.finish (4/4), colorAffectsPrice (4/4), airflow.fanSpeedControl (4/4), airQuality.dehumidificationLh (4/4), controls.onOffPort (4/4), outdoorNoise.soundPowerContext (4/4), outdoorNoise.silentMode (4/4).

**PRO HEAT+ (KRW / KRB)** — nadal brakuje: outdoorNoise.context (4/4), heatingFeatures.crankcaseHeater (4/4), heatingFeatures.compressorWindingHeating (4/4), heatingFeatures.lowTempPerformance (4/4), airflow.fanSpeeds (4/4), airflow.silentMode (4/4), airflow.nightMode (4/4), airQuality.selfClean (4/4), airQuality.sterilization (4/4), airQuality.sterilizationTempC (4/4), airQuality.dehumidification (4/4), airQuality.humidityControl (4/4), controls.voiceControl (4/4), controls.modbus (4/4), controls.bms (4/4), controls.additionalControllers (4/4), design.finish (4/4), controls.onOffPort (4/4), airQuality.autoDry (4/4), outdoorNoise.silentMode (4/4).

**Amber Prestige** — nadal brakuje: heatingClimate (4/4), modulation.heatingMinKw (1/4), modulation.heatingMaxKw (1/4), indoorNoise.soundPowerDb (4/4), heatingFeatures.compressorWindingHeating (4/4), heatingFeatures.lowTempPerformance (4/4), airflow.gentleCooling (4/4), airflow.indirectAirflow (4/4), airQuality.uvc (4/4), airQuality.filters (4/4), airQuality.selfClean (4/4), airQuality.sterilization (4/4), airQuality.sterilizationTempC (4/4), airQuality.humidityControl (4/4), controls.voiceControl (4/4), controls.bms (4/4), design.colors (4/4), design.finish (4/4), colorAffectsPrice (4/4), airflow.fanSpeedControl (4/4), airQuality.dehumidificationLh (4/4), controls.onOffPort (4/4), outdoorNoise.soundPowerContext (4/4), outdoorNoise.silentMode (4/4).

**FLY+ (KKWX)** — nadal brakuje: indoorNoise.soundPowerDb (4/4), outdoorNoise.context (4/4), heatingFeatures.compressorWindingHeating (4/4), heatingFeatures.lowTempPerformance (4/4), airflow.directions (4/4), airflow.fanSpeeds (4/4), airflow.gentleCooling (4/4), airflow.silentMode (4/4), airflow.nightMode (4/4), airflow.automaticLouvers (4/4), airflow.indirectAirflow (4/4), airQuality.ionizer (4/4), airQuality.uvc (4/4), airQuality.filters (4/4), airQuality.dehumidification (4/4), airQuality.humidityControl (4/4), controls.app (4/4), controls.voiceControl (4/4), controls.bms (4/4), design.colors (4/4), design.finish (4/4), colorAffectsPrice (4/4), controls.onOffPort (4/4), airQuality.autoDry (4/4).

**GEO+ (KKWR / KKWS)** — nadal brakuje: indoorNoise.soundPowerDb (4/4), outdoorNoise.soundPowerDb (1/4), outdoorNoise.context (4/4), heatingFeatures.crankcaseHeater (4/4), heatingFeatures.compressorWindingHeating (4/4), heatingFeatures.lowTempPerformance (4/4), airflow.directions (4/4), airflow.fanSpeeds (4/4), airflow.silentMode (4/4), airflow.nightMode (4/4), airflow.automaticLouvers (4/4), airQuality.ionizer (4/4), airQuality.sterilization (4/4), airQuality.sterilizationTempC (4/4), airQuality.dehumidification (4/4), airQuality.humidityControl (4/4), controls.app (4/4), controls.voiceControl (4/4), controls.modbus (4/4), controls.bms (4/4), controls.additionalControllers (4/4), design.finish (4/4), airflow.fanSpeedControl (4/4), airQuality.autoDry (4/4), outdoorNoise.soundPowerContext (1/4), outdoorNoise.silentMode (4/4).

**ART (KKWI / KKWF)** — nadal brakuje: indoorNoise.soundPowerDb (4/4), outdoorNoise.soundPowerDb (1/4), outdoorNoise.context (4/4), heatingFeatures.crankcaseHeater (4/4), heatingFeatures.compressorWindingHeating (4/4), heatingFeatures.lowTempPerformance (4/4), airflow.fanSpeeds (4/4), airflow.gentleCooling (4/4), airflow.silentMode (4/4), airflow.nightMode (4/4), airflow.automaticLouvers (4/4), airflow.indirectAirflow (4/4), airQuality.ionizer (4/4), airQuality.uvc (4/4), airQuality.selfClean (4/4), airQuality.sterilization (4/4), airQuality.sterilizationTempC (4/4), airQuality.dehumidification (4/4), airQuality.humidityControl (4/4), controls.app (4/4), controls.voiceControl (4/4), controls.modbus (4/4), controls.bms (4/4), controls.additionalControllers (4/4), design.finish (4/4), airflow.fanSpeedControl (4/4), airQuality.autoDry (4/4), outdoorNoise.soundPowerContext (1/4), outdoorNoise.silentMode (4/4).

**NORDIC (KNP)** — nadal brakuje: indoorNoise.soundPowerDb (1/1), outdoorNoise.soundPowerDb (1/1), outdoorNoise.context (1/1), heatingFeatures.crankcaseHeater (1/1), heatingFeatures.compressorWindingHeating (1/1), airflow.fanSpeeds (1/1), airflow.silentMode (1/1), airflow.nightMode (1/1), airflow.automaticLouvers (1/1), airQuality.uvc (1/1), airQuality.filters (1/1), airQuality.dehumidification (1/1), airQuality.humidityControl (1/1), controls.app (1/1), controls.voiceControl (1/1), controls.modbus (1/1), controls.bms (1/1), controls.additionalControllers (1/1), design.colors (1/1), design.finish (1/1), priceFromPLN (1/1), colorAffectsPrice (1/1), airflow.fanSpeedControl (1/1), airQuality.dehumidificationLh (1/1), controls.onOffPort (1/1), airQuality.autoDry (1/1), outdoorNoise.soundPowerContext (1/1), outdoorNoise.silentMode (1/1).

**GEO (KGE)** — nadal brakuje: indoorNoise.soundPowerDb (4/4), outdoorNoise.context (4/4), operatingRange.heatingMaxC (4/4), heatingFeatures.compressorWindingHeating (4/4), heatingFeatures.lowTempPerformance (4/4), airflow.fanSpeeds (4/4), airflow.gentleCooling (4/4), airflow.silentMode (4/4), airflow.nightMode (4/4), airflow.indirectAirflow (4/4), airQuality.uvc (4/4), airQuality.sterilization (4/4), airQuality.sterilizationTempC (4/4), airQuality.dehumidification (4/4), airQuality.humidityControl (4/4), controls.app (4/4), controls.voiceControl (4/4), controls.modbus (4/4), controls.bms (4/4), controls.additionalControllers (4/4), design.colors (4/4), design.finish (4/4), colorAffectsPrice (4/4), airflow.fanSpeedControl (4/4), airQuality.dehumidificationLh (4/4), controls.onOffPort (4/4), airQuality.autoDry (4/4), outdoorNoise.silentMode (4/4), outdoorNoise.soundPowerDb (2/4), outdoorNoise.soundPowerContext (2/4).

**ICE (KLW / KLB)** — nadal brakuje: indoorNoise.soundPowerDb (4/4), outdoorNoise.soundPowerDb (4/4), outdoorNoise.context (4/4), heatingFeatures.crankcaseHeater (4/4), heatingFeatures.compressorWindingHeating (4/4), heatingFeatures.lowTempPerformance (4/4), airflow.fanSpeeds (4/4), airflow.gentleCooling (4/4), airflow.silentMode (4/4), airflow.nightMode (4/4), airflow.indirectAirflow (4/4), airQuality.uvc (4/4), airQuality.selfClean (4/4), airQuality.sterilization (4/4), airQuality.sterilizationTempC (4/4), airQuality.dehumidification (4/4), airQuality.humidityControl (4/4), controls.app (4/4), controls.voiceControl (4/4), controls.modbus (4/4), controls.bms (4/4), controls.additionalControllers (4/4), design.finish (4/4), airflow.fanSpeedControl (4/4), airQuality.dehumidificationLh (4/4), controls.onOffPort (4/4), airQuality.autoDry (4/4), outdoorNoise.soundPowerContext (4/4), outdoorNoise.silentMode (4/4), colorAffectsPrice (2/4).

**AIR (KKWK)** — nadal brakuje: indoorNoise.soundPowerDb (4/4), outdoorNoise.soundPowerDb (4/4), outdoorNoise.context (4/4), heatingFeatures.crankcaseHeater (4/4), heatingFeatures.lowTempPerformance (4/4), airflow.directions (4/4), airflow.fanSpeeds (4/4), airflow.gentleCooling (4/4), airflow.silentMode (4/4), airflow.nightMode (4/4), airflow.automaticLouvers (4/4), airflow.indirectAirflow (4/4), airQuality.ionizer (4/4), airQuality.uvc (4/4), airQuality.sterilization (4/4), airQuality.sterilizationTempC (4/4), airQuality.dehumidification (4/4), airQuality.humidityControl (4/4), controls.app (4/4), controls.voiceControl (4/4), controls.modbus (4/4), controls.bms (4/4), controls.additionalControllers (4/4), design.colors (4/4), design.finish (4/4), colorAffectsPrice (4/4), airflow.fanSpeedControl (4/4), controls.onOffPort (4/4), airQuality.autoDry (4/4), outdoorNoise.soundPowerContext (4/4), outdoorNoise.silentMode (4/4).

**Konsola (KKGB / KKOS)** — nadal brakuje: indoorNoise.soundPowerDb (1/1), outdoorNoise.context (1/1), heatingFeatures.crankcaseHeater (1/1), heatingFeatures.compressorWindingHeating (1/1), heatingFeatures.lowTempPerformance (1/1), airflow.directions (1/1), airflow.fanSpeeds (1/1), airflow.gentleCooling (1/1), airflow.nightMode (1/1), airflow.indirectAirflow (1/1), airQuality.ionizer (1/1), airQuality.uvc (1/1), airQuality.filters (1/1), airQuality.selfClean (1/1), airQuality.sterilization (1/1), airQuality.sterilizationTempC (1/1), airQuality.dehumidification (1/1), airQuality.humidityControl (1/1), controls.app (1/1), controls.voiceControl (1/1), controls.modbus (1/1), controls.bms (1/1), controls.additionalControllers (1/1), design.colors (1/1), design.finish (1/1), design.dimensions (1/1), colorAffectsPrice (1/1), airflow.fanSpeedControl (1/1), airQuality.dehumidificationLh (1/1), controls.onOffPort (1/1), airQuality.autoDry (1/1), outdoorNoise.silentMode (1/1).

**U-Crown Silver** — nadal brakuje: heatingClimate (3/3), indoorNoise.soundPowerDb (3/3), heatingFeatures.compressorWindingHeating (3/3), heatingFeatures.lowTempPerformance (3/3), airflow.gentleCooling (3/3), airflow.indirectAirflow (3/3), airQuality.uvc (3/3), airQuality.filters (3/3), airQuality.selfClean (3/3), airQuality.sterilization (3/3), airQuality.sterilizationTempC (3/3), airQuality.humidityControl (3/3), controls.voiceControl (3/3), controls.modbus (3/3), controls.bms (3/3), controls.additionalControllers (3/3), design.colors (3/3), design.finish (3/3), colorAffectsPrice (3/3), airflow.fanSpeedControl (3/3), airQuality.dehumidificationLh (3/3), controls.onOffPort (3/3), outdoorNoise.soundPowerContext (3/3), outdoorNoise.silentMode (3/3), modelCode (2/3), coolingEnergyClass (2/3), heatingEnergyClass (2/3), ratedInput.coolingKw (2/3), ratedInput.heatingKw (2/3), modulation.coolingMinKw (2/3), modulation.coolingMaxKw (2/3), modulation.heatingMinKw (2/3), modulation.heatingMaxKw (2/3), indoorNoise.minDb (2/3), indoorNoise.maxDb (2/3), indoorNoise.levelsDb (2/3), indoorNoise.context (2/3), outdoorNoise.soundPressureDb (2/3), outdoorNoise.soundPowerDb (2/3), outdoorNoise.context (2/3), operatingRange.coolingMinC (2/3), operatingRange.coolingMaxC (2/3), operatingRange.heatingMinC (2/3), operatingRange.heatingMaxC (2/3), heatingFeatures.trayHeater (2/3), heatingFeatures.crankcaseHeater (2/3), design.dimensions (2/3), priceFromPLN (2/3).

## Konflikty wymagające ręcznej decyzji

| Model / moc | Parametr | Zastana wartość | Wartość źródła | Źródło |
| --- | --- | --- | --- | --- |
| G-TIME / 2.7 kW | seer | 8.5 | 9.2 | gree-rac-2026 \| https://gree.pl/pliki-do-pobrania/katalog-rac \| PDF spread 23; printed p. 44; Split table; seer; configured 2.7 kW |
| G-TIME / 2.7 kW | scop | 4.6 | 4.7 | gree-rac-2026 \| https://gree.pl/pliki-do-pobrania/katalog-rac \| PDF spread 23; printed p. 44; Split table; scop; configured 2.7 kW |
| G-TIME / 3.5 kW | scop | 4.8 | 4.7 | gree-rac-2026 \| https://gree.pl/pliki-do-pobrania/katalog-rac \| PDF spread 23; printed p. 44; Split table; scop; configured 3.5 kW |
| G-TIME / 5.3 kW | seer | 8.5 | 8.6 | gree-rac-2026 \| https://gree.pl/pliki-do-pobrania/katalog-rac \| PDF spread 23; printed p. 44; Split table; seer; configured 5.3 kW |
| Fairy / 3.5 kW | coolingCapacityKw | 3.5 | 3.51 | gree-rac-2026 \| https://gree.pl/pliki-do-pobrania/katalog-rac \| PDF spread 61; printed p. 120; Split table; coolingCapacityKw; configured 3.5 kW |
| Fairy / 3.5 kW | heatingCapacityKw | 3.8 | 3.81 | gree-rac-2026 \| https://gree.pl/pliki-do-pobrania/katalog-rac \| PDF spread 61; printed p. 120; Split table; heatingCapacityKw; configured 3.5 kW |
| Pular / 2.5 kW | seer | 6.5 | 6.6 | gree-rac-2026 \| https://gree.pl/pliki-do-pobrania/katalog-rac \| PDF spread 51; printed p. 100; Split table; seer; configured 2.5 kW |
| Pular / 2.5 kW | scop | 4 | 4.1 | gree-rac-2026 \| https://gree.pl/pliki-do-pobrania/katalog-rac \| PDF spread 51; printed p. 100; Split table; scop; configured 2.5 kW |
| GEO (KGE) / 5.3 kW | legacy.energyClass | A+++ / A++ | A++ / A+ | kaisai-geo-leaflet \| https://kaisai.com/pl/files/page_files/545/ulotka-new-03-2025-pl-geo.pdf \| s. 2, wiersz Klasa energetyczna chł./grz., kolumna wariantu; Obecne pole jest etykietą serii. Nie nadpisywać; dla wariantu zapisać osobno udokumentowane coolingEnergyClass/heatingEnergyClass. |
| GEO (KGE) / 7 kW | legacy.energyClass | A+++ / A++ | A++ / A+ | kaisai-geo-leaflet \| https://kaisai.com/pl/files/page_files/545/ulotka-new-03-2025-pl-geo.pdf \| s. 2, wiersz Klasa energetyczna chł./grz., kolumna wariantu; Obecne pole jest etykietą serii. Nie nadpisywać; dla wariantu zapisać osobno udokumentowane coolingEnergyClass/heatingEnergyClass. |
| PRO HEAT+ (KRW / KRB) / 2.6 kW | heatingCapacityKw | 3 | 3.3 | kaisai-pro-heat-plus-leaflet \| https://kaisai.com/pl/files/page_files/745/ulotka-pro-heat-1.pdf \| s. 2, tabela wydajności; Nie nadpisywać. Ulotka i polska strona podają różne wartości dla tej samej serii. |
| PRO HEAT+ (KRW / KRB) / 3.5 kW | heatingCapacityKw | 3.9 | 3.8 | kaisai-pro-heat-plus-page \| https://kaisai.com/pl/klimatyzator-scienny-kaisai-pro-heat-krw-krb \| Dane techniczne – nominalne moce grzewcze; Nie nadpisywać. Ulotka i polska strona podają różne wartości dla tej samej serii. |
| ICE (KLW / KLB) / 2.6 kW | legacy.energyClass | A+++ / A+ | A+++ / A++ | kaisai-ice-leaflet \| https://kaisai.com/pl/files/page_files/461/ulotka-new-03-2025-pl-ice.pdf \| s. 2, wiersz Klasa energetyczna chł./grz., kolumna wariantu; Obecne pole jest etykietą serii. Nie nadpisywać; dla wariantu zapisać osobno udokumentowane coolingEnergyClass/heatingEnergyClass. |
| ICE (KLW / KLB) / 3.5 kW | legacy.energyClass | A+++ / A+ | A+++ / A++ | kaisai-ice-leaflet \| https://kaisai.com/pl/files/page_files/461/ulotka-new-03-2025-pl-ice.pdf \| s. 2, wiersz Klasa energetyczna chł./grz., kolumna wariantu; Obecne pole jest etykietą serii. Nie nadpisywać; dla wariantu zapisać osobno udokumentowane coolingEnergyClass/heatingEnergyClass. |
| ICE (KLW / KLB) / 5.3 kW | legacy.energyClass | A+++ / A+ | A++ / A+ | kaisai-ice-leaflet \| https://kaisai.com/pl/files/page_files/461/ulotka-new-03-2025-pl-ice.pdf \| s. 2, wiersz Klasa energetyczna chł./grz., kolumna wariantu; Obecne pole jest etykietą serii. Nie nadpisywać; dla wariantu zapisać osobno udokumentowane coolingEnergyClass/heatingEnergyClass. |
| ICE (KLW / KLB) / 7 kW | legacy.energyClass | A+++ / A+ | A++ / A+ | kaisai-ice-leaflet \| https://kaisai.com/pl/files/page_files/461/ulotka-new-03-2025-pl-ice.pdf \| s. 2, wiersz Klasa energetyczna chł./grz., kolumna wariantu; Obecne pole jest etykietą serii. Nie nadpisywać; dla wariantu zapisać osobno udokumentowane coolingEnergyClass/heatingEnergyClass. |

## Sprzeczne źródła bez zmiany zastanych wartości

Poniższe pozycje obejmują także świadomie wstrzymane parametry null. Listy i obiekty są kandydatami ze źródeł, a nie przyjętą wartością techniczną.

| Model / moc | Parametr | Przyjęta wartość | Wartości źródeł | Źródło |
| --- | --- | --- | --- | --- |
| Amber Prestige / 2.7 kW | modulation.heatingMaxKw | null | [6.5,5.5] | gree-amber-prestige-page \| https://gree.pl/produkt/klimatyzator-amber-prestige/ \| Polska strona produktu: Parametry techniczne → Model / zestaw 2,7 kW, wydajność grzewcza min/nom/max; Katalog RAC/LCAC 2026, PDF spread 58, s. drukowane 114–115, Split, kolumna 09k.; Strona produktu: maksimum 6,50 kW; katalog 2026: maksimum 5,50 kW. Nie rozstrzygnięto sprzeczności; centralne pole pozostaje null. |
| GEO (KGE) / 2.6 kW | operatingRange.heatingMaxC | null | [24,30] | kaisai-geo-leaflet \| https://kaisai.com/pl/files/page_files/545/ulotka-new-03-2025-pl-geo.pdf \| s. 2: tabela podaje -25÷24°C, akapit SZEROKI ZAKRES TEMPERATUR -25÷30°C. Polska strona produktu także +24°C. Nie przyjęto nowej wartości. |
| GEO (KGE) / 3.5 kW | operatingRange.heatingMaxC | null | [24,30] | kaisai-geo-leaflet \| https://kaisai.com/pl/files/page_files/545/ulotka-new-03-2025-pl-geo.pdf \| s. 2: tabela podaje -25÷24°C, akapit SZEROKI ZAKRES TEMPERATUR -25÷30°C. Polska strona produktu także +24°C. Nie przyjęto nowej wartości. |
| GEO (KGE) / 5.3 kW | operatingRange.heatingMaxC | null | [24,30] | kaisai-geo-leaflet \| https://kaisai.com/pl/files/page_files/545/ulotka-new-03-2025-pl-geo.pdf \| s. 2: tabela podaje -25÷24°C, akapit SZEROKI ZAKRES TEMPERATUR -25÷30°C. Polska strona produktu także +24°C. Nie przyjęto nowej wartości. |
| GEO (KGE) / 7 kW | operatingRange.heatingMaxC | null | [24,30] | kaisai-geo-leaflet \| https://kaisai.com/pl/files/page_files/545/ulotka-new-03-2025-pl-geo.pdf \| s. 2: tabela podaje -25÷24°C, akapit SZEROKI ZAKRES TEMPERATUR -25÷30°C. Polska strona produktu także +24°C. Nie przyjęto nowej wartości. |
| ART (KKWI / KKWF) / 2.7 kW | outdoorNoise.soundPowerDb | null | {"blackCoolingDb":62,"whiteCoolingDb":63,"whiteHeatingDb":62} | kaisai-art-fiche \| https://kaisai.com/pl/files/page_files/870/fiche-pl-scalone.pdf \| s. 1 (KKWF-09RTA1), s. 9 (KKWI-09RTA1); Nie przypisano jednej wartości całemu wariantowi mocy. Karta różnicuje kolor/tryb lub zawiera błąd; pozostawiono null do weryfikacji. |
| PRO HEAT+ (KRW / KRB) / 2.6 kW | operatingRange.coolingMaxC | 53 | 50 | kaisai-product-guide-2026 \| https://kaisai.com/pl/files/page_files/738/kaisai-product-guide-2026-a4-pl-maj.pdf \| s. 11 przeglądu: -15~50°C; ulotka s. 2 i polska strona produktu: -15~53°C; Ulotka i polska strona są zgodne na +53°C; sprzeczne wydanie przeglądu odnotowano. |
| PRO HEAT+ (KRW / KRB) / 3.5 kW | operatingRange.coolingMaxC | 53 | 50 | kaisai-product-guide-2026 \| https://kaisai.com/pl/files/page_files/738/kaisai-product-guide-2026-a4-pl-maj.pdf \| s. 11 przeglądu: -15~50°C; ulotka s. 2 i polska strona produktu: -15~53°C; Ulotka i polska strona są zgodne na +53°C; sprzeczne wydanie przeglądu odnotowano. |
| PRO HEAT+ (KRW / KRB) / 5.2 kW | operatingRange.coolingMaxC | 53 | 50 | kaisai-product-guide-2026 \| https://kaisai.com/pl/files/page_files/738/kaisai-product-guide-2026-a4-pl-maj.pdf \| s. 11 przeglądu: -15~50°C; ulotka s. 2 i polska strona produktu: -15~53°C; Ulotka i polska strona są zgodne na +53°C; sprzeczne wydanie przeglądu odnotowano. |
| PRO HEAT+ (KRW / KRB) / 7 kW | operatingRange.coolingMaxC | 53 | 50 | kaisai-product-guide-2026 \| https://kaisai.com/pl/files/page_files/738/kaisai-product-guide-2026-a4-pl-maj.pdf \| s. 11 przeglądu: -15~50°C; ulotka s. 2 i polska strona produktu: -15~53°C; Ulotka i polska strona są zgodne na +53°C; sprzeczne wydanie przeglądu odnotowano. |

## Niespójności źródeł i uwagi badawcze

- **gree-amber-prestige / 2.7 kW, modulation.heatingMaxKw, CONFLICT:** Polska strona produktu: Parametry techniczne → Model / zestaw 2,7 kW, wydajność grzewcza min/nom/max; Katalog RAC/LCAC 2026, PDF spread 58, s. drukowane 114–115, Split, kolumna 09k. Official product page says 0.70–6.50 kW for 2.7 kW; 2026 catalogue says 0.70–5.50 kW. Withheld (null) pending manufacturer clarification. Existing central configuration has no range. Strona produktu: maksimum 6,50 kW; katalog 2026: maksimum 5,50 kW. Nie rozstrzygnięto sprzeczności; centralne pole pozostaje null. Wartości: [6.5,5.5]. Źródło: gree-amber-prestige-page | https://gree.pl/produkt/klimatyzator-amber-prestige/ | Polska strona produktu: Parametry techniczne → Model / zestaw 2,7 kW, wydajność grzewcza min/nom/max; Katalog RAC/LCAC 2026, PDF spread 58, s. drukowane 114–115, Split, kolumna 09k..
- **gree-amber-prestige / 2.7 kW, modulation.heatingMinKw, MISSING:** Polska strona produktu: Parametry techniczne → Model / zestaw 2,7 kW, wydajność grzewcza min/nom/max; Katalog RAC/LCAC 2026, PDF spread 58, s. drukowane 114–115, Split, kolumna 09k. Oba źródła podają zgodne minimum 0,70 kW. W zgromadzonym researchu wstrzymano cały zakres grzewczy ze względu na sprzeczne maksimum, dlatego minimum także pozostaje null; nie oznaczono zgodnych minimów jako CONFLICT. Wartość źródła: 0.7. Inne źródło (gree-rac-2026): 0.7. Źródło: gree-amber-prestige-page | https://gree.pl/produkt/klimatyzator-amber-prestige/ | Polska strona produktu: Parametry techniczne → Model / zestaw 2,7 kW, wydajność grzewcza min/nom/max; Katalog RAC/LCAC 2026, PDF spread 58, s. drukowane 114–115, Split, kolumna 09k..
- **gree-u-crown, uwaga:** 2026 catalogue has detailed Split data only for UC09S / 2.7 kW. Existing 3.5 and 5.3 kW capacities, SEER, SCOP preserved; other quantitative fields null pending exact matching model documentation.
- **gree-g-time / 7.1 kW, indoorNoise.levelsDb, uwaga:** Catalogue and official product tab give seven levels followed by an empty eighth position; no ultra-silent numeric value invented. Lowest published pressure is 32 dB(A).
- **gree-clivia, design.colors, uwaga:** Polska strona producenta: nazwa Clivia Beige Stone / Satin Black / Navy Blue / Silver / White; Katalog RAC/LCAC 2026, PDF spread 43, s. drukowane 84–85, nagłówek wariantu N i przypis kolorystyczny C/Champagne. Catalogue technical footnote erroneously mentions C/Champagne despite table header N and official product page Navy Blue. Existing confirmed five-color selector preserved. Zastrzeżenie dotyczy niespójnego kodu w przypisie, nie potwierdzonego wyboru kolorów. Zastany selektor pięciu kolorów zachowano; nie przeniesiono nazwy Champagne na model Clivia. Źródło: gree-clivia-page | https://gree.pl/produkt/klimatyzator-scienny-clivia/ | Polska strona producenta: nazwa Clivia Beige Stone / Satin Black / Navy Blue / Silver / White; Katalog RAC/LCAC 2026, PDF spread 43, s. drukowane 84–85, nagłówek wariantu N i przypis kolorystyczny C/Champagne..
- **Wszystkie modele marki, uwaga:** No exact variant heating capacity at -7/-10/-15 C verified. Generic manufacturer percentage claims are not converted into kW or copied to all variants.
- **Wszystkie modele marki, uwaga:** Manufacturer acoustic levels apply to cooling. Quiet-mode minima are declared limits, not rated sound pressure or proof of noise at the same airflow. Indoor pressure and outdoor power kept separate.
- **gree-pular-pro, design.finish, MISSING:** Strona producenta: opis wykończenia Pular PRO Dark / White; Katalog RAC/LCAC 2026, PDF spread 47, s. drukowane 92–93, przypis techniczny o wykończeniu zależnym od kodu. Manufacturer page describes matte finish, whereas 2026 technical footnote distinguishes matte/shiny variants by code. Series-wide finish withheld; existing color image selection retained. Strona opisuje mat, a przypis katalogu rozróżnia warianty matowe i błyszczące według kodu. Zgromadzone dowody nie dają jednoznacznego przypisania wykończenia do każdej kombinacji mocy i koloru. Nie przyjęto jednej wartości dla całej serii; pozostawiono null. Źródło: gree-pular-pro-page | https://gree.pl/produkt/klimatyzator-pular-pro/ | Strona producenta: opis wykończenia Pular PRO Dark / White; Katalog RAC/LCAC 2026, PDF spread 47, s. drukowane 92–93, przypis techniczny o wykończeniu zależnym od kodu..
- **kaisai-geo, operatingRange.heatingMaxC, CONFLICT:** s. 2: tabela podaje -25÷24°C, akapit SZEROKI ZAKRES TEMPERATUR -25÷30°C. Polska strona produktu także +24°C. Nie przyjęto nowej wartości. Wartości: [24,30]. Źródło: kaisai-geo-leaflet | https://kaisai.com/pl/files/page_files/545/ulotka-new-03-2025-pl-geo.pdf | s. 2: tabela podaje -25÷24°C, akapit SZEROKI ZAKRES TEMPERATUR -25÷30°C. Polska strona produktu także +24°C. Nie przyjęto nowej wartości..
- **kaisai-konsola / 3.5 kW, design.dimensions, MISSING:** s. 2, tabela: Wymiary netto s/w/g Kolejność osi szerokość/wysokość/głębokość wygląda niespójnie z rysunkiem konsoli. Zachowano surowy zapis, nie przestawiano osi i nie zasilono tym ustrukturyzowanych wymiarów. Wartość źródła: 700×215×600 mm. Źródło: kaisai-console-leaflet | https://kaisai.com/pl/files/page_files/872/console-260115-pl.pdf | s. 2, tabela: Wymiary netto s/w/g.
- **kaisai-ice, heatingFeatures.crankcaseHeater, MISSING:** s. 1: Wbudowane grzałki tacy skroplin i sprężarki Producent potwierdza grzałkę sprężarki, ale ta ulotka nie nazywa jej wprost grzałką karteru; nie utożsamiono tych pól. Źródło: kaisai-ice-leaflet | https://kaisai.com/pl/files/page_files/461/ulotka-new-03-2025-pl-ice.pdf | s. 1: Wbudowane grzałki tacy skroplin i sprężarki.
- **kaisai-nordic, heatingFeatures.crankcaseHeater, MISSING:** s. 2: przewód grzewczy sprężarki Nie zamieniono ogólnego przewodu grzewczego sprężarki na potwierdzenie grzałki karteru. Źródło: kaisai-nordic-leaflet | https://kaisai.com/pl/files/page_files/721/kaisai-nordic-pl.pdf | s. 2: przewód grzewczy sprężarki.
- **kaisai-geo-plus, indoorNoise.levelsDb, VERIFIED:** s. 2: pięć wartości dB(A), nagłówek Hi/Mi/Lo/Si Zachowano pięć publikowanych wartości w kolejności źródła; nie przypisano arbitralnie nazw biegów ani liczby prędkości na podstawie tego niespójnego nagłówka. Źródło: kaisai-geo-plus-leaflet | https://ebook.klima-therm.com/GEO-PLUS-PL | s. 2: pięć wartości dB(A), nagłówek Hi/Mi/Lo/Si.
- **kaisai-pro-heat-plus, operatingRange.coolingMaxC, CONFLICT:** s. 11 przeglądu: -15~50°C; ulotka s. 2 i polska strona produktu: -15~53°C Ulotka i polska strona są zgodne na +53°C; sprzeczne wydanie przeglądu odnotowano. Wartość źródła: 50. Inne źródło (kaisai-pro-heat-plus-leaflet): 53. Źródło: kaisai-product-guide-2026 | https://kaisai.com/pl/files/page_files/738/kaisai-product-guide-2026-a4-pl-maj.pdf | s. 11 przeglądu: -15~50°C; ulotka s. 2 i polska strona produktu: -15~53°C.
- **kaisai-geo-plus / 2.7 kW, outdoorNoise.soundPowerDb, MISSING:** s. 1 i 9: nagłówek zestawu podaje KKOG-09RAA1, szczegółowy identyfikator KKOG-09RRA1 Nie zastosowano 61 dB przed wyjaśnieniem rozbieżnego kodu jednostki zewnętrznej w karcie UE. Wartość źródła: 61. Źródło: kaisai-geo-plus-fiche | https://kaisai.com/pl/files/page_files/871/fichekkws-09-pl-scalone.pdf | s. 1 i 9: nagłówek zestawu podaje KKOG-09RAA1, szczegółowy identyfikator KKOG-09RRA1.
- **kaisai-art / 2.7 kW, outdoorNoise.soundPowerDb, CONFLICT:** s. 1 (KKWF-09RTA1), s. 9 (KKWI-09RTA1) Nie przypisano jednej wartości całemu wariantowi mocy. Karta różnicuje kolor/tryb lub zawiera błąd; pozostawiono null do weryfikacji. Wartości: {"blackCoolingDb":62,"whiteCoolingDb":63,"whiteHeatingDb":62}. Źródło: kaisai-art-fiche | https://kaisai.com/pl/files/page_files/870/fiche-pl-scalone.pdf | s. 1 (KKWF-09RTA1), s. 9 (KKWI-09RTA1).

- KAISAI: Wszystkie nowe wartości odnoszą się do zestawów single-split z identycznymi kodami jednostek w dokumentach. Dane multi-split nie zostały przeniesione.
- KAISAI: Moce znamionowe, SEER i SCOP w obserwacjach służą do potwierdzenia istniejących pól, nie do tworzenia ich kopii.
- KAISAI: Poziomy akustyczne to ciśnienie akustyczne. Ulotki nie wskazują trybu chłodzenia/grzania; tryb zapisano jako not-specified.
- KAISAI: Poziomy min/max wyznaczono wyłącznie jako minimum/maksimum opublikowanej listy dB(A) tego wariantu, bez ekstrapolacji serii.
- KAISAI: Nie dodano false dla nieopublikowanych funkcji. Niewiadome pozostają null w schemacie centralnym.
- KAISAI: Źródła zawierają niespójności dokumentacji producenta opisane w findings; nie zmieniano obecnych potwierdzonych danych.

## Ceny i zdjęcia do ręcznej weryfikacji

Kombinacje bez dokładnej ceny wariantu: **5**. Cena całej serii nie zastępuje ceny wybranej mocy.

- U-Crown Silver, 3.5 kW, Nieokreślony w zastanej konfiguracji.
- U-Crown Silver, 5.3 kW, Nieokreślony w zastanej konfiguracji.
- ICE (KLW / KLB), 5.3 kW, Czarny.
- ICE (KLW / KLB), 7 kW, Czarny.
- NORDIC (KNP), 3.5 kW, Nieokreślony w zastanej konfiguracji.

Brakujące przypisania zdjęć lub pliki: **0**.


## Oficjalne źródła wykorzystane do uzupełnień

- **gree-airy-page** — [Klimatyzator ścienny Airy Dark / Champagne / Silver / White](https://gree.pl/produkt/klimatyzator-scienny-airy/).
- **gree-amber-prestige-page** — [Klimatyzator ścienny Amber Prestige](https://gree.pl/produkt/klimatyzator-amber-prestige/).
- **gree-clivia-page** — [Klimatyzator ścienny Clivia Beige Stone / Satin Black / Navy Blue / Silver / White](https://gree.pl/produkt/klimatyzator-scienny-clivia/).
- **gree-cosmo-pearl-page** — [Klimatyzator ścienny COSMO PEARL](https://gree.pl/produkt/klimatyzator-scienny-cosmo-pearl/).
- **gree-fairy-page** — [Klimatyzator ścienny Fairy Dark / Silver / White](https://gree.pl/produkt/klimatyzator-fairy/).
- **gree-g-time-page** — [Klimatyzator ścienny G-TIME](https://gree.pl/produkt/klimatyzator-scienny-g-time/).
- **gree-pular-page** — [Klimatyzator ścienny Pular Matt / Shiny](https://gree.pl/produkt/klimatyzator-pular/).
- **gree-pular-pro-page** — [Klimatyzator ścienny Pular PRO Dark / White](https://gree.pl/produkt/klimatyzator-pular-pro/).
- **gree-rac-2026** — [GREE Katalog RAC/LCAC 2026](https://gree.pl/pliki-do-pobrania/katalog-rac).
- **gree-u-crown-page** — [Klimatyzator ścienny U-Crown Silver](https://gree.pl/produkt/klimatyzator-u-crown/).
- **kaisai-air-leaflet** — [KAISAI AIR – ulotka techniczna 2026](https://kaisai.com/pl/files/page_files/965/air-260522-pl.pdf), odczyt 2026-10-28.
- **kaisai-air-page** — [KAISAI AIR KKWK – strona produktu](https://kaisai.com/pl/klimatyzator-scienny-kaisai-air-kkwk), odczyt 2026-10-28.
- **kaisai-art-fiche** — [KAISAI ART – karty produktu UE KKWI/KKWF](https://kaisai.com/pl/files/page_files/870/fiche-pl-scalone.pdf), odczyt 2026-10-28.
- **kaisai-art-leaflet** — [KAISAI ART – ulotka techniczna 2026](https://kaisai.com/pl/files/page_files/968/art-260212-pl-1.pdf), odczyt 2026-10-28.
- **kaisai-console-fiche** — [KAISAI KONSOLA KKGB – karta produktu UE](https://kaisai.com/pl/files/page_files/872/ficheconsole-pl.pdf), odczyt 2026-10-28.
- **kaisai-console-leaflet** — [KAISAI KONSOLA KKGB – ulotka 2026](https://kaisai.com/pl/files/page_files/872/console-260115-pl.pdf), odczyt 2026-10-28.
- **kaisai-fly-plus-fiche** — [KAISAI FLY+ – karta produktu UE, zestawy 09/12/18/24](https://kaisai.com/pl/files/page_files/869/fiche-fly09l-scalone.pdf), odczyt 2026-10-28.
- **kaisai-fly-plus-leaflet** — [KAISAI FLY+ – ulotka techniczna](https://kaisai.com/pl/files/page_files/966/fly-251211-pl-1.pdf), odczyt 2026-10-28.
- **kaisai-geo-fiche** — [KAISAI GEO KGE 09/24 – karta produktu](https://kaisai.com/pl/files/page_files/659/karta-produktu-kaisai-geo-kge-09-24-grhi-grho-1.pdf), odczyt 2026-10-28.
- **kaisai-geo-leaflet** — [KAISAI GEO – ulotka techniczna 03/2025](https://kaisai.com/pl/files/page_files/545/ulotka-new-03-2025-pl-geo.pdf), odczyt 2026-10-28.
- **kaisai-geo-plus-fiche** — [KAISAI GEO+ – karty produktu UE KKWR/KKWS](https://kaisai.com/pl/files/page_files/871/fichekkws-09-pl-scalone.pdf), odczyt 2026-10-28.
- **kaisai-geo-plus-leaflet** — [KAISAI GEO+ – ulotka producenta](https://ebook.klima-therm.com/GEO-PLUS-PL), odczyt 2026-10-28.
- **kaisai-geo-plus-page** — [KAISAI GEO+ KKWR/KKWS – strona produktu](https://kaisai.com/pl/klimatyzator-scienny-geo-kkwr-kkws), odczyt 2026-10-28.
- **kaisai-ice-leaflet** — [KAISAI ICE / ICE BLACK – ulotka techniczna 03/2025](https://kaisai.com/pl/files/page_files/461/ulotka-new-03-2025-pl-ice.pdf), odczyt 2026-10-28.
- **kaisai-nordic-leaflet** — [KAISAI NORDIC – ulotka techniczna](https://kaisai.com/pl/files/page_files/721/kaisai-nordic-pl.pdf), odczyt 2026-10-28.
- **kaisai-pro-heat-plus-fiche** — [KAISAI PRO HEAT+ – karta produktu 03/2025](https://kaisai.com/pl/files/page_files/746/karta-produktu-tabelka-proheat03-25.pdf), odczyt 2026-10-28.
- **kaisai-pro-heat-plus-leaflet** — [KAISAI PRO HEAT+ – ulotka techniczna](https://kaisai.com/pl/files/page_files/745/ulotka-pro-heat-1.pdf), odczyt 2026-10-28.
- **kaisai-pro-heat-plus-page** — [KAISAI PRO HEAT+ KRW/KRB – strona produktu](https://kaisai.com/pl/klimatyzator-scienny-kaisai-pro-heat-krw-krb), odczyt 2026-10-28.
- **kaisai-product-guide-2026** — [KAISAI Przegląd produktów 2026, wydanie maj](https://kaisai.com/pl/files/page_files/738/kaisai-product-guide-2026-a4-pl-maj.pdf), odczyt 2026-10-28.
- **kaisai-product-guide-2026-first** — [KAISAI Przegląd produktów 2026 – wcześniejsze wydanie](https://kaisai.com/pl/files/page_files/738/kaisai-product-guide-2026-1.pdf), odczyt 2026-10-28.

Dokładne lokalizatory tabel i stron są przypisane do każdego nowego pola w technicalDataSources. Konfliktów nie rozstrzygnięto automatycznie. catalog-before.json jest niezmiennym zapisem pierwotnego katalogu; skrypt go nie nadpisuje.
