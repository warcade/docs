import DefaultTheme from 'vitepress/theme'
import './custom.css'
import HeroSlideshow from './components/HeroSlideshow.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HeroSlideshow', HeroSlideshow)
  }
}
