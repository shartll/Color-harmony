const cards = document.querySelectorAll('.card');
const button = document.querySelector('.generateBtn');
const hex = document.querySelectorAll('.hex-text');
const copyText = document.querySelectorAll('.copy');
const harmonyBtns = document.querySelectorAll('.harmony-btn');
const roleText = document.querySelectorAll('.role-text');
let currentHarmony = "analogous";

const initialBtn = Array.from(harmonyBtns)  .find(btn => btn.classList.contains('active'));
moveIndicator(initialBtn);
const fanPositions = [
    { x: 0 },
    { x: -375 },
    { x: 375 },
    { x: -750 },
    { x: 750 }
];

function getRandomHue(){
    return getRandomInRange(0, 360);
}

function getRandomInRange(min, max){
    return Math.floor(Math.random() * (max - min) + min);
}

function generateAnalogusHues(baseHue){
    let cards = [baseHue];
    for(let i = 1; i < 5; i++){
        let a = (baseHue + i * 25) % 360;
        cards.push(a);
    }
    return cards;
}

function generateTriadHues(baseHue){
    let points = [];

    let secondPoint = (baseHue + 120) % 360;
    let thirdPoint = (secondPoint + 120) % 360;
    let fourthPoint = (thirdPoint + getRandomInRange(10, 20)) % 360;  
    let fifthPoint = (thirdPoint + getRandomInRange(20, 40)) % 360;

    points.push(baseHue,secondPoint,thirdPoint,fourthPoint,fifthPoint);
    return points;  
}

function generateComplementaryHues(baseHue){
    let points = [];

    let secondPoint = (baseHue + 180) % 360;
    let thirdPoint = (secondPoint + getRandomInRange(10, 40)) % 360;  
    let fourthPoint = (thirdPoint + getRandomInRange(10, 40)) % 360;  
    let fifthPoint = (fourthPoint + getRandomInRange(10, 40)) % 360;

    points.push(baseHue,secondPoint,thirdPoint,fourthPoint,fifthPoint);
    return points;  
}

function generateSplitComplementaryHues(baseHue){
    let points = [];

    let secondPoint = (baseHue + 150) % 360;
    let thirdPoint = (baseHue + 210) % 360;
    let fourthPoint = (thirdPoint + getRandomInRange(10, 40)) % 360;  
    let fifthPoint = (secondPoint + getRandomInRange(10, 40)) % 360;

    points.push(baseHue,secondPoint,thirdPoint,fourthPoint,fifthPoint);
    return points;
}

function pickRandomHarmony(){
    const harmonies = ["analogous", "triad", "complementary", "splitComplementary"];
    const index = getRandomInRange(0, harmonies.length);
    return harmonies[index];
}


function hslToString(h,s,l){
    return `hsl(${h},${s}%,${l}%)`;
}

function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

function assignRole(hue, role){
    if(role == "accent"){
        let s = getRandomInRange(65,80);
        let l = getRandomInRange(45,55);
        return {
            hsl: hslToString(hue, s, l),
            hex: hslToHex(hue, s, l)
        };
    } else if(role == "accent2"){
        let s = getRandomInRange(55,70);
        let l = getRandomInRange(45,55);
        return {
            hsl: hslToString(hue, s, l),
            hex: hslToHex(hue, s, l)
        }
    } else if(role == "light"){
        let s = getRandomInRange(20,35);
        let l = getRandomInRange(85,92);
        return {
            hsl: hslToString(hue, s, l),
            hex: hslToHex(hue, s, l)
        }
    } else if(role == "dark"){
        let s = getRandomInRange(25,35);
        let l = getRandomInRange(15,25);
        return {
            hsl: hslToString(hue, s, l),
            hex: hslToHex(hue, s, l)
        }
    } else if(role == "neutral"){
        let s = getRandomInRange(10,20);
        let l = getRandomInRange(55,65);
        return {
            hsl: hslToString(hue, s, l),
            hex: hslToHex(hue, s, l)
        }
    } else {
        console.error("Неверная роль");
        return null; 
    }
}

