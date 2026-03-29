document.body.classList.add('js-enabled');
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';

const btn = document.querySelector("#theme-btn");

if (btn) {

    btn.addEventListener("click", () => {
        
        if (document.body.classList.contains("dark-theme")) {
            document.body.classList.replace("dark-theme", "light-theme");
            localStorage.setItem("theme", "light");
        } else {
            document.body.classList.replace("light-theme", "dark-theme");
            localStorage.setItem("theme", "dark");
        }
    });
    //radsi ukladam predchozi stav, kdyby treba v noci nekdo omylem tu stranku zavrel a s nastavenim system light modu by mu to tu stranku z dark modu zase hodilo na light
    const savedTheme = localStorage.getItem("theme") || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.body.classList.add(`${savedTheme}-theme`);
}

document.addEventListener('DOMContentLoaded', () => {
    const stackContainer = document.querySelector('.project-stack-container');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => 
            {
            if (entry.isIntersecting) 
            {
                stackContainer.classList.add('active');
            } 
            else 
            {
            
                stackContainer.classList.remove('active');
            }
        });
    }, { threshold: 0.5 });

    observer.observe(stackContainer);


    const vsechnyFade = document.querySelectorAll('.animatedSections');
    const obsrv = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animatedSectionSet');
                obsrv.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    vsechnyFade.forEach(el => obsrv.observe(el));

});

//navbar hamburger menu
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('lstOfHrefs');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navMenu.classList.toggle('active');
        
        // Bonus pro přístupnost (WCAG)
        const expanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !expanded);
    });

    // Zavřít menu po kliknutí na odkaz (aby nezaclánělo po odscrollování)
    document.querySelectorAll('#lstOfHrefs a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navMenu.classList.remove('active');
        });
    });
}



// rotujici cigareta - snad nevadi ze jsem pouzil three js, ale prislo mi to vhodne k bodu 9)
const container = document.getElementById('cigo-container');
if (container) 
    {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(100, 1, 0.1, 2000);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(200, 200);
    container.appendChild(renderer.domElement);
    
    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);
    const topLight = new THREE.DirectionalLight(0xffffff, 1);
    topLight.position.set(300, 300, 300);
    scene.add(topLight);

    let model;
    const loader = new GLTFLoader();

    loader.load('models/cigarette_-_smoke_on.glb', (gltf) => 
    {
        model = gltf.scene;
        scene.add(model);
        model.rotation.y = Math.PI / 2;
    }, undefined, (error) => console.error(error));

    camera.position.z = 5;
    let startTime = Date.now();

    function animate() {
        requestAnimationFrame(animate);
        if (model) {
            const casTed = (Date.now() - startTime) * 0.001;
            const angle = Math.sin(casTed  * 0.7)* 1.5; 
            model.rotation.y = angle +30;
            model.rotation.x = window.scrollY* 0.0007;
        }
        renderer.render(scene, camera);
    }
    animate();
}