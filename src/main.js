import "bootstrap/dist/css/bootstrap.css"
import { createApp } from 'vue'
import App from './App.vue'
import { createDynamicForms } from '@asigloo/vue-dynamic-forms'

const VueDynamicForms = createDynamicForms()

export const app = createApp(App)

app.use(VueDynamicForms)
app.mount("#app")