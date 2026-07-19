<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Component } from 'vue'
import {
  Bell,
  CheckCircle2,
  Clipboard,
  ClipboardCheck,
  Cpu,
  FileText,
  FolderOpen,
  Gauge,
  HardDrive,
  Home,
  Laptop,
  MonitorCog,
  Plus,
  RefreshCw,
  Save,
  Wrench
} from 'lucide-vue-next'

type ViewName = 'overview' | 'files' | 'tools'
type SystemInfo = Awaited<ReturnType<typeof window.desktop.getSystemInfo>>

const activeView = ref<ViewName>('overview')
const systemInfo = ref<SystemInfo | null>(null)
const systemLoading = ref(false)
const documentPath = ref<string | null>(null)
const documentName = ref('untitled.md')
const documentContent = ref('# Untitled\n\nStart writing here.')
const savedContent = ref(documentContent.value)
const clipboardText = ref('Desktop Workbench')
const operationMessage = ref('Desktop runtime connected')

const navigation: Array<{ id: ViewName; label: string; icon: Component }> = [
  { id: 'overview', label: '概览', icon: Home },
  { id: 'files', label: '文本文件', icon: FileText },
  { id: 'tools', label: '原生工具', icon: Wrench }
]

const runtimeCards = computed(() => [
  { label: 'Electron', value: systemInfo.value?.electronVersion ?? '--', icon: MonitorCog },
  { label: 'Chromium', value: systemInfo.value?.chromiumVersion ?? '--', icon: Gauge },
  { label: 'Node.js', value: systemInfo.value?.nodeVersion ?? '--', icon: Cpu },
  { label: 'System', value: systemInfo.value?.platform ?? '--', icon: Laptop }
])

const systemRows = computed(() => [
  ['主机名称', systemInfo.value?.hostname ?? '--'],
  ['系统版本', systemInfo.value?.release ?? '--'],
  ['处理器架构', systemInfo.value?.arch ?? '--'],
  ['区域设置', systemInfo.value?.locale ?? '--'],
  ['系统主题', systemInfo.value?.theme ?? '--'],
  ['文档目录', systemInfo.value?.documentsPath ?? '--']
])

const isDocumentDirty = computed(() => documentContent.value !== savedContent.value)

async function loadSystemInfo(): Promise<void> {
  systemLoading.value = true
  try {
    systemInfo.value = await window.desktop.getSystemInfo()
    operationMessage.value = 'System information refreshed'
  } catch (error) {
    operationMessage.value =
      error instanceof Error ? error.message : 'Unable to read system information'
  } finally {
    systemLoading.value = false
  }
}

function newDocument(): void {
  if (isDocumentDirty.value && !window.confirm('Discard the unsaved changes?')) return
  documentPath.value = null
  documentName.value = 'untitled.md'
  documentContent.value = '# Untitled\n\nStart writing here.'
  savedContent.value = documentContent.value
  operationMessage.value = 'New document created'
}

async function openDocument(): Promise<void> {
  if (isDocumentDirty.value && !window.confirm('Discard the unsaved changes?')) return
  try {
    const result = await window.desktop.openTextFile()
    if (!result) return
    documentPath.value = result.path
    documentName.value = result.name
    documentContent.value = result.content
    savedContent.value = result.content
    operationMessage.value = `${result.name} opened`
  } catch (error) {
    operationMessage.value = error instanceof Error ? error.message : 'Unable to open the file'
  }
}

async function saveDocument(): Promise<void> {
  try {
    const result = await window.desktop.saveTextFile(documentPath.value, documentContent.value)
    if (!result) return
    documentPath.value = result.path
    documentName.value = result.name
    savedContent.value = documentContent.value
    operationMessage.value = `${result.name} saved`
  } catch (error) {
    operationMessage.value = error instanceof Error ? error.message : 'Unable to save the file'
  }
}

async function readClipboard(): Promise<void> {
  clipboardText.value = await window.desktop.readClipboard()
  operationMessage.value = 'Clipboard content loaded'
}

async function writeClipboard(): Promise<void> {
  await window.desktop.writeClipboard(clipboardText.value)
  operationMessage.value = 'Text copied to the system clipboard'
}

async function sendNotification(): Promise<void> {
  const supported = await window.desktop.notify(
    'Vue renderer and Electron main process are connected.'
  )
  operationMessage.value = supported ? 'System notification sent' : 'Notifications are unavailable'
}

onMounted(loadSystemInfo)
</script>

