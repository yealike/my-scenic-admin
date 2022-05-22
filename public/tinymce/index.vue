<template>
  <div>
    <!--    <textarea id="my-textarea"></textarea>-->
    <textarea :id="name"></textarea>
  </div>
</template>

<script>
import scenicApi from '@/api/scenic/scenic'

export default {
  name: 'index',
  data() {
    return {
      img_upload_url: process.env.VUE_APP_BASE_API + '/scenic/scenic/oss'
    }
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: 'hello'
    },
    height: {
      type: String,
      default: '500px'
    }
  },
  mounted() {
    tinymce.init({
      // selector: '#my-textarea',
      selector: '#' + this.name,
      language: 'zh-Hans',
      branding: false,
      height: this.height,
      plugins: 'image preview',
      toolbar: 'undo redo formatselect fontsizeselect removeformat  image preview bold italic underline strikethrough alignleft aligncenter alignright ' +
        'alignnone paste outdent indent blockquote',
      images_upload_url: this.img_upload_url,
      images_upload_handler: (blobInfo, success, failure) => {

        let formData = new FormData()
        formData.append('file', blobInfo.blob())
        formData.append('filename', blobInfo.filename)
        scenicApi.addImage(formData)
          .then(resp => {
            success(resp.data.url)
          })
      },
      // 监视tinymce初始化完成事件
      setup: (editor) => {
        editor.on('init', (e) => {
          editor.setContent(this.value)
        })
      },
      // 监听input 和 change事件，实时更新value
      init_instance_callback: (editor) => {
        editor.on('input', e => {
          this.$emit('input', e.target.innerHTML)
        })
        editor.on('change', e => {
          this.$emit('input', e.level.content)
        })
      }
    })

  }
}
</script>

<style scoped>

</style>
