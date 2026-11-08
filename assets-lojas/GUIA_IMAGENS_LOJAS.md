# Guia de Imagens e Publicação nas Lojas — CoAutoria

Todas as imagens e capturas de tela deste diretório já foram tratadas, redimensionadas nas medidas oficiais e convertidas para **PNG 24-bits sem transparência (RGB)** prontas para upload.

---

## 1. Arquivos Prontos para Apple App Store (`assets-lojas/app-store/`)
- **Ícone 1024x1024 (sem canal alfa):** `logo-pena1024.png` (`1024 x 1024 px`)
- **6 Screenshots iPhone 6.7" / 6.9" (`1290 x 2796 px`):**
  1. `01-inicio.png` — Tela Inicial da Jornada
  2. `02-modulo-voz.png` — Apresentação e Sigilo do Módulo Voz
  3. `03-constelacao-voar.png` — Constelação V de VOAR (9 Estrelas Conectadas)
  4. `04-minhas-historias.png` — Acervo Pessoal (Áudios e Escritos)
  5. `05-roda-historias.png` — Comunidade Roda de Histórias
  6. `06-perfil.png` — Acesso e Gestão da Conta

---

## 2. Arquivos Prontos para Google Play Store (`assets-lojas/play-store/`)
- **Ícone de Alta Resolução (`512 x 512 px`):** `512.png`
- **Gráfico de Recursos / Feature Graphic (`1024 x 500 px`):** `Banner.png`
- **6 Screenshots Full HD 9:16 (`1080 x 1920 px`, sem barra de status iOS):**
  1. `01-inicio.png`
  2. `02-modulo-voz.png`
  3. `03-constelacao-voar.png`
  4. `04-minhas-historias.png`
  5. `05-roda-historias.png`
  6. `06-perfil.png`

---

## 3. Ícones e Splash Nativos (`resources/`, `ios/` e `android/`)
- Os arquivos base em `resources/icon.png` (`1024 x 1024 px`) e `resources/splash.png` (`2732 x 2732 px`) já foram aplicados automaticamente em:
  - **iOS:** `ios/App/App/Assets.xcassets/AppIcon.appiconset/` e `Splash.imageset/`
  - **Android:** `android/app/src/main/res/mipmap-*` e `drawable-*/splash.png`

---

## 4. Passo a Passo Rápido para Publicar no iOS (Mac / Xcode)
Para quem clonar este repositório no Mac para subir na **Apple App Store**:

1. **Instalar dependências:**
   ```bash
   npm install
   ```
2. **Configurar o arquivo `.env` na raiz do projeto** (com as chaves do Supabase de produção):
   ```env
   VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
   VITE_SUPABASE_ANON_KEY=SUA_ANON_KEY
   ```
3. **Gerar o build web e sincronizar com o projeto iOS:**
   ```bash
   npm run build
   npx cap sync ios
   ```
4. **Abrir no Xcode:**
   ```bash
   npx cap open ios
   ```
5. **No Xcode (`Signing & Capabilities`):**
   - Selecionar o **Team** da conta Apple Developer.
   - Conferir o Bundle Identifier (`br.com.coautoria.app`).
   - Selecionar o destino **Any iOS Device (arm64)** e clicar em **Product > Archive** -> **Distribute App** -> **App Store Connect**.
6. **No App Store Connect:**
   - **URL da Política de Privacidade:** `https://coautoria-v.vercel.app/privacidade`
   - **URL dos Termos de Uso (EULA):** `https://coautoria-v.vercel.app/termos`
   - **App Review Information (Sign-In Required):** Fornecer um e-mail e senha de uma conta de teste criada no app para o revisor da Apple testar as etapas do Método V.O.A.R. e a exclusão de conta em *Perfil > Zona de Segurança > Excluir Minha Conta*.
