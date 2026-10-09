(function () {
  'use strict';
  const config = window.BOTHR_CONFIG || {};
  const links = config.links || {};
  const memes = [
    {title:'Human error', file:'meme-01-human-error', caption:'Change everything. Keep it exactly the same. HUMAN ERROR.', alt:'Bot HR stamps Human Error after a contradictory request.'},
    {title:'Case reopened', file:'meme-02-case-reopened', caption:'One last edit. CASE REOPENED.', alt:'Bot HR reopens an overstuffed folder after one last edit.'},
    {title:'Clarification required', file:'meme-03-clarification-required', caption:'Make it shorter. Include every detail. CLARIFICATION REQUIRED.', alt:'Bot HR pauses with scissors and a long answer, requesting clarification.'},
    {title:'Work 24/7', file:'meme-04-work-24-7', caption:"You're just AI. Work 24/7. HUMAN ERROR.", alt:'Bot HR stamps Human Error after a request to work around the clock.'}
  ];
  const $ = function (selector) { return document.querySelector(selector); };
  const safeUrl = function (value) {
    try { const u = new URL(value); return u.protocol === 'https:' ? u.href : ''; }
    catch (_) { return ''; }
  };
  const address = typeof config.contractAddress === 'string' && /^0x[a-fA-F0-9]{40}$/.test(config.contractAddress) ? config.contractAddress : '';
  let activeMeme = null;
  let toastTimer;

  function notify(message) {
    const toast = $('#toast');
    const modal = document.querySelector('dialog[open]');
    (modal || document.body).appendChild(toast);
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('visible'); }, 2400);
  }
  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const field = document.createElement('textarea');
        field.value = text;
        field.style.position = 'fixed';
        field.style.left = '-9999px';
        document.body.appendChild(field);
        field.select();
        const copied = document.execCommand('copy');
        field.remove();
        if (!copied) throw new Error('Copy unavailable');
      }
      notify('Copied.');
    } catch (_) { notify('Copy unavailable. Select the text and copy it manually.'); }
  }
  function openDialog(dialog) {
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('modal-open');
  }
  function linkButton(label, value) {
    const href = safeUrl(value);
    if (!href) return null;
    const a = document.createElement('a');
    a.className = 'button button-paper';
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = label + ' ↗';
    return a;
  }
  function buildFacts() {
    const pending = 'Pending';
    const facts = [
      ['Name', config.name || 'Bot HR'],
      ['Ticker', config.ticker ? '$' + String(config.ticker).replace(/^\$/, '') : pending],
      ['Network', config.network || 'Ethereum'],
      ['Supply', config.supply || pending],
      ['Buy tax', config.buyTax === '' || config.buyTax == null ? pending : config.buyTax],
      ['Sell tax', config.sellTax === '' || config.sellTax == null ? pending : config.sellTax],
      ['Liquidity', config.liquidityStatus || pending],
      ['Ownership', config.ownershipStatus || pending]
    ];
    const root = $('#token-facts');
    facts.forEach(function (fact) {
      const wrap = document.createElement('div');
      wrap.className = 'token-fact';
      const dt = document.createElement('dt');
      const dd = document.createElement('dd');
      dt.textContent = fact[0]; dd.textContent = String(fact[1]);
      wrap.append(dt, dd); root.appendChild(wrap);
    });
    $('#launch-status').textContent = config.launchStatus || 'Launch details pending';
    $('#contract-address').textContent = address || 'Not announced yet';
    $('#copy-contract').disabled = !address;
    if (address) {
      const explorer = linkButton('Etherscan', 'https://etherscan.io/token/' + address);
      $('#token-links').appendChild(explorer);
      [['Buy', links.buy], ['DEXScreener', links.dexscreener], ['DEXTools', links.dextools]].forEach(function (entry) {
        const link = linkButton(entry[0], entry[1]);
        if (link) $('#token-links').appendChild(link);
      });
    }
    let socialCount = 0;
    [['Telegram', links.telegram], ['X', links.x]].forEach(function (entry) {
      const link = linkButton(entry[0], entry[1]);
      if (link) { $('#community-links').appendChild(link); socialCount++; }
    });
    $('#community-pending').hidden = socialCount > 0;
    const siteUrl = safeUrl(config.siteUrl);
    if (siteUrl) {
      document.querySelector('meta[property="og:url"]').content = siteUrl;
      document.querySelector('meta[property="og:image"]').content = new URL('assets/web/banner-1920x640.jpg', siteUrl.endsWith('/') ? siteUrl : siteUrl + '/').href;
    }
  }
  function openMeme(meme) {
    activeMeme = meme;
    $('#meme-title').textContent = meme.title;
    $('#meme-preview').src = 'assets/web/' + meme.file + '.webp';
    $('#meme-preview').alt = meme.alt;
    $('#meme-download').href = 'assets/png/' + meme.file + '.png';
    $('#meme-download').download = meme.file + '.png';
    openDialog($('#meme-dialog'));
  }
  function buildMemes() {
    memes.forEach(function (meme) {
      const card = document.createElement('article');
      card.className = 'meme-card';
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'meme-art';
      button.setAttribute('aria-label', 'Open ' + meme.title + ' meme');
      const picture = document.createElement('picture');
      picture.dataset.imageArea = '';
      const source = document.createElement('source');
      source.type = 'image/webp'; source.srcset = 'assets/web/' + meme.file + '.webp';
      const img = document.createElement('img');
      img.src = 'assets/png/' + meme.file + '.png'; img.alt = meme.alt;
      img.width = 1200; img.height = 1200; img.loading = 'lazy'; img.decoding = 'async';
      picture.append(source, img); button.appendChild(picture);
      button.addEventListener('click', function () { openMeme(meme); });
      const copy = document.createElement('button');
      copy.type = 'button'; copy.className = 'text-action'; copy.textContent = 'Copy caption';
      copy.addEventListener('click', function () { copyText(meme.caption); });
      const download = document.createElement('a');
      download.className = 'text-action'; download.href = 'assets/png/' + meme.file + '.png';
      download.download = meme.file + '.png'; download.textContent = 'Download PNG';
      const caption = document.createElement('p');
      caption.className = 'meme-caption'; caption.textContent = meme.title;
      const actions = document.createElement('div');
      actions.className = 'meme-card-actions'; actions.append(download, copy);
      const live = document.createElement('div');
      live.dataset.liveArea = ''; live.append(caption, actions);
      card.append(button, live); $('#meme-grid').appendChild(card);
    });
  }
  document.querySelectorAll('[data-open]').forEach(function (button) {
    button.addEventListener('click', function () { openDialog(document.getElementById(button.dataset.open)); });
  });
  document.querySelectorAll('dialog').forEach(function (dialog) {
    dialog.addEventListener('close', function () {
      if (!document.querySelector('dialog[open]')) document.body.classList.remove('modal-open');
    });
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) {
        const box = dialog.getBoundingClientRect();
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
      }
    });
    dialog.querySelector('[data-close]').addEventListener('click', function () { dialog.close(); });
  });
  $('#copy-contract').addEventListener('click', function () { if (address) copyText(address); });
  $('#meme-copy').addEventListener('click', function () { if (activeMeme) copyText(activeMeme.caption); });
  buildFacts();
  buildMemes();
})();
