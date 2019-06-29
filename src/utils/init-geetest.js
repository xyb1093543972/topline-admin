import '@/vendor/gt'
export default function(options) {
  return new Promise((resolve, reject) => {
    window.initGeeTest(options, captchaObj => {
      resolve(captchaObj)
    })
  })
}
