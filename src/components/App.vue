<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import * as monaco from 'monaco-editor'
import marked from 'marked'
import Prism from 'prismjs'
import domToImage from 'dom-to-image'
import { createSnackbar } from '@snackbar/core'
import 'prismjs/themes/prism-tomorrow.css'
import '@snackbar/core/dist/snackbar.css'

const editorRef = ref<HTMLDivElement>()
let editor: monaco.editor.IStandaloneCodeEditor | undefined

const previewRef = ref<HTMLDivElement>()

const inputText = ref('Type text here, with **markdown** support..')

onMounted(() => {
  editor = monaco.editor.create(editorRef.value, {
    value: inputText.value,
    language: 'markdown',
    wordWrap: 'on',
  })

  editor.onDidChangeModelContent((e) => {
    inputText.value = editor.getModel().getValue()
  })
})

onBeforeUnmount(() => {
  editor?.dispose()
})

const save = () => {
  domToImage.toJpeg(previewRef.value, {}).then((dataUrl) => {
    const link = document.createElement('a')
    link.download = 'image.jpg'
    link.href = dataUrl
    link.click()
  })
}

const copy = async () => {
  try {
    const blob = await domToImage.toBlob(previewRef.value, {})
    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ])
    createSnackbar('Image copied.', {
      theme: {
        actionColor: 'green',
      },
      timeout: 5000,
    })
  } catch (error) {
    createSnackbar(error.message, {
      theme: {
        actionColor: 'red',
      },
      timeout: 5000,
    })
  }
}

const html = computed(() =>
  marked(inputText.value, {
    highlight(code, lang) {
      const language = Prism.languages[lang] || Prism.languages.markup
      return Prism.highlight(code, language, lang)
    },
  }),
)
</script>

<template>
  <div class="h-screen">
    <header class="border-b flex items-center justify-between px-5 header">
      <div class="flex items-center space-x-6">
        <h1 class="font-bold text-lg">Text2Image</h1>
        <a
          class="underline"
          href="http://github.com/egoist/text2image"
          target="_blank"
          rel="nofollow noopener"
          >GitHub</a
        >
      </div>
      <div class="space-x-3 flex items-center">
        <button
          @click="copy"
          class="inline-flex items-center space-x-2 border rounded-md px-4 h-10 text-white bg-gray-400"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            ></path></svg
          ><span>Copy Image</span>
        </button>
        <button
          @click="save"
          class="flex items-center space-x-2 border rounded-md px-4 h-10 text-white bg-blue-400"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            ></path>
          </svg>
          <span>Save Image</span>
        </button>
      </div>
    </header>
    <div class="flex main">
      <div class="w-6/12 h-full">
        <div ref="editorRef" class="h-full"></div>
      </div>
      <div class="w-6/12 p-5 h-full overflow-auto">
        <div class="page-wrap" ref="previewRef">
          <div class="page-border">
            <span class="wrap-top"></span>
            <span class="wrap-bottom"></span>
            <span class="wrap-left"></span>
            <span class="wrap-right"></span>
            <div class="page-content prose" v-html="html"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header {
  height: 60px;
}

.main {
  height: calc(100% - 60px);
}

.page-wrap {
  max-width: 660px;
  position: relative;
  font-size: 23px;
  color: #645647;
  background: #fffcf6;
  border-top: 1px solid #fffcf6;
  font-family: 'PingFang SC', Helvetica, ST-Heiti, 'Microsoft Yahei';
  padding: 33px 19px 33px 19px;
}

.page-border {
  border: 2px solid #e9e5d9;
  padding: 2px;
  position: relative;
}

.page-wrap .wrap-bottom,
.page-wrap .wrap-left,
.page-wrap .wrap-right,
.page-wrap .wrap-top {
  width: 6px;
  height: 6px;
  border: 2px solid #e9e5d9;
  position: absolute;
  display: inline-block;
}

.page-wrap .wrap-top {
  top: -6px;
  left: -6px;
}

.page-wrap .wrap-right {
  top: -6px;
  right: -6px;
}

.page-wrap .wrap-bottom {
  bottom: -6px;
  right: -6px;
}

.page-wrap .wrap-left {
  bottom: -6px;
  left: -6px;
}

.page-content {
  border: 2px solid #e9e5d9;
  position: relative;
  padding: 38px 39px 50px 40px;
}
</style>
