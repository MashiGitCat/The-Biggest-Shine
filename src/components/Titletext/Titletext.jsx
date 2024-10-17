import React, { useEffect } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { ShaderMaterial } from "three";

const chalkShader = {
  uniforms: {
    time: { value: 0.0 },
    color: { value: new THREE.Color(0xf5cf25) },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec3 color;
    varying vec2 vUv;

    
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    
    float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);

      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));

      vec2 u = f*f*(3.0-2.0*f);
      return mix(a, b, u.x) + (c - a)*u.y*(1.0-u.x);
    }

    void main() {
      vec2 pos = vUv * 500.0; 
      pos.y += time * 0.5;    
      float n = noise(pos);   

     
      float alpha = smoothstep(0.4, 0.45, n); 

      gl_FragColor = vec4(color, alpha);
    }
  `,
};

const TitleText = () => {
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const canvasWrapper = document.createElement("div");
    canvasWrapper.style.width = "100%";
    canvasWrapper.style.height = "100vh";
    canvasWrapper.style.backgroundColor = "#0a152c";
    document.body.appendChild(canvasWrapper);
    canvasWrapper.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Load the font
    const loader = new FontLoader();
    loader.load("/fonts/Roboto Slab_Regular.json", (font) => {
      const textGeometry = new TextGeometry("The Biggest Shine", {
        font: font,
        size: 0.2,
        height: 0.01,
        curveSegments: 32,
        bevelEnabled: false,
      });

      const chalkMaterial = new ShaderMaterial({
        uniforms: chalkShader.uniforms,
        vertexShader: chalkShader.vertexShader,
        fragmentShader: chalkShader.fragmentShader,
        transparent: true,
      });

      const textMesh = new THREE.Mesh(textGeometry, chalkMaterial);
      scene.add(textMesh);

      textGeometry.computeBoundingBox();
      const boundingBox = textGeometry.boundingBox;
      const centerX = (boundingBox.max.x - boundingBox.min.x) / 2;
      const centerY = (boundingBox.max.y - boundingBox.min.y) / 2;
      textMesh.position.x = -centerX; // Center text horizontally
      textMesh.position.y = -centerY; // Center text vertically

      camera.position.z = 2;

      // Animation loop
      const animate = function () {
        requestAnimationFrame(animate);
        chalkMaterial.uniforms.time.value += 0.02;
        renderer.render(scene, camera);
      };
      animate();
    });

    // Clean up on component unmount
    return () => {
      renderer.dispose();
      document.body.removeChild(canvasWrapper);
    };
  }, []);

  return null;
};

export default TitleText;
