// chat.js — Joga Audio chatbot widget (bilingüe ES/EN)
(function () {
  'use strict';

  var WORKER_URL = 'https://joga-audio-chat.omhotien90.workers.dev';
  var history = [];
  var open = false;

  var CHAT_STRINGS = {
    es: {
      name:        'Asistente Joga',
      status:      'En línea',
      placeholder: 'Escribe tu pregunta...',
      open_label:  'Abrir chat',
      close_label: 'Cerrar',
      send_label:  'Enviar',
      greeting:    '👋 Hola! Soy tu asistente Joga Audio. ¿Qué quieres mejorar: tu mente, tiempo, hábitos, propósito, dinero o ventas?',
      error:       'No pude conectar. Revisa tu internet e intenta de nuevo.',
      typing:      'Escribiendo...',
    },
    en: {
      name:        'Joga Assistant',
      status:      'Online',
      placeholder: 'Type your question...',
      open_label:  'Open chat',
      close_label: 'Close',
      send_label:  'Send',
      greeting:    '👋 Hi! I\'m your Joga Audio assistant. What do you want to improve: mind, time, habits, purpose, money, or sales?',
      error:       'Could not connect. Check your internet and try again.',
      typing:      'Typing...',
    }
  };

  function getLang() {
    return localStorage.getItem('jiLang') || 'es';
  }

  function s(key) {
    return CHAT_STRINGS[getLang()]?.[key] || CHAT_STRINGS.es[key];
  }

  function init() {
    var wrap = document.createElement('div');
    wrap.id = 'joga-chat';
    wrap.innerHTML =
      '<button class="jc-btn" id="jc-btn" onclick="jogaChatToggle()" aria-label="' + s('open_label') + '">' +
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="currentColor"/></svg>' +
      '</button>' +
      '<div class="jc-panel" id="jc-panel" role="dialog" aria-label="Chat Joga">' +
        '<div class="jc-header">' +
          '<div class="jc-avatar">J</div>' +
          '<div class="jc-header-info">' +
            '<div class="jc-name" id="jc-name">' + s('name') + '</div>' +
            '<div class="jc-status" id="jc-status">' + s('status') + '</div>' +
          '</div>' +
          '<button class="jc-close" onclick="jogaChatToggle()" aria-label="' + s('close_label') + '">&#x2715;</button>' +
        '</div>' +
        '<div class="jc-messages" id="jc-messages">' +
          '<div class="jc-msg jc-bot" id="jc-greeting">' + s('greeting') + '</div>' +
        '</div>' +
        '<div class="jc-input-row">' +
          '<input id="jc-input" type="text" placeholder="' + s('placeholder') + '" autocomplete="off" onkeydown="if(event.key===\'Enter\')jogaChatSend()"/>' +
          '<button class="jc-send" onclick="jogaChatSend()" aria-label="' + s('send_label') + '">&#10148;</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(wrap);
    injectStyles();
  }

  // Called by i18n.js onLangChange hook
  window.jogaChatApplyLang = function () {
    var el;
    el = document.getElementById('jc-name');
    if (el) el.textContent = s('name');
    el = document.getElementById('jc-status');
    if (el) el.textContent = s('status');
    el = document.getElementById('jc-input');
    if (el) el.placeholder = s('placeholder');
    el = document.getElementById('jc-greeting');
    if (el) el.textContent = s('greeting');
  };

  function injectStyles() {
    var s = document.createElement('style');
    s.textContent = [
      '#joga-chat{position:fixed;bottom:24px;right:24px;z-index:9999;font-family:"Inter",system-ui,sans-serif}',
      '.jc-btn{width:54px;height:54px;border-radius:50%;background:#C9A84C;border:none;cursor:pointer;color:#1A1712;',
        'display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(0,0,0,.28);transition:transform .2s}',
      '.jc-btn:hover{transform:scale(1.08)}',
      '.jc-panel{position:absolute;bottom:68px;right:0;width:310px;background:#F7F3EC;border-radius:14px;',
        'box-shadow:0 12px 48px rgba(0,0,0,.2);overflow:hidden;display:none;flex-direction:column}',
      '.jc-panel.open{display:flex}',
      '.jc-header{background:#1A1712;padding:14px 16px;display:flex;align-items:center;gap:10px}',
      '.jc-avatar{width:36px;height:36px;border-radius:50%;background:#C9A84C;color:#1A1712;font-weight:700;',
        'display:flex;align-items:center;justify-content:center;font-family:"Playfair Display",serif;font-size:16px;flex-shrink:0}',
      '.jc-header-info .jc-name{color:#F7F3EC;font-size:13px;font-weight:600}',
      '.jc-header-info .jc-status{color:#C9A84C;font-size:11px}',
      '.jc-close{margin-left:auto;background:none;border:none;color:#8C7D6A;cursor:pointer;font-size:15px;padding:4px;line-height:1}',
      '.jc-messages{height:268px;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:8px;scroll-behavior:smooth}',
      '.jc-msg{max-width:88%;padding:9px 13px;border-radius:10px;font-size:13px;line-height:1.55}',
      '.jc-bot{background:#1A1712;color:#F7F3EC;align-self:flex-start;border-radius:4px 10px 10px 10px}',
      '.jc-user{background:#C9A84C;color:#1A1712;align-self:flex-end;border-radius:10px 4px 10px 10px;font-weight:500}',
      '.jc-typing{color:#8C7D6A;font-style:italic;font-size:12px}',
      '.jc-input-row{display:flex;border-top:1px solid #DDD5C5;background:#fff}',
      '.jc-input-row input{flex:1;border:none;padding:11px 13px;font-size:13px;font-family:inherit;outline:none;background:transparent;color:#2A2318}',
      '.jc-send{background:#C9A84C;border:none;padding:0 15px;cursor:pointer;color:#1A1712;font-size:17px;transition:background .2s}',
      '.jc-send:hover{background:#E8C97A}',
    ].join('');
    document.head.appendChild(s);
  }

  window.jogaChatToggle = function () {
    open = !open;
    var panel = document.getElementById('jc-panel');
    panel.classList.toggle('open', open);
    if (open) setTimeout(function () { document.getElementById('jc-input').focus(); }, 80);
  };

  window.jogaChatSend = async function () {
    var input = document.getElementById('jc-input');
    var text = input.value.trim();
    if (!text) return;
    addMsg(text, 'user');
    input.value = '';
    history.push({ role: 'user', content: text });
    var typing = addMsg(s('typing'), 'bot typing');
    try {
      var res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      var data = await res.json();
      typing.remove();
      var reply = data.reply || s('error');
      addMsg(reply, 'bot');
      history.push({ role: 'assistant', content: reply });
    } catch (e) {
      typing.remove();
      addMsg(s('error'), 'bot');
    }
  };

  function addMsg(text, type) {
    var msgs = document.getElementById('jc-messages');
    var el = document.createElement('div');
    el.className = type === 'user' ? 'jc-msg jc-user' :
                   type.includes('typing') ? 'jc-msg jc-bot jc-typing' : 'jc-msg jc-bot';
    el.textContent = text;
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
    return el;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