<template>
  <div class="app-frame">
    <header class="titlebar">
      <div class="titlebar-mark"><MonitorCog :size="17" /></div>
      <span>Desktop Workbench</span>
    </header>

    <div class="app-shell">
      <aside class="sidebar">
        <div class="sidebar-heading">
          <span class="eyebrow">ELECTRON LAB</span>
          <strong>Vue Desktop</strong>
        </div>

        <nav class="navigation" aria-label="Workspace navigation">
          <button
            v-for="item in navigation"
            :key="item.id"
            type="button"
            :class="['nav-button', { active: activeView === item.id }]"
            @click="activeView = item.id"
          >
            <component :is="item.icon" :size="18" />
            <span>{{ item.label }}</span>
          </button>
        </nav>

        <div class="sidebar-meta">
          <div><span>Framework</span><strong>Vue 3</strong></div>
          <div><span>Toolchain</span><strong>electron-vite</strong></div>
        </div>
      </aside>

      <main class="workspace">
        <section v-if="activeView === 'overview'" class="page">
          <div class="page-header">
            <div>
              <span class="eyebrow">RUNTIME OVERVIEW</span>
              <h1>桌面运行环境</h1>
            </div>
            <button
              class="button secondary"
              type="button"
              :disabled="systemLoading"
              @click="loadSystemInfo"
            >
              <RefreshCw :class="{ spinning: systemLoading }" :size="16" />
              刷新
            </button>
          </div>

          <div class="runtime-grid">
            <article v-for="item in runtimeCards" :key="item.label" class="metric-card">
              <div class="metric-icon"><component :is="item.icon" :size="19" /></div>
              <span>{{ item.label }}</span>
              <strong>{{ item.value }}</strong>
            </article>
          </div>

          <div class="overview-grid">
            <section class="panel system-panel">
              <div class="panel-heading">
                <div>
                  <span class="eyebrow">DEVICE</span>
                  <h2>系统信息</h2>
                </div>
                <HardDrive :size="20" />
              </div>
              <dl class="detail-list">
                <div v-for="row in systemRows" :key="row[0]">
                  <dt>{{ row[0] }}</dt>
                  <dd>{{ row[1] }}</dd>
                </div>
              </dl>
            </section>

            <section class="panel quick-panel">
              <div class="panel-heading">
                <div>
                  <span class="eyebrow">QUICK ACTION</span>
                  <h2>连接状态</h2>
                </div>
                <CheckCircle2 class="success-icon" :size="21" />
              </div>
              <div class="connection-state">
                <div class="pulse" />
                <div>
                  <strong>Main / Preload / Renderer</strong>
                  <span>Context isolation enabled</span>
                </div>
              </div>
              <button class="button primary wide" type="button" @click="sendNotification">
                <Bell :size="16" />
                发送系统通知
              </button>
            </section>
          </div>
        </section>

        <section v-else-if="activeView === 'files'" class="page file-page">
          <div class="page-header">
            <div>
              <span class="eyebrow">LOCAL FILE</span>
              <h1>文本工作区</h1>
            </div>
            <div class="toolbar">
              <button class="icon-button" type="button" title="New document" @click="newDocument">
                <Plus :size="18" />
              </button>
              <button class="button secondary" type="button" @click="openDocument">
                <FolderOpen :size="16" />
                打开
              </button>
              <button class="button primary" type="button" @click="saveDocument">
                <Save :size="16" />
                保存
              </button>
            </div>
          </div>

          <section class="editor-panel">
            <div class="editor-header">
              <div class="file-identity">
                <FileText :size="17" />
                <strong>{{ documentName }}</strong>
                <span v-if="isDocumentDirty" class="dirty-dot" title="Unsaved changes" />
              </div>
              <span class="file-path">{{ documentPath ?? 'Not saved yet' }}</span>
            </div>
            <textarea
              v-model="documentContent"
              spellcheck="false"
              aria-label="Text document content"
            />
          </section>
        </section>

        <section v-else class="page">
          <div class="page-header">
            <div>
              <span class="eyebrow">NATIVE TOOLKIT</span>
              <h1>系统能力</h1>
            </div>
          </div>

          <div class="tools-grid">
            <section class="panel clipboard-panel">
              <div class="panel-heading">
                <div>
                  <span class="eyebrow">CLIPBOARD</span>
                  <h2>系统剪贴板</h2>
                </div>
                <Clipboard :size="20" />
              </div>
              <textarea v-model="clipboardText" aria-label="Clipboard text" />
              <div class="panel-actions">
                <button class="button secondary" type="button" @click="readClipboard">
                  <Clipboard :size="16" />
                  读取
                </button>
                <button class="button primary" type="button" @click="writeClipboard">
                  <ClipboardCheck :size="16" />
                  写入
                </button>
              </div>
            </section>

            <section class="panel notification-panel">
              <div class="panel-heading">
                <div>
                  <span class="eyebrow">NOTIFICATION</span>
                  <h2>桌面通知</h2>
                </div>
                <Bell :size="20" />
              </div>
              <div class="notification-preview">
                <div class="notification-icon"><Bell :size="19" /></div>
                <div>
                  <strong>Desktop Workbench</strong>
                  <span>Vue renderer and Electron are connected.</span>
                </div>
              </div>
              <button class="button primary wide" type="button" @click="sendNotification">
                <Bell :size="16" />
                发送通知
              </button>
            </section>
          </div>
        </section>

        <footer class="statusbar">
          <span class="status-dot" />
          <span>{{ operationMessage }}</span>
          <span class="status-version">App {{ systemInfo?.appVersion ?? '--' }}</span>
        </footer>
      </main>
    </div>
  </div>
</template>
