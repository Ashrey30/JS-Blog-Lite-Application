import login from './components/login.js'
import register from './components/register.js'
import blog from './components/blog.js'
import follow_unfollow from './components/follow_unfollow.js'
import new_blog from './components/new_blog.js'
import search from './components/search.js'
import profile_page from './components/profile_page.js'
import update_profile from './components/update_profile.js'
import update_blog from './components/update_blog.js'

const router = new VueRouter({
    routes: [
        { path: '/', component: login, name: 'login' },
        { path: '/register', component: register, name: 'register' },
        { path: '/blog', component: blog, name: 'blog' },
        { path: '/follow_unfollow/:username', component: follow_unfollow, name: 'follow_unfollow' },
        { path: '/new_blog', component: new_blog, name: 'new_blog' },
        { path: '/profile_page', component: profile_page, name: 'profile_page' },
        { path: '/search/:username', component: search, name: 'search' },
        { path: '/update_profile', component: update_profile, name: 'update_profile' },
        { path: '/update_blog/:id', component: update_blog, name: 'update_blog' },
    ],
    base: '/'
})

new Vue({
    el: '#app',
    router: router
})