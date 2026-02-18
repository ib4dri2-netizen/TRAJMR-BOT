// ==UserScript==
// @name         TRAJMR FARM
// @namespace    http://tampermonkey.net/
// @version      18.9.0
// @description  نسخة bdrkw المستقرة
// @author       bdrkw
// @match        *://*.travian.*/*
// @grant        none
// @run-at       document-end
// ==UserScript==

(function() {
    'use strict';

    // --- الإعدادات ---
    const CONFIG_URL = "https://raw.githubusercontent.com/ib4dri2-netizen/TRAJMR-BOT/refs/heads/main/control.json";
    let remoteConfig = { valid_keys: [], global_message: "BDRKW PRO", kill_switch: false };

    const save = (k, v) => localStorage.setItem('bto_' + k, v);
    const get = (k) => localStorage.getItem('bto_' + k);

    // --- جلب التحكم من GitHub ---
    async function fetchRemoteConfig() {
        try {
            const res = await fetch(CONFIG_URL + '?t=' + Date.now());
            remoteConfig = await res.json();
            if (remoteConfig.kill_switch === true) {
                document.body.innerHTML = "<h1 style='color:red; text-align:center; margin-top:100px;'>⚠️ متوقف للصيانة</h1>";
                return false;
            }
            return true;
        } catch (e) { return true; }
    }

    // --- فحص التفعيل ---
    const checkLicense = () => {
        if (get('activated') === 'true') return true;
        let trial = get('trial_start');
        if (!trial) { trial = Date.now(); save('trial_start', trial); }
        if ((Date.now() - trial) / 1000 > 180) { showLock(); return false; }
        return true;
    };

    function showLock() {
        if (document.getElementById('bto-lock')) return;
        const lock = document.createElement('div');
        lock.id = 'bto-lock';
        lock.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:#000; z-index:999999; display:flex; align-items:center; justify-content:center; flex-direction:column; color:#fff; direction:rtl;";
        lock.innerHTML = `<h2>TRAJMR FARM</h2><p>أدخل كود التفعيل:</p><input type='text' id='key-in'><button id='act-btn'>تفعيل</button>`;
        document.body.appendChild(lock);
        document.getElementById('act-btn').onclick = () => {
            const val = document.getElementById('key-in').value;
            if (remoteConfig.valid_keys.includes(val)) { save('activated', 'true'); location.reload(); }
            else { alert('الكود خطأ'); }
        };
    }

    // --- الواجهة ---
    const drawUI = () => {
        if (!checkLicense()) return;
        const div = document.createElement('div');
        div.style = "position:fixed; top:10px; right:10px; background:#222; border:1px solid #5fb33e; color:#fff; padding:10px; z-index:9999; border-radius:10px; direction:rtl;";
        div.innerHTML = `<h3>TRAJMR PRO</h3><button id='start-btn' style='width:100%'>تشغيل</button><div id='timer' style='text-align:center'>--</div>`;
        document.body.appendChild(div);
        
        const btn = document.getElementById('start-btn');
        const run = get('run') === 'true';
        btn.innerText = run ? "إيقاف" : "تشغيل";
        btn.onclick = () => {
            if (get('run') !== 'true') { save('run', 'true'); location.reload(); }
            else { save('run', 'false'); location.reload(); }
        };
    };

    // --- التشغيل النهائي ---
    fetchRemoteConfig().then(allowed => {
        if (allowed) drawUI();
    });

})();
