# Guia de Imagens para Play Store, App Store e Ícones Nativos

Esta pasta (`d:\docs\coautoria V\assets-lojas\`) está organizada para você guardar todas as imagens de publicação do **CoAutoria**.

---

## 1. Subpasta `icones-e-splash/` (Gerador Automático do App Nativo)
Coloque aqui os arquivos-base que serão usados para gerar todos os tamanhos de ícone e tela de abertura (Splash Screen) do Android e do iOS:
- **`icon.png`** — Tamanho do arquivo: **`1024 x 1024 px`** (PNG, fundo sólido `#fbf9f5` sem transparência).
  - *Tamanho da logo dentro do arquivo:* cerca de **`700 x 700 px`** centralizada (deixe ~160 px de margem em cada lado para os ícones redondos não cortarem a logo).
- **`splash.png`** — Tamanho do arquivo: **`2732 x 2732 px`** (PNG, fundo creme `#fbf9f5`).
  - *Tamanho da logo dentro do arquivo:* **pequena no centro**, com cerca de **`650 x 650 px` a `800 x 800 px`** (aprox. 25% do arquivo), deixando todo o restante ao redor apenas com o fundo creme `#fbf9f5`. Isso é obrigatório porque os celulares cortam as laterais do quadrado (`2732x2732`) e o Android 12+ recorta um círculo central na abertura.

*(Obs.: Você também pode copiar esses dois arquivos para a pasta `d:\docs\coautoria V\resources\` quando quiser rodar `npx capacitor-assets generate` para gerar automaticamente todos os ícones nas pastas `android/` e `ios/`).*

---

## 2. Subpasta `play-store/` (Google Play Console — Android)
Coloque aqui os arquivos que serão enviados diretamente no painel da Google Play:
1. **`icone-play-store-512x512.png`** — Tamanho exato: **`512 x 512 px`** (PNG 32-bit, até 1 MB).
2. **`feature-graphic-1024x500.png`** *(Gráfico de Recurso / Banner de Destaque)* — Tamanho exato: **`1024 x 500 px`** (PNG ou JPG sem transparência).
3. **`prints-celular/`** — De **4 a 8 prints** verticais (proporção 9:16, ex: `1080 x 1920 px` ou `1080 x 2400 px` do Xiaomi), **sem barra de endereço do navegador**.

---

## 3. Subpasta `app-store/` (App Store Connect — iOS / iPhone)
Coloque aqui os arquivos que serão enviados no painel da Apple:
1. **`icone-app-store-1024x1024.png`** — Tamanho exato: **`1024 x 1024 px`** (PNG **obrigatoriamente sem transparência/canal alfa** e sem cantos arredondados — o próprio iOS arredonda os cantos).
2. **`prints-iphone-6.7/`** (ou `6.5"`) — De **4 a 8 prints** em retrato (`1290 x 2796 px` para iPhone 6.7" ou `1242 x 2688 px` / `1284 x 2778 px` para iPhone 6.5"), **sem barra do Safari**.

