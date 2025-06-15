<template>
  <div class="street-view-container">
    <div ref="container" class="three-container"></div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default {
  name: 'StreetView',
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      controls: null,
      buildings: [],
      clock: new THREE.Clock(),
    };
  },
  mounted() {
    this.initThree();
    this.createScene();
    this.animate();
  },
  beforeUnmount() {
    this.dispose();
  },
  methods: {
    initThree() {
      // 创建场景
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x87ceeb); // 天空蓝色

      // 创建相机
      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      this.camera.position.set(0, 2, 5);

      // 创建渲染器
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.shadowMap.enabled = true;
      this.$refs.container.appendChild(this.renderer.domElement);

      // 添加轨道控制器
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;

      // 添加环境光和平行光
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      this.scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 5, 5);
      directionalLight.castShadow = true;
      this.scene.add(directionalLight);

      // 监听窗口大小变化
      window.addEventListener('resize', this.onWindowResize);
    },

    createScene() {
      // 创建地面
      const groundGeometry = new THREE.PlaneGeometry(100, 100);
      const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x808080,
        roughness: 0.8,
      });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      this.scene.add(ground);

      // 创建建筑物
      this.createBuildings();
    },

    createBuildings() {
      // 创建一些简单的建筑物
      for (let i = 0; i < 20; i++) {
        const height = Math.random() * 10 + 5;
        const width = Math.random() * 4 + 2;
        const depth = Math.random() * 4 + 2;

        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(Math.random(), Math.random(), Math.random()),
          roughness: 0.7,
        });

        const building = new THREE.Mesh(geometry, material);
        building.position.x = Math.random() * 40 - 20;
        building.position.z = Math.random() * 40 - 20;
        building.position.y = height / 2;
        building.castShadow = true;
        building.receiveShadow = true;

        this.scene.add(building);
        this.buildings.push(building);
      }
    },

    animate() {
      requestAnimationFrame(this.animate);
      
      // 更新控制器
      this.controls.update();

      // 渲染场景
      this.renderer.render(this.scene, this.camera);
    },

    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },

    dispose() {
      // 清理资源
      window.removeEventListener('resize', this.onWindowResize);
      this.renderer.dispose();
      this.scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    },
  },
};
</script>

<style scoped>
.street-view-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.three-container {
  width: 100%;
  height: 100%;
}
</style>
