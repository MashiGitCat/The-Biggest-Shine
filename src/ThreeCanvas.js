import React, { useEffect } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import SimplexNoise from "simplex-noise";

const ThreeCanvas = () => {
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
    document.body.appendChild(renderer.domElement);

    camera.position.z = 50;

    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    const noise = new SimplexNoise();

    const loader = new FontLoader();
    loader.load("/path/to/font.json", (font) => {
      const textGeometry = new TextGeometry("The Biggest Shine", {
        font: font,
        size: 10,
        height: 1,
        curveSegments: 12,
      });

      const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.2 });
      const particles = new THREE.Points(textGeometry, material);
      scene.add(particles);

      const animateParticles = () => {
        const time = performance.now() * 0.0005;

        particles.geometry.vertices.forEach((vertex, i) => {
          const noiseValue = noise.noise3D(
            vertex.x * 0.1,
            vertex.y * 0.1,
            time
          );
          vertex.x += noiseValue * 0.05;
          vertex.y += noiseValue * 0.05;
          vertex.z += noiseValue * 0.05;
        });

        particles.geometry.verticesNeedUpdate = true;
      };

      const animate = () => {
        requestAnimationFrame(animate);
        animateParticles();
        renderer.render(scene, camera);
      };

      animate();
    });

    window.addEventListener("resize", () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });

    return () => {
      window.removeEventListener("resize", () => {});
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return <div />;
};

export default ThreeCanvas;
