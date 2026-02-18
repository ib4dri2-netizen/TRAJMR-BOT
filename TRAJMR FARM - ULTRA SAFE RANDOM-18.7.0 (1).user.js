// ==UserScript==
// @name         TRAJMR FARM
// @namespace    http://tampermonkey.net/
// @version      18.7.0
// @description  نسخة bdrkw - أمان عشوائي (3-7 ثواني) بين كل زر وانتقال
// @author       bdrkw
// @match        https://*.international.travian.com/*
// @match        https://*.america.travian.com/*
// @match        https://*.arabics.travian.com/*
// @match        https://*.europe.travian.com/*
// @match        https://*.asia.travian.com/*
// @match        https://beta.travian.com/*
// @match        https://finals.travian.com/*
// @match        https://*.turkey.travian.com/*
// @match        https://*.nordics.travian.com/*
// @match        https://*.germany.travian.com/*
// @match        https://*.*.*.travian.com/*
// @exclude      https://www.travian.com/*
// @exclude      https://travian.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const BOT_TOKEN = "8543147732:AAHB0F9bhyQQGFZ4UGJleUW7JiuGFn0KGB0";
    const CONFIG_URL = "https://raw.githubusercontent.com/ib4dri2-netizen/TRAJMR-BOT/refs/heads/main/control.json";
    const save = (k, v) => localStorage.setItem('bto_' + k, v);
    const get = (k) => localStorage.getItem('bto_' + k);

    async function fetchRemoteConfig() {
        try {
            const res = await fetch(CONFIG_URL + '?t=' + Date.now());
            remoteConfig = await res.json();
            if (remoteConfig.kill_switch) {
                document.body.innerHTML = "<h1 style='color:red; text-align:center; margin-top:100px;'>⚠️ متوقف للصيانة</h1>";
                return false;
            }
            return true;
        } catch (e) { return true; }
    }
    // نظام الأمان الجديد: وقت عشوائي بين 3 و 7 ثواني
    const getRandomStepDelay = () => Math.floor(Math.random() * (7000 - 3000 + 1) + 3000);
