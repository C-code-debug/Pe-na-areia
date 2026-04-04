# PWA — Instruções de Instalação · Pé na Areia

## O que foi criado

- `manifest.json` — descreve o app pro navegador (nome, ícones, cor, atalhos)
- `sw.js` — service worker (cache offline, carregamento rápido)
- `gerar-icones.html` — abre no navegador pra gerar e baixar os ícones automaticamente
- `icons/` — pasta onde você coloca os ícones gerados

---

## Passo 1 — Criar os ícones

1. Abra `gerar-icones.html` no navegador
2. Clique em "Gerar e baixar todos"
3. Crie uma pasta chamada `icons/` na raiz do projeto
4. Mova todos os `.png` baixados pra dentro de `icons/`

---

## Passo 2 — Adicionar nas páginas HTML

Cole o trecho abaixo **dentro do `<head>`** de TODAS as páginas:

```html
<!-- PWA -->
<link rel="manifest" href="manifest.json"/>
<meta name="theme-color" content="#126E8C"/>
<meta name="apple-mobile-web-app-capable" content="yes"/>
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
<meta name="apple-mobile-web-app-title" content="Pé na Areia"/>
<link rel="apple-touch-icon" href="icons/icon-192.png"/>
```

E cole o trecho abaixo **antes do `</body>`** de TODAS as páginas:

```html
<!-- Registro do Service Worker -->
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('SW registrado:', reg.scope))
        .catch(err => console.warn('SW falhou:', err));
    });
  }
</script>
```

---

## Páginas que precisam receber o trecho

- [ ] index.html
- [ ] login.html
- [ ] agendamento.html
- [ ] meus-agendamentos.html
- [ ] perfil.html
- [ ] configuracoes.html
- [ ] admin.html
- [ ] admin-fiado.html

---

## Passo 3 — Deploy no GitHub Pages

O service worker só funciona em HTTPS. O GitHub Pages já serve HTTPS, então:

1. Suba todos os arquivos pro repositório
2. Acesse o site pelo domínio do GitHub Pages
3. No Chrome/celular, vai aparecer o banner "Adicionar à tela inicial"

---

## Observação sobre o `start_url` no manifest.json

Se o site estiver numa subpasta (ex: `usuario.github.io/pe-na-areia/`), mude o `start_url` no `manifest.json` de `"/"` para `"/pe-na-areia/"`.

---

## Atualizar o cache no futuro

Sempre que fizer mudanças nos arquivos do projeto, mude o número da versão no `sw.js`:

```js
const CACHE_VERSION = 'pe-na-areia-v2'; // incrementa aqui
```

Isso força o navegador a baixar os arquivos novos.
