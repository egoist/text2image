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
      <div>
        <button
          @click="save"
          class="border rounded-md px-4 h-10 text-white bg-blue-400"
        >
          Save Image
        </button>
      </div>
    </header>
    <div class="flex main">
      <div class="w-6/12 h-full">
        <div ref="editorRef" class="h-full"></div>
      </div>
      <div class="w-6/12 p-5">
        <div ref="previewWrapperRef">
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
  </div>
</template>

<script lang="ts">
import { ref, onMounted, onBeforeUnmount, defineComponent, computed } from 'vue'
import * as monaco from 'monaco-editor'
import marked from 'marked'
import Prism from 'prismjs'
import domToImage from 'dom-to-image'
import 'prismjs/themes/prism-tomorrow.css'

export default defineComponent({
  setup() {
    const editorRef = ref<HTMLDivElement>()
    let editor: monaco.editor.IStandaloneCodeEditor | undefined

    const previewRef = ref<HTMLDivElement>()

    const inputText = ref('Type text here, with **markdown** support..')

    onMounted(() => {
      editor = monaco.editor.create(editorRef.value, {
        value: inputText.value,
        language: 'markdown',
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

    return {
      editorRef,
      previewRef,
      save,
      html: computed(() =>
        marked(inputText.value, {
          highlight(code, lang) {
            const language = Prism.languages[lang] || Prism.languages.markup
            return Prism.highlight(code, language, lang)
          },
        }),
      ),
    }
  },
})
</script>

<style scoped>
.header {
  height: 60px;
}

.main {
  height: calc(100% - 60px);
}

.page-wrap {
  width: 660px;
  position: relative;
  font-size: 23px;
  color: #645647;
  background: #fffcf6;
  border-top: 1px solid #fffcf6;
  font-family: 'PingFang SC', Helvetica, ST-Heiti, 'Microsoft Yahei';
  border-radius: 4px;
  box-shadow: 0 3px 8px rgb(69 18 10 / 40%);
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
