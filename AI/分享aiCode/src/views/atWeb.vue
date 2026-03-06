<template>
  <div class="street-3d-container">
    <div id="three-container" ref="threeContainer"></div>
    <div class="controls">
      <div class="info-panel">
        <h3>长沙雨花区长沙大道3D地图</h3>
        <p>坐标: 112.9855°E, 28.1855°N</p>
        <p>范围: 500米</p>
        <p>时间: {{ currentTime }}</p>
        <div class="control-buttons">
          <button @click="resetCamera">重置视角</button>
          <button @click="toggleWireframe">{{ wireframe ? '关闭' : '开启' }}线框模式</button>
          <button @click="toggleAnimation">{{ animation ? '暂停' : '开始' }}动画</button>
          <button @click="toggleWeather">{{ weather ? '关闭' : '开启' }}天气效果</button>
          <button @click="toggleTraffic">{{ traffic ? '关闭' : '开启' }}交通流量</button>
          <button @click="changeTimeOfDay">切换时间</button>
        </div>
        <div class="stats">
          <p>FPS: {{ fps }}</p>
          <p>建筑物: {{ buildingCount }}</p>
          <p>车辆: {{ vehicleCount }}</p>
        </div>
      </div>
    </div>
    <div class="loading" v-if="loading">
      <div class="loading-spinner"></div>
      <p>正在加载3D地图...</p>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default {
  name: 'Street3D',
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      controls: null,
      buildings: [],
      roads: [],
      vehicles: [],
      particles: [],
      wireframe: false,
      animation: true,
      weather: false,
      traffic: true,
      loading: true,
      animationId: null,
      fps: 0,
      frameCount: 0,
      lastTime: 0,
      buildingCount: 0,
      vehicleCount: 0,
      currentTime: '12:00',
      timeOfDay: 'day', // day, evening, night
      // 长沙大道坐标 (雨花区)
      centerLat: 28.1855,
      centerLng: 112.9855,
      // 500米范围对应的经纬度偏移
      latOffset: 0.0045, // 约500米
      lngOffset: 0.0045, // 约500米
    };
  },
  mounted() {
    this.initThree();
    this.createStreetScene();
    this.createVehicles();
    this.createWeatherSystem();
    this.animate();
    this.loading = false;
    window.addEventListener('resize', this.onWindowResize);
    this.updateTime();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onWindowResize);
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  },
  methods: {
    initThree() {
      const container = this.$refs.threeContainer;
      
      // 创建场景
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x87CEEB); // 天空蓝
      this.scene.fog = new THREE.Fog(0x87CEEB, 100, 1000);

      // 创建相机
      this.camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        2000
      );
      this.camera.position.set(0, 100, 200);

      // 创建渲染器
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.2;
      container.appendChild(this.renderer.domElement);

      // 创建控制器
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxPolarAngle = Math.PI / 2;
      this.controls.minDistance = 50;
      this.controls.maxDistance = 500;

      // 添加光源
      this.addLights();
    },

    addLights() {
      // 环境光
      this.ambientLight = new THREE.AmbientLight(0x404040, 0.6);
      this.scene.add(this.ambientLight);

      // 方向光 (太阳光)
      this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      this.directionalLight.position.set(100, 200, 100);
      this.directionalLight.castShadow = true;
      this.directionalLight.shadow.mapSize.width = 2048;
      this.directionalLight.shadow.mapSize.height = 2048;
      this.directionalLight.shadow.camera.near = 0.5;
      this.directionalLight.shadow.camera.far = 500;
      this.directionalLight.shadow.camera.left = -200;
      this.directionalLight.shadow.camera.right = 200;
      this.directionalLight.shadow.camera.top = 200;
      this.directionalLight.shadow.camera.bottom = -200;
      this.scene.add(this.directionalLight);

      // 点光源 (路灯效果)
      this.pointLight1 = new THREE.PointLight(0xffaa00, 0.5, 100);
      this.pointLight1.position.set(-50, 20, -50);
      this.scene.add(this.pointLight1);

      this.pointLight2 = new THREE.PointLight(0xffaa00, 0.5, 100);
      this.pointLight2.position.set(50, 20, 50);
      this.scene.add(this.pointLight2);
    },

    createStreetScene() {
      // 创建地面
      this.createGround();
      
      // 创建长沙大道 (主要道路)
      this.createMainRoad();
      
      // 创建次要道路
      this.createSecondaryRoads();
      
      // 创建建筑物
      this.createBuildings();
      
      // 创建绿化带
      this.createGreenery();
      
      // 创建交通设施
      this.createTrafficFacilities();
      
      // 创建人行道
      this.createSidewalks();
      
      // 创建地下通道
      this.createUndergroundPassages();
    },

    createGround() {
      const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
      const groundMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x3a5f3a,
        transparent: true,
        opacity: 0.8
      });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      this.scene.add(ground);
    },

    createMainRoad() {
      // 长沙大道 - 东西向主干道
      const roadGeometry = new THREE.PlaneGeometry(800, 20);
      const roadMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
      const mainRoad = new THREE.Mesh(roadGeometry, roadMaterial);
      mainRoad.rotation.x = -Math.PI / 2;
      mainRoad.position.y = 0.1;
      mainRoad.receiveShadow = true;
      this.scene.add(mainRoad);

      // 道路标线
      this.createRoadMarkings(mainRoad);
      
      // 添加道路纹理
      this.addRoadTexture(mainRoad);
    },

    addRoadTexture(road) {
      // 创建道路纹理
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      
      // 绘制道路纹理
      ctx.fillStyle = '#333333';
      ctx.fillRect(0, 0, 512, 512);
      
      // 添加一些随机的道路磨损效果
      for (let i = 0; i < 50; i++) {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`;
        ctx.fillRect(
          Math.random() * 512,
          Math.random() * 512,
          Math.random() * 20 + 5,
          Math.random() * 20 + 5
        );
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(4, 1);
      
      road.material.map = texture;
      road.material.needsUpdate = true;
    },

    createRoadMarkings(road) {
      // 中心线
      const centerLineGeometry = new THREE.PlaneGeometry(800, 0.5);
      const centerLineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const centerLine = new THREE.Mesh(centerLineGeometry, centerLineMaterial);
      centerLine.rotation.x = -Math.PI / 2;
      centerLine.position.y = 0.2;
      this.scene.add(centerLine);

      // 车道线
      for (let i = 0; i < 8; i++) {
        const laneLineGeometry = new THREE.PlaneGeometry(800, 0.3);
        const laneLineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const laneLine = new THREE.Mesh(laneLineGeometry, laneLineMaterial);
        laneLine.rotation.x = -Math.PI / 2;
        laneLine.position.y = 0.2;
        laneLine.position.z = -8 + i * 2.5;
        this.scene.add(laneLine);
      }
      
      // 人行横道
      this.createCrosswalks();
    },

    createCrosswalks() {
      const crosswalkPositions = [
        { x: -150, z: 0 }, { x: 150, z: 0 },
        { x: -300, z: 0 }, { x: 300, z: 0 },
      ];
      
      crosswalkPositions.forEach(pos => {
        for (let i = 0; i < 8; i++) {
          const stripeGeometry = new THREE.PlaneGeometry(0.8, 3);
          const stripeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
          const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
          stripe.rotation.x = -Math.PI / 2;
          stripe.position.set(pos.x + (i - 4) * 2, 0.3, pos.z);
          this.scene.add(stripe);
        }
      });
    },

    createSecondaryRoads() {
      // 南北向次要道路
      const secondaryRoads = [
        { x: -150, z: 0, width: 15, length: 400 },
        { x: 150, z: 0, width: 15, length: 400 },
        { x: -300, z: 0, width: 12, length: 300 },
        { x: 300, z: 0, width: 12, length: 300 },
      ];

      secondaryRoads.forEach(road => {
        const roadGeometry = new THREE.PlaneGeometry(road.length, road.width);
        const roadMaterial = new THREE.MeshLambertMaterial({ color: 0x555555 });
        const roadMesh = new THREE.Mesh(roadGeometry, roadMaterial);
        roadMesh.rotation.x = -Math.PI / 2;
        roadMesh.position.set(road.x, 0.1, road.z);
        roadMesh.receiveShadow = true;
        this.scene.add(roadMesh);
      });
    },

    createBuildings() {
      // 创建各种建筑物
      const buildingConfigs = [
        // 商业建筑
        { x: -200, z: -100, width: 40, height: 60, depth: 30, color: 0x8B4513, type: 'commercial', name: '商业大厦A' },
        { x: 200, z: -100, width: 35, height: 80, depth: 25, color: 0x4682B4, type: 'commercial', name: '商业大厦B' },
        { x: -100, z: 150, width: 30, height: 50, depth: 20, color: 0x708090, type: 'commercial', name: '购物中心' },
        { x: 100, z: 150, width: 45, height: 70, depth: 35, color: 0x556B2F, type: 'commercial', name: '写字楼' },
        
        // 住宅建筑
        { x: -350, z: -80, width: 25, height: 40, depth: 15, color: 0xCD853F, type: 'residential', name: '住宅楼A' },
        { x: 350, z: -80, width: 25, height: 40, depth: 15, color: 0xCD853F, type: 'residential', name: '住宅楼B' },
        { x: -350, z: 80, width: 25, height: 40, depth: 15, color: 0xCD853F, type: 'residential', name: '住宅楼C' },
        { x: 350, z: 80, width: 25, height: 40, depth: 15, color: 0xCD853F, type: 'residential', name: '住宅楼D' },
        
        // 公共设施
        { x: 0, z: -200, width: 50, height: 30, depth: 40, color: 0xDC143C, type: 'public', name: '医院' },
        { x: -250, z: 200, width: 40, height: 25, depth: 30, color: 0x32CD32, type: 'public', name: '学校A' },
        { x: 250, z: 200, width: 40, height: 25, depth: 30, color: 0x32CD32, type: 'public', name: '学校B' },
        
        // 新增建筑
        { x: -180, z: 80, width: 20, height: 35, depth: 18, color: 0x9370DB, type: 'residential', name: '公寓楼' },
        { x: 180, z: 80, width: 20, height: 35, depth: 18, color: 0x9370DB, type: 'residential', name: '公寓楼' },
        { x: 0, z: 100, width: 60, height: 20, depth: 50, color: 0xFF6347, type: 'commercial', name: '商场' },
      ];

      buildingConfigs.forEach(config => {
        const building = this.createBuilding(config);
        this.buildings.push(building);
        this.scene.add(building);
      });
      
      this.buildingCount = this.buildings.length;
    },

    createBuilding(config) {
      const geometry = new THREE.BoxGeometry(config.width, config.height, config.depth);
      const material = new THREE.MeshLambertMaterial({ color: config.color });
      const building = new THREE.Mesh(geometry, material);
      
      building.position.set(config.x, config.height / 2, config.z);
      building.castShadow = true;
      building.receiveShadow = true;
      building.userData = { name: config.name, type: config.type };
      
      // 添加窗户效果
      this.addWindows(building, config);
      
      // 添加建筑标识
      this.addBuildingSign(building, config);
      
      return building;
    },

    addWindows(building, config) {
      const windowRows = Math.floor(config.height / 10);
      const windowCols = Math.floor(config.width / 8);
      
      for (let row = 0; row < windowRows; row++) {
        for (let col = 0; col < windowCols; col++) {
          const windowGeometry = new THREE.PlaneGeometry(2, 3);
          const windowMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x87CEEB,
            transparent: true,
            opacity: 0.8
          });
          const window = new THREE.Mesh(windowGeometry, windowMaterial);
          
          window.position.set(
            (col - windowCols / 2) * 8 + 4,
            row * 10 + 5,
            config.depth / 2 + 0.1
          );
          
          building.add(window);
        }
      }
    },

    addBuildingSign(building, config) {
      const signGeometry = new THREE.PlaneGeometry(15, 3);
      const signMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const sign = new THREE.Mesh(signGeometry, signMaterial);
      
      sign.position.set(0, config.height + 2, 0);
      building.add(sign);
    },

    createGreenery() {
      // 创建绿化带
      const greeneryAreas = [
        { x: -400, z: 0, width: 50, length: 800 },
        { x: 400, z: 0, width: 50, length: 800 },
        { x: 0, z: -400, width: 800, length: 50 },
        { x: 0, z: 400, width: 800, length: 50 },
      ];

      greeneryAreas.forEach(area => {
        const greeneryGeometry = new THREE.PlaneGeometry(area.length, area.width);
        const greeneryMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
        const greenery = new THREE.Mesh(greeneryGeometry, greeneryMaterial);
        greenery.rotation.x = -Math.PI / 2;
        greenery.position.set(area.x, 0.05, area.z);
        this.scene.add(greenery);
      });

      // 添加树木
      this.addTrees();
      
      // 添加花坛
      this.addFlowerBeds();
    },

    addTrees() {
      const treePositions = [
        { x: -380, z: -50 }, { x: -380, z: 50 }, { x: -380, z: 150 },
        { x: 380, z: -50 }, { x: 380, z: 50 }, { x: 380, z: 150 },
        { x: -50, z: -380 }, { x: 50, z: -380 }, { x: 150, z: -380 },
        { x: -50, z: 380 }, { x: 50, z: 380 }, { x: 150, z: 380 },
      ];

      treePositions.forEach(pos => {
        const tree = this.createTree();
        tree.position.set(pos.x, 0, pos.z);
        this.scene.add(tree);
      });
    },

    createTree() {
      const treeGroup = new THREE.Group();
      
      // 树干
      const trunkGeometry = new THREE.CylinderGeometry(1, 1.5, 8);
      const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.y = 4;
      trunk.castShadow = true;
      treeGroup.add(trunk);
      
      // 树冠
      const leavesGeometry = new THREE.SphereGeometry(6, 8, 8);
      const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
      const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
      leaves.position.y = 12;
      leaves.castShadow = true;
      treeGroup.add(leaves);
      
      return treeGroup;
    },

    addFlowerBeds() {
      const flowerBedPositions = [
        { x: -200, z: 120 }, { x: 200, z: 120 },
        { x: -200, z: -120 }, { x: 200, z: -120 },
      ];
      
      flowerBedPositions.forEach(pos => {
        const flowerBed = this.createFlowerBed();
        flowerBed.position.set(pos.x, 0, pos.z);
        this.scene.add(flowerBed);
      });
    },

    createFlowerBed() {
      const flowerBedGroup = new THREE.Group();
      
      // 花坛底座
      const baseGeometry = new THREE.CylinderGeometry(8, 8, 1);
      const baseMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      base.position.y = 0.5;
      flowerBedGroup.add(base);
      
      // 花朵
      for (let i = 0; i < 20; i++) {
        const flower = this.createFlower();
        const angle = (i / 20) * Math.PI * 2;
        const radius = Math.random() * 6 + 2;
        flower.position.set(
          Math.cos(angle) * radius,
          1,
          Math.sin(angle) * radius
        );
        flowerBedGroup.add(flower);
      }
      
      return flowerBedGroup;
    },

    createFlower() {
      const flowerGroup = new THREE.Group();
      
      // 花茎
      const stemGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2);
      const stemMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
      const stem = new THREE.Mesh(stemGeometry, stemMaterial);
      stem.position.y = 1;
      flowerGroup.add(stem);
      
      // 花朵
      const flowerGeometry = new THREE.SphereGeometry(0.5, 6, 6);
      const flowerMaterial = new THREE.MeshLambertMaterial({ 
        color: new THREE.Color().setHSL(Math.random(), 0.8, 0.6) 
      });
      const flower = new THREE.Mesh(flowerGeometry, flowerMaterial);
      flower.position.y = 2;
      flowerGroup.add(flower);
      
      return flowerGroup;
    },

    createTrafficFacilities() {
      // 交通信号灯
      const trafficLightPositions = [
        { x: -150, z: 10 }, { x: 150, z: -10 },
        { x: -10, z: -150 }, { x: 10, z: 150 },
      ];

      trafficLightPositions.forEach(pos => {
        const trafficLight = this.createTrafficLight();
        trafficLight.position.set(pos.x, 0, pos.z);
        this.scene.add(trafficLight);
      });

      // 公交站台
      const busStopPositions = [
        { x: -200, z: 15 }, { x: 200, z: -15 },
        { x: -15, z: -200 }, { x: 15, z: 200 },
      ];

      busStopPositions.forEach(pos => {
        const busStop = this.createBusStop();
        busStop.position.set(pos.x, 0, pos.z);
        this.scene.add(busStop);
      });
      
      // 停车场
      this.createParkingLots();
    },

    createTrafficLight() {
      const lightGroup = new THREE.Group();
      
      // 灯柱
      const poleGeometry = new THREE.CylinderGeometry(0.5, 0.5, 8);
      const poleMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
      const pole = new THREE.Mesh(poleGeometry, poleMaterial);
      pole.position.y = 4;
      lightGroup.add(pole);
      
      // 信号灯
      const lightGeometry = new THREE.SphereGeometry(1, 8, 8);
      const redLight = new THREE.Mesh(lightGeometry, new THREE.MeshBasicMaterial({ color: 0xff0000 }));
      redLight.position.set(0, 6, 0);
      lightGroup.add(redLight);
      
      const yellowLight = new THREE.Mesh(lightGeometry, new THREE.MeshBasicMaterial({ color: 0xffff00 }));
      yellowLight.position.set(0, 4, 0);
      lightGroup.add(yellowLight);
      
      const greenLight = new THREE.Mesh(lightGeometry, new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
      greenLight.position.set(0, 2, 0);
      lightGroup.add(greenLight);
      
      return lightGroup;
    },

    createBusStop() {
      const stopGroup = new THREE.Group();
      
      // 站台
      const platformGeometry = new THREE.BoxGeometry(8, 1, 3);
      const platformMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
      const platform = new THREE.Mesh(platformGeometry, platformMaterial);
      platform.position.y = 0.5;
      stopGroup.add(platform);
      
      // 候车亭
      const shelterGeometry = new THREE.BoxGeometry(6, 3, 2);
      const shelterMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x4682B4,
        transparent: true,
        opacity: 0.7
      });
      const shelter = new THREE.Mesh(shelterGeometry, shelterMaterial);
      shelter.position.y = 2.5;
      stopGroup.add(shelter);
      
      return stopGroup;
    },

    createParkingLots() {
      const parkingPositions = [
        { x: -300, z: -150 }, { x: 300, z: -150 },
        { x: -300, z: 150 }, { x: 300, z: 150 },
      ];
      
      parkingPositions.forEach(pos => {
        const parkingLot = this.createParkingLot();
        parkingLot.position.set(pos.x, 0, pos.z);
        this.scene.add(parkingLot);
      });
    },

    createParkingLot() {
      const parkingGroup = new THREE.Group();
      
      // 停车场地面
      const groundGeometry = new THREE.PlaneGeometry(40, 30);
      const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x444444 });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = 0.1;
      parkingGroup.add(ground);
      
      // 停车位标线
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 4; j++) {
          const lineGeometry = new THREE.PlaneGeometry(8, 0.2);
          const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
          const line = new THREE.Mesh(lineGeometry, lineMaterial);
          line.rotation.x = -Math.PI / 2;
          line.position.set(-15 + i * 6, 0.2, -10 + j * 6);
          parkingGroup.add(line);
        }
      }
      
      return parkingGroup;
    },

    createSidewalks() {
      const sidewalkPositions = [
        { x: -400, z: 0, width: 10, length: 800 },
        { x: 400, z: 0, width: 10, length: 800 },
        { x: 0, z: -400, width: 800, length: 10 },
        { x: 0, z: 400, width: 800, length: 10 },
      ];
      
      sidewalkPositions.forEach(pos => {
        const sidewalkGeometry = new THREE.PlaneGeometry(pos.length, pos.width);
        const sidewalkMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
        const sidewalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
        sidewalk.rotation.x = -Math.PI / 2;
        sidewalk.position.set(pos.x, 0.15, pos.z);
        this.scene.add(sidewalk);
      });
    },

    createUndergroundPassages() {
      const passagePositions = [
        { x: -150, z: 0 }, { x: 150, z: 0 },
      ];
      
      passagePositions.forEach(pos => {
        const passage = this.createUndergroundPassage();
        passage.position.set(pos.x, 0, pos.z);
        this.scene.add(passage);
      });
    },

    createUndergroundPassage() {
      const passageGroup = new THREE.Group();
      
      // 入口
      const entranceGeometry = new THREE.BoxGeometry(6, 3, 4);
      const entranceMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
      const entrance = new THREE.Mesh(entranceGeometry, entranceMaterial);
      entrance.position.y = 1.5;
      passageGroup.add(entrance);
      
      // 楼梯
      for (let i = 0; i < 5; i++) {
        const stepGeometry = new THREE.BoxGeometry(6, 0.3, 0.8);
        const stepMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 });
        const step = new THREE.Mesh(stepGeometry, stepMaterial);
        step.position.set(0, i * 0.3, i * 0.8);
        passageGroup.add(step);
      }
      
      return passageGroup;
    },

    createVehicles() {
      const vehicleCount = 20;
      
      for (let i = 0; i < vehicleCount; i++) {
        const vehicle = this.createVehicle();
        vehicle.position.set(
          (Math.random() - 0.5) * 600,
          1,
          (Math.random() - 0.5) * 600
        );
        vehicle.userData.speed = Math.random() * 2 + 1;
        vehicle.userData.direction = Math.random() * Math.PI * 2;
        this.vehicles.push(vehicle);
        this.scene.add(vehicle);
      }
      
      this.vehicleCount = this.vehicles.length;
    },

    createVehicle() {
      const vehicleGroup = new THREE.Group();
      
      // 车身
      const bodyGeometry = new THREE.BoxGeometry(4, 2, 8);
      const bodyMaterial = new THREE.MeshLambertMaterial({ 
        color: new THREE.Color().setHSL(Math.random(), 0.8, 0.6) 
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 1;
      body.castShadow = true;
      vehicleGroup.add(body);
      
      // 车轮
      const wheelGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.5);
      const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
      
      const wheelPositions = [
        { x: -1.5, y: 0.8, z: -2.5 },
        { x: 1.5, y: 0.8, z: -2.5 },
        { x: -1.5, y: 0.8, z: 2.5 },
        { x: 1.5, y: 0.8, z: 2.5 },
      ];
      
      wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(pos.x, pos.y, pos.z);
        vehicleGroup.add(wheel);
      });
      
      return vehicleGroup;
    },

    createWeatherSystem() {
      // 创建雨滴粒子系统
      const particleCount = 1000;
      const particleGeometry = new THREE.BufferGeometry();
      const particlePositions = new Float32Array(particleCount * 3);
      
      for (let i = 0; i < particleCount * 3; i += 3) {
        particlePositions[i] = (Math.random() - 0.5) * 1000;
        particlePositions[i + 1] = Math.random() * 200;
        particlePositions[i + 2] = (Math.random() - 0.5) * 1000;
      }
      
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      
      const particleMaterial = new THREE.PointsMaterial({
        color: 0x87CEEB,
        size: 2,
        transparent: true,
        opacity: 0.6
      });
      
      this.rainParticles = new THREE.Points(particleGeometry, particleMaterial);
      this.rainParticles.visible = false;
      this.scene.add(this.rainParticles);
    },

    animate() {
      if (!this.animation) return;
      
      this.animationId = requestAnimationFrame(this.animate);
      
      const currentTime = performance.now();
      this.frameCount++;
      
      if (currentTime - this.lastTime >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
        this.frameCount = 0;
        this.lastTime = currentTime;
      }
      
      // 更新控制器
      this.controls.update();
      
      // 更新车辆动画
      if (this.traffic) {
        this.updateVehicles();
      }
      
      // 更新天气效果
      if (this.weather) {
        this.updateWeather();
      }
      
      // 更新建筑物动画效果
      if (this.animation) {
        this.buildings.forEach((building, index) => {
          building.rotation.y += 0.0005 * (index + 1);
        });
      }
      
      this.renderer.render(this.scene, this.camera);
    },

    updateVehicles() {
      this.vehicles.forEach(vehicle => {
        // 更新车辆位置
        vehicle.position.x += Math.cos(vehicle.userData.direction) * vehicle.userData.speed;
        vehicle.position.z += Math.sin(vehicle.userData.direction) * vehicle.userData.speed;
        
        // 边界检测
        if (Math.abs(vehicle.position.x) > 400) {
          vehicle.userData.direction = Math.PI - vehicle.userData.direction;
        }
        if (Math.abs(vehicle.position.z) > 400) {
          vehicle.userData.direction = -vehicle.userData.direction;
        }
        
        // 更新车辆朝向
        vehicle.rotation.y = vehicle.userData.direction;
      });
    },

    updateWeather() {
      if (this.rainParticles) {
        const positions = this.rainParticles.geometry.attributes.position.array;
        
        for (let i = 1; i < positions.length; i += 3) {
          positions[i] -= 2; // 雨滴下落速度
          
          if (positions[i] < -50) {
            positions[i] = 200; // 重置到顶部
          }
        }
        
        this.rainParticles.geometry.attributes.position.needsUpdate = true;
      }
    },

    resetCamera() {
      this.camera.position.set(0, 100, 200);
      this.controls.reset();
    },

    toggleWireframe() {
      this.wireframe = !this.wireframe;
      this.scene.traverse((child) => {
        if (child.isMesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => mat.wireframe = this.wireframe);
          } else {
            child.material.wireframe = this.wireframe;
          }
        }
      });
    },

    toggleAnimation() {
      this.animation = !this.animation;
      if (this.animation) {
        this.animate();
      } else if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
    },

    toggleWeather() {
      this.weather = !this.weather;
      if (this.rainParticles) {
        this.rainParticles.visible = this.weather;
      }
      
      // 调整光照
      if (this.weather) {
        this.ambientLight.intensity = 0.3;
        this.directionalLight.intensity = 0.4;
        this.scene.background = new THREE.Color(0x666666);
      } else {
        this.ambientLight.intensity = 0.6;
        this.directionalLight.intensity = 0.8;
        this.scene.background = new THREE.Color(0x87CEEB);
      }
    },

    toggleTraffic() {
      this.traffic = !this.traffic;
      this.vehicles.forEach(vehicle => {
        vehicle.visible = this.traffic;
      });
    },

    changeTimeOfDay() {
      const times = ['day', 'evening', 'night'];
      const currentIndex = times.indexOf(this.timeOfDay);
      const nextIndex = (currentIndex + 1) % times.length;
      this.timeOfDay = times[nextIndex];
      
      this.updateTimeOfDay();
    },

    updateTimeOfDay() {
      switch (this.timeOfDay) {
        case 'day':
          this.scene.background = new THREE.Color(0x87CEEB);
          this.ambientLight.intensity = 0.6;
          this.directionalLight.intensity = 0.8;
          this.pointLight1.intensity = 0;
          this.pointLight2.intensity = 0;
          this.currentTime = '12:00';
          break;
        case 'evening':
          this.scene.background = new THREE.Color(0xFF7F50);
          this.ambientLight.intensity = 0.4;
          this.directionalLight.intensity = 0.5;
          this.pointLight1.intensity = 0.3;
          this.pointLight2.intensity = 0.3;
          this.currentTime = '18:00';
          break;
        case 'night':
          this.scene.background = new THREE.Color(0x191970);
          this.ambientLight.intensity = 0.2;
          this.directionalLight.intensity = 0.1;
          this.pointLight1.intensity = 0.8;
          this.pointLight2.intensity = 0.8;
          this.currentTime = '22:00';
          break;
      }
    },

    updateTime() {
      setInterval(() => {
        if (this.timeOfDay === 'day') {
          const hours = Math.floor((Date.now() / 1000 / 60 / 60) % 24);
          const minutes = Math.floor((Date.now() / 1000 / 60) % 60);
          this.currentTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        }
      }, 1000);
    },

    onWindowResize() {
      const container = this.$refs.threeContainer;
      this.camera.aspect = container.clientWidth / container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(container.clientWidth, container.clientHeight);
    },
  },
};
</script>

<style scoped>
.street-3d-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

#three-container {
  width: 100%;
  height: 100%;
}

.controls {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 100;
}

.info-panel {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 20px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  min-width: 280px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.info-panel h3 {
  margin: 0 0 15px 0;
  color: #4CAF50;
  font-size: 18px;
  text-align: center;
}

.info-panel p {
  margin: 5px 0;
  font-size: 14px;
}

.control-buttons {
  margin-top: 15px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.control-buttons button {
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.control-buttons button:hover {
  background: linear-gradient(135deg, #45a049, #4CAF50);
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.control-buttons button:active {
  transform: translateY(0);
}

.stats {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.stats p {
  margin: 3px 0;
  font-size: 12px;
  color: #ccc;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  z-index: 200;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
