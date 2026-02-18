// ==UserScript==
// @name         TRAJMR FARM
// @namespace    http://tampermonkey.net/
// @version      18.8.2
// @description  النسخة الأصلية المستقرة - bdrkw
// @author       bdrkw
// @match        *://*.travian.com/*
// @match        *://*.travian.ae/*
// @match        *://*.travian.com.sa/*
// @match        *://*.travian.net/*
// @match        *://s*.travian.*
// @match        https://*.international.travian.com/*
// @match        https://*.america.travian.com/*
// @match        https://*.arabics.travian.com/*
// @match        https://*.europe.travian.com/*
// @match        https://*.asia.travian.com/*
// @grant        none
// @run-at       document-end
// ==UserScript==

(function() {
    'use strict';

    const BOT_TOKEN = "8543147732:AAHB0F9bhyQQGFZ4UGJleUW7JiuGFn0KGB0";
    const CONFIG_URL = "https://raw.githubusercontent.com/ib4dri2-netizen/TRAJMR-BOT/refs/heads/main/control.json";
    
    let remoteConfig = { valid_keys: ["BDRKW-PRO-2026", "KING-777", "ADMIN-BDRKW"], global_message: "BDRKW PRO", kill_switch: false };

    const save = (k, v) => localStorage.setItem('bto_' + k, v);
    const get = (k) => localStorage.getItem('bto_' + k);

    async function fetchRemoteConfig() {
        try {
            const res = await fetch(CONFIG_URL + '?t=' + new Date().getTime());
            const data = await res.json();
            remoteConfig = data;
            if (remoteConfig.kill_switch === true) {
                document.body.innerHTML = "<h1 style='color:red; text-align:center; margin-top:100px;'>⚠️ البوت متوقف حالياً للصيانة</h1>";
                return false;
            }
            return true;
        } catch (e) { return true; }
    }

    const checkLicense = () => {
        if (get('activated') === 'true') return true;
        let trialStart = get('trial_start');
        if (!trialStart) { trialStart = Date.now(); save('trial_start', trialStart); }
        if ((Date.now() - trialStart) / 1000 > 180) { 
            showLockScreen(); 
            return false; 
        }
        return true;
    };

    function showLockScreen() {
        if (document.getElementById('bto-lock-screen')) return;
        const lock = document.createElement('div');
        lock.id = 'bto-lock-screen';
        lock.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); z-index:999999999; display:flex; align-items:center; justify-content:center; flex-direction:column; color:white; font-family:Arial; direction:rtl;";
        lock.innerHTML = `
            <div style="border:2px solid #5fb33e; padding:30px; border-radius:15px; text-align:center; background:#111;">
                <h1>TRAJMR FARM</h1>
                <p>يرجى إدخال كود التفعيل</p>
                <input type="text" id="key-input" style="width:80%; padding:10px; margin:10px 0; text-align:center;">
                <button id="activate-btn" style="width:85%; padding:10px; background:#5fb33e; border:none; cursor:pointer; color:black; font-weight:bold;">تفعيل</button>
            </div>`;
        document.body.appendChild(lock);
        document.getElementById('activate-btn').onclick = () => {
            const val = document.getElementById('key-input').value;
            if (remoteConfig.valid_keys.includes(val)) { save('activated', 'true'); location.reload(); }
            else { alert('الكود غلط'); }
        };
    }

    const drawUI = () => {
        if (!checkLicense()) return;
        if (document.getElementById('trav-bto-ui')) return;
        const div = document.createElement('div');
        div.id = 'trav-bto-ui';
        div.style = "position:fixed; top:10px; right:10px; width:220px; background:#222; border:1px solid #5fb33e; color:#fff; padding:15px; z-index:999999; border-radius:10px; font-family:Arial; direction:rtl;";
        div.innerHTML = `
            <h3 style="text-align:center; color:#5fb33e; margin-top:0;">TRAJMR FARM</h3>
            <button id="start-bto" style="width:100%; padding:10px; cursor:pointer; font-weight:bold;"></button>
            <div id="bto-timer" style="text-align:center; margin-top:10px; font-size:18px;">--:--</div>
            <div style="text-align:center; font-size:10px; margin-top:10px;">${remoteConfig.global_message}</div>
        `;
        document.body.appendChild(div);
        updateUI();
        document.getElementById('start-bto').onclick = () => {
            if (get('run') !== 'true') { save('run', 'true'); location.href = "/village/statistics"; }
            else { save('run', 'false'); location.reload(); }
        };
    };

    function updateUI() {
        const btn = document.getElementById('start-bto');
        if (!btn) return;
        const run = get('run') === 'true';
        btn.innerText = run ? "إيقاف" : "تشغيل";
        btn.style.background = run ? "#ff4d4d" : "#5fb33e";
    }

    async function execute() {
        if (get('run') !== 'true') return;
        const btn = document.querySelector('.startAllFarmLists');
        if (btn) {
            btn.click();
            const wait = Math.floor(Math.random() * 10) + 5;
            save('next', Date.now() + (wait * 1000));
            setTimeout(() => location.reload(), 3000);
        } else {
            setTimeout(() => location.href="/build.php?gid=16&tt=99", 3000);
        }
    }

    function timer() {
        const next = get('next');
        const label = document.getElementById('bto-timer');
        if (!next || get('run') !== 'true') return;
        const diff = Math.ceil((next - Date.now()) / 1000);
        if (diff <= 0) { localStorage.removeItem('bto_next'); execute(); }
        else if (label) { label.innerText = diff + " ثانية"; }
    }

    fetchRemoteConfig().then(allowed => {
        if (allowed) {
            drawUI();
            if (get('run') === 'true' && checkLicense()) {
                if (get('next')) setInterval(timer, 1000);
                else execute();
            }
        }
    });

})();
