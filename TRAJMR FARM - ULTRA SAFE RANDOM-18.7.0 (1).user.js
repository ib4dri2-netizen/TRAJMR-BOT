// ==UserScript==
// @name         TRAJMR FARM PRO
// @namespace    http://tampermonkey.net/
// @version      20.0.1
// @description  نسخة bdrkw الأصلية - نظام الأمان والتحكم
// @author       bdrkw
// @match        *://*.travian.com/*
// @match        *://*.travian.ae/*
// @match        *://*.travian.com.sa/*
// @match        *://*.travian.net/*
// @match        *://s*.travian.*
// @match        https://*.international.travian.com/*
// @match        https://*.arabics.travian.com/*
// @match        https://*.europe.travian.com/*
// @grant        none
// @run-at       document-end
// ==UserScript==

(function() {
    'use strict';

    // --- الإعدادات الأساسية ---
    const BOT_TOKEN = "8543147732:AAHB0F9bhyQQGFZ4UGJleUW7JiuGFn0KGB0";
    const CONFIG_URL = "https://raw.githubusercontent.com/ib4dri2-netizen/TRAJMR-BOT/refs/heads/main/control.json";
    let remoteConfig = { valid_keys: [], global_message: "BDRKW PRO", kill_switch: false };

    const save = (k, v) => localStorage.setItem('bto_' + k, v);
    const get = (k) => localStorage.getItem('bto_' + k);

    // --- جلب البيانات من السيرفر ---
    async function fetchRemoteConfig() {
        try {
            const res = await fetch(CONFIG_URL + '?t=' + Date.now());
            remoteConfig = await res.json();
            if (remoteConfig.kill_switch === true) {
                document.body.innerHTML = "<h1 style='color:red; text-align:center; margin-top:100px; font-family:Arial; direction:rtl;'>⚠️ البوت متوقف حالياً للصيانة</h1>";
                return false;
            }
            return true;
        } catch (e) { return true; }
    }

    const getRandomStepDelay = () => Math.floor(Math.random() * (7000 - 3000 + 1) + 3000);

    // --- نظام التفعيل ---
    const checkLicense = () => {
        const isActivated = get('activated') === 'true';
        const userKey = get('user_key');
        if (isActivated && userKey && remoteConfig.valid_keys) {
            if (!remoteConfig.valid_keys.includes(userKey)) {
                save('activated', 'false');
                location.reload();
                return false;
            }
            return true;
        }
        let trial = get('trial_start');
        if (!trial) { trial = Date.now(); save('trial_start', trial); }
        if ((Date.now() - trial) / 1000 > 180) { showLock(); return false; }
        return true;
    };

    function showLock() {
        if (document.getElementById('bto-lock')) return;
        const lock = document.createElement('div');
        lock.id = 'bto-lock';
        lock.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.98); z-index:999999; display:flex; align-items:center; justify-content:center; flex-direction:column; color:#fff; direction:rtl; backdrop-filter:blur(10px); font-family:Arial;";
        lock.innerHTML = `<div style='border:2px solid #5fb33e; padding:40px; border-radius:20px; text-align:center; background:#111;'>
            <h2>TRAJMR FARM</h2><p style='color:#5fb33e'>أدخل كود التفعيل</p>
            <input type='text' id='key-in' style='width:80%; padding:10px; margin:20px 0; text-align:center; background:#000; color:#fff; border:1px solid #5fb33e; border-radius:10px;'>
            <button id='act-btn' style='width:100%; padding:10px; background:#5fb33e; border:none; border-radius:10px; font-weight:bold; cursor:pointer; color:black;'>تفعيل النسخة</button></div>`;
        document.body.appendChild(lock);
        document.getElementById('act-btn').onclick = () => {
            const val = document.getElementById('key-in').value;
            if (remoteConfig.valid_keys.includes(val)) { save('activated', 'true'); save('user_key', val); location.reload(); }
            else { alert('الكود غير صحيح'); }
        };
    }

    // --- الواجهة الرسومية (UI) ---
    function sendTeleMsg(msg) {
        const chatId = get('chat_id');
        if (!chatId) return;
        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(msg)}`);
    }

    const drawUI = () => {
        if (!checkLicense()) return;
        if (document.getElementById('trav-bto-ui')) return;
        const div = document.createElement('div');
        div.id = 'trav-bto-ui';
        div.style = "position:fixed; top:15px; right:15px; width:240px; background:#222; border-top:3px solid #5fb33e; color:#fff; padding:15px; z-index:99999; border-radius:15px; direction:rtl; font-family:Arial; box-shadow:0 10px 30px #000;";
        div.innerHTML = `
            <h3 style='text-align:center; color:#5fb33e; margin:0 0 10px 0;'>TRAJMR PRO</h3>
            <input type="text" id="tele-id" value="${get('chat_id') || ''}" placeholder="Telegram ID" style="width:90%; background:#000; color:#fff; border:1px solid #444; padding:8px; margin-bottom:10px; text-align:center; border-radius:8px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:12px;">
                <span>رادار الهجمات</span>
                <input type="checkbox" id="attack-radar" ${get('radar') === 'true' ? 'checked' : ''}>
            </div>
            <button id='start-btn' style='width:100%; padding:12px; font-weight:bold; cursor:pointer; border-radius:10px; border:none;'></button>
            <div id='bto-timer' style='text-align:center; margin-top:10px; font-size:16px; font-weight:bold;'>--:--</div>
            <div style='text-align:center; font-size:10px; color:#5fb33e; margin-top:10px;'>${remoteConfig.global_message}</div>
        `;
        document.body.appendChild(div);
        
        const btn = document.getElementById('start-btn');
        const run = get('run') === 'true';
        btn.innerText = run ? "إيقاف البوت" : "تشغيل البوت";
        btn.style.background = run ? "#d32f2f" : "#5fb33e";
        btn.style.color = run ? "white" : "black";
        
        btn.onclick = () => {
            if (get('run') !== 'true') { save('run', 'true'); save('step', '1'); location.href="/village/statistics"; }
            else { save('run', 'false'); location.reload(); }
        };
        document.getElementById('attack-radar').onchange = (e) => save('radar', e.target.checked);
        document.getElementById('tele-id').onblur = (e) => save('chat_id', e.target.value);
    };

    // --- منطق البوت ---
    async function execute() {
        if (get('run') !== 'true') return;
        let step = get('step') || '1';
        if (step === '1') {
            save('step', '2');
            setTimeout(() => location.href="/build.php?gid=16&tt=99", getRandomStepDelay());
        } else if (step === '2') {
            const btn = document.querySelector('.startAllFarmLists');
            if (btn) {
                btn.click();
                save('step', '1');
                const wait = Math.floor(Math.random() * 10) + 5;
                save('next', Date.now() + (wait * 1000));
                setTimeout(() => location.href="/village/statistics", getRandomStepDelay());
            } else { setTimeout(execute, 2000); }
        }
    }

    function timer() {
        const next = get('next');
        const label = document.getElementById('bto-timer');
        if (!next || get('run') !== 'true' || !label) return;
        const diff = Math.ceil((next - Date.now()) / 1000);
        if (diff <= 0) { localStorage.removeItem('bto_next'); execute(); }
        else { label.innerText = "النهب القادم: " + diff + " ثانية"; }
    }

    // --- التشغيل ---
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