function getContrastColor(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    return brightness > 128 ? '#000000' : '#ffffff';
}

function generatePalette(currentHarmony = "analogous"){
    let baseHue = getRandomHue();
    let harmonyType = currentHarmony;
    let hues = [];
    let palette = [];

    if(harmonyType == "analogous"){
        hues = generateAnalogusHues(baseHue);
    } else if(harmonyType == "triad"){
        hues = generateTriadHues(baseHue);
    } else if(harmonyType == "complementary"){
        hues = generateComplementaryHues(baseHue);
    } else if(harmonyType == "splitComplementary"){
        hues = generateSplitComplementaryHues(baseHue);
    } else {
        console.error("Неизвестный тип");
        return null;
    }

    let roles = ["accent", "accent2", "light", "dark", "neutral"]

    for(let i = 0; i < hues.length; i++){
        palette.push(assignRole(hues[i], roles[i]));
    }

    return palette;
}

function applyPalette(palette){
    for(let i = 0; i < cards.length; i++){
        cards[i].style.backgroundColor = palette[i].hsl;
        hex[i].textContent = palette[i].hex;
        hex[i].style.color = getContrastColor(palette[i].hex);
        copyText[i].style.color = getContrastColor(palette[i].hex);
        roleText[i].style.color = getContrastColor(palette[i].hex);
    }
}

function showToast() {
    const toast = document.querySelector('.toast');
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

cards.forEach((card) =>{
    card.addEventListener('click', ()=>{
        const hexText = card.querySelector('.hex-text').textContent;
        navigator.clipboard.writeText(hexText).then(() => {
            showToast();
        })
    })
})

harmonyBtns.forEach((harmonyBtn) => {
    harmonyBtn.addEventListener('click', () =>{
        currentHarmony = harmonyBtn.dataset.harmony;

        harmonyBtns.forEach((btn) => btn.classList.remove('active'));   
        harmonyBtn.classList.add('active');
        moveIndicator(harmonyBtn)
    })
})

function moveIndicator(button) {
    const indicator = document.querySelector('.harmony-indicator');
    const container = document.querySelector('.harmony-selector');
    
    const btnRect = button.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    indicator.style.width = btnRect.width + 'px';
    indicator.style.left = (btnRect.left - containerRect.left) + 'px';
}





// GSAP
let isAnimating = false;
gsap.set('.card', {
    x: (i) => fanPositions[i].x
});

button.addEventListener('click', () => {
    if(isAnimating) return;

    isAnimating = true;
    const tl = gsap.timeline({
        onComplete: () =>{
            isAnimating = false;
        }
    });

    tl.to('.card', {
        x: 0,
        y: 0,
        rotation: 0,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
            applyPalette(generatePalette(currentHarmony));
        }
    })
    .to('.card', {
    x: (i) => fanPositions[i].x,
    y: (i) => fanPositions[i].y,
    rotation: (i) => fanPositions[i].rotation,
    duration: 0.5,
    ease: "power2.inOut"
}, "+=0.2");
})

document.addEventListener('keydown', (event) => {
    if(event.code === 'Space'){
        event.preventDefault();
        if(isAnimating) return;

        isAnimating = true;
        const tl = gsap.timeline({
            onComplete: () =>{
                isAnimating = false;
            }
        });

        tl.to('.card', {
            x: 0,
            y: 0,
            rotation: 0,
            duration: 0.4,
            ease: "power2.inOut",
            onComplete: () => {
                applyPalette(generatePalette(currentHarmony));
            }
        })
        .to('.card', {
        x: (i) => fanPositions[i].x,
        y: (i) => fanPositions[i].y,
        rotation: (i) => fanPositions[i].rotation,
        duration: 0.5,
        ease: "power2.inOut"
    }, "+=0.2");
    }
})

