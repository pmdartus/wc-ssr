// From: skatejs @skatejs/ssr package
// Copyright: Trey Shugart <treshugart@gmail.com>
// https://github.com/skatejs/skatejs/blob/1826445409db7e21cab8853ddebf32409c29679a/packages/ssr/index.js#L3
function __ssr() {var r,s=document.currentScript,f=s.parentNode;h=f.parentNode;f.removeChild(s);h.removeChild(f);r=h.attachShadow({mode:h.getAttribute('mode')||'open'});while(f&&f.firstChild)r.appendChild(f.firstChild);}