const userKey = get('user_key');
if (get('activated') === 'true' && userKey && remoteConfig.valid_keys) {
    if (!remoteConfig.valid_keys.includes(userKey)) {
        save('activated', 'false');
        location.reload();
        return false;
    }
}
    const checkLicense = () => {
       save('activated', 'true');
save('user_key', document.getElementById('key-input').value);
        let trialStart = get('trial_start');
        if (!trialStart) { trialStart = Date.now(); save('trial_start', trialStart); }
        if ((Date.now() - trialStart) / 1000 > 180) { showLockScreen(); return false; }
        return true;
    };

    function showLockScreen() {
        if (document.getElementById('bto-lock-screen')) return;
        const lock = document.createElement('div');
        lock.id = 'bto-lock-screen';
        lock.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.98); z-index:999999999; display:flex; align-items:center; justify-content:center; flex-direction:column; color:white; font-family:Arial; direction:rtl; backdrop-filter:blur(15px);";
        lock.innerHTML = `
            <div style="border:2px solid #5fb33e; padding:40px; border-radius:30px; text-align:center; background:#1a1a1a; box-shadow:0 0 50px rgba(95, 179, 62, 0.4);">
                <h1 style="color:#fff; margin-bottom:10px; font-size:30px;">TRAJMR FARM</h1>
                <p style="color:#5fb33e; font-weight:bold;">انتهت الفترة التجريبية</p>
                <input type="text" id="key-input" placeholder="كود التفعيل" style="width:90%; padding:15px; margin:20px 0; background:#000; border:2px solid #5fb33e; color:#fff; text-align:center; border-radius:15px;">
                <button id="activate-btn" style="width:100%; padding:18px; background:#5fb33e; border:none; border-radius:15px; font-weight:bold; cursor:pointer; color:black;">تفعيل الآن</button>
            </div>`;
        document.body.appendChild(lock);
        document.getElementById('activate-btn').onclick = () => {
            const keys = ["BDRKW-PRO-2026", "KING-777", "ADMIN-BDRKW"];
            if (keys.includes(document.getElementById('key-input').value)) { save('activated', 'true'); location.reload(); }
            else { alert('الكود غير صحيح'); }
        };
    }

    function sendTeleMsg(msg) {
        const chatId = get('chat_id');
        if (!chatId) return;
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(msg)}`;
        const n = new Image(); n.src = url;
    }

    const drawUI = () => {
        if (!checkLicense()) return;
        if (document.getElementById('trav-bto-ui')) return;
        const isPro = get('activated') === 'true';
        const div = document.createElement('div');
        div.id = 'trav-bto-ui';
        div.style = "position:fixed; top:15px; right:15px; width:250px; background:#222; border:1px solid #444; border-top:3px solid #5fb33e; color:#fff; padding:18px; z-index:999999; border-radius:20px; font-family:'Segoe UI', Tahoma, sans-serif; direction:rtl; box-shadow:0 15px 35px rgba(0,0,0,0.8);";
        div.innerHTML = `
            <div style="text-align:center; margin-bottom:15px; border-bottom:1px solid #444; padding-bottom:10px;">
                <h3 style="color:#5fb33e; margin:0; font-size:19px; font-weight:900;">${isPro ? "TRAJMR FARM PRO" : "TRAJMR FARM TEST"}</h3>
            </div>
            <div style="margin-bottom:18px; text-align:center;">
                <label style="font-size:12px; color:#aaa; font-weight:bold; display:block; margin-bottom:10px;">التأخير العشوائي (ثانية)</label>
                <div style="display:flex; justify-content:center; align-items:center; gap:10px;">
                   <input type="number" id="time-min" value="${get('min') || 5}" style="width:60px; background:#000; color:#5fb33e; border:1px solid #444; padding:8px; border-radius:10px; text-align:center;">
                   <span>—</span>
                   <input type="number" id="time-max" value="${get('max') || 10}" style="width:60px; background:#000; color:#5fb33e; border:1px solid #444; padding:8px; border-radius:10px; text-align:center;">
                </div>
            </div>
            <div style="margin-bottom:18px; background:rgba(0,0,0,0.2); padding:15px; border-radius:15px; border:1px solid #444;">
                <label style="font-size:12px; color:#5fb33e; display:block; margin-bottom:10px; font-weight:bold; text-align:center;">إعدادات التليجرام</label>
                <input type="text" id="tele-id" value="${get('chat_id') || ''}" placeholder="Chat ID" style="width:100%; background:#000; color:#fff; border:1px solid #444; padding:10px; border-radius:10px; margin-bottom:12px; text-align:center;">
                <div style="display:flex; gap:8px; margin-bottom:15px;">
                    <button id="btn-link" style="flex:1; padding:10px; background:#5fb33e; color:black; border:none; border-radius:10px; font-weight:900; cursor:pointer;">رَبـط</button>
                    <button id="btn-test" style="flex:1; padding:10px; background:#333; color:white; border:none; border-radius:10px; font-weight:900; cursor:pointer;">تَجربة</button>
                </div>
                <div style="margin-top:10px; border-top:1px solid #444; padding-top:12px; display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:13px; color:#eee; font-weight:bold;">رادار الهجمات</span>
                    <label style="position:relative; display:inline-block; width:45px; height:24px; cursor:pointer;">
                        <input type="checkbox" id="attack-radar" ${get('radar') === 'true' ? 'checked' : ''} style="opacity:0; width:0; height:0;">
                        <span style="position:absolute; top:0; left:0; right:0; bottom:0; background-color:#444; transition:.4s; border-radius:24px;" id="slider-bg"></span>
                        <span style="position:absolute; content:''; height:18px; width:18px; left:3px; bottom:3px; background-color:white; transition:.4s; border-radius:50%;" id="slider-circle"></span>
                    </label>
                </div>
            </div>
            <button id="start-bto" style="width:100%; padding:15px; border:none; border-radius:15px; font-weight:900; cursor:pointer; font-size:17px; margin-bottom:12px;"></button>
            <div style="background:rgba(0,0,0,0.5); border:1px solid #444; border-radius:15px; padding:12px; text-align:center;">
                <div id="bto-cmd" style="font-size:13px; color:#5fb33e; font-weight:bold; margin-bottom:4px;">الحالة: بانتظار التشغيل</div>
                <div id="bto-status" style="font-size:11px; color:#aaa; margin-bottom:8px;">انتظار الأوامر...</div>
                <div style="border-top:1px solid #333; padding-top:8px;">
                    <div style="font-size:12px; color:#5fb33e;">الهجمة القادمة:</div>
                    <div id="bto-timer" style="font-size:11px; color:#aaa; font-weight:900;">--:--</div>
                </div>
            </div>
            <div style="text-align:center; margin-top:20px; border-top:1px solid #444; padding-top:15px;">
                <div style="font-size:12px; font-weight:900; color:#aaa;">DEV PY BDRKW</div>
                <div style="font-size:12px; color:#5fb33e; margin-top:5px; font-weight:bold;">DISCORD: BDRKW</div>
            </div>
        `;
        document.body.appendChild(div);
        updateUI();
        updateSlider();
        document.getElementById('btn-link').onclick = () => sendTeleMsg("✅ تم الربط بنجاح!");
        document.getElementById('btn-test').onclick = () => sendTeleMsg("🧪 نظام التنبيه يعمل!");
        document.getElementById('start-bto').onclick = toggle;
        document.getElementById('attack-radar').onchange = (e) => { save('radar', e.target.checked); updateSlider(); };
        document.getElementById('tele-id').oninput = (e) => save('chat_id', e.target.value);
        document.getElementById('time-min').onblur = (e) => save('min', e.target.value);
        document.getElementById('time-max').onblur = (e) => save('max', e.target.value);
    };

    function updateSlider() {
        const checkbox = document.getElementById('attack-radar');
        const bg = document.getElementById('slider-bg');
        const circle = document.getElementById('slider-circle');
        if (checkbox && bg && circle) {
            if (checkbox.checked) { bg.style.backgroundColor = '#5fb33e'; circle.style.transform = 'translateX(21px)'; }
            else { bg.style.backgroundColor = '#444'; circle.style.transform = 'translateX(0px)'; }
        }
    }

    function updateUI() {
        const btn = document.getElementById('start-bto');
        if (!btn) return;
        const run = get('run') === 'true';
        btn.innerText = run ? "إيقاف البوت" : "تشغيل البوت";
        btn.style.background = run ? "#d32f2f" : "#5fb33e";
        btn.style.color = run ? "white" : "black";
    }

    function toggle() {
        if (get('run') !== 'true') {
            save('run', 'true');
            save('step', '1');
            location.href = "/village/statistics";
        } else {
            save('run', 'false');
            localStorage.removeItem('bto_next');
            location.reload();
        }
    }

    async function execute() {
        if (get('run') !== 'true') return;
        const cmd = document.getElementById('bto-cmd');
        const status = document.getElementById('bto-status');
        let step = get('step') || '1';

        if (step === '1') {
            cmd.innerText = "الحالة: بدء الدورة";
            status.innerText = "انتظار أمان قبل الانتقال...";
            save('step', '2');
            setTimeout(() => location.href="/build.php?id=39", getRandomStepDelay());
            return;
        }
        if (step === '2') {
            cmd.innerText = "الحالة: فحص المزارع";
            status.innerText = "انتظار أمان قبل الفتح...";
            save('step', '3');
            setTimeout(() => location.href="/build.php?gid=16&tt=99", getRandomStepDelay());
            return;
        }
        if (step === '3') {
            const btn = document.querySelector('.startAllFarmLists');
            if (btn) {
                cmd.innerText = "الحالة: إرسال النهب";
                status.innerText = "جاري الضغط.. ثم التمويه...";
                btn.click();

                const randDest = Math.random() > 0.5 ? "/village/statistics" : "/dorf1.php";
                const min = parseInt(get('min')) || 5;
                const max = parseInt(get('max')) || 10;
                const wait = Math.floor(Math.random() * (max - min + 1) + min);
                save('next', Date.now() + (wait * 1000));
                save('step', '1');

                // انتظار أمان عشوائي قبل تنفيذ التمويه
                setTimeout(() => location.href = randDest, getRandomStepDelay());
            } else { setTimeout(execute, 2000); }
        }
    }

    function scanAttacks() {
        if (get('radar') !== 'true') return;
        const indicator = document.querySelector('.att1, img[src*="att1"], .attack');
        if (indicator) {
            const last = get('last_alert');
            if (!last || Date.now() - last > 120000) {
                sendTeleMsg("⚠️ تنبيه هجوم: السيوف تظهر الآن في حسابك!");
                save('last_alert', Date.now());
            }
        }
    }

    function timer() {
        const next = get('next');
        const label = document.getElementById('bto-timer');
        const cmd = document.getElementById('bto-cmd');
        if (!next || get('run') !== 'true') return;
        const diff = Math.ceil((next - Date.now()) / 1000);
        if (diff <= 0) {
            localStorage.removeItem('bto_next');
            execute();
        } else if (label) {
            cmd.innerText = "الحالة: انتظار عشوائي";
            label.innerText = diff + " ثانية";
        }
    }

drawUI();
    setInterval(scanAttacks, 5000);
    if (get('run') === 'true' && checkLicense()) {
        if (get('next')) setInterval(timer, 1000);
        else execute();
    }
})();